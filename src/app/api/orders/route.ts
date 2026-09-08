import { NextRequest } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { bad, isAdminResponse, ok, requireAdmin } from "@/lib/api"
import { genOrderNumber, parseJsonArray, effectivePrice } from "@/lib/utils"
import { getShipping, getSettings } from "@/lib/settings"
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/razorpay"

const createSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    phone: z.string().min(10),
    email: z.string().optional().default(""),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(5),
  }),
  items: z.array(z.object({ productId: z.number().int(), qty: z.number().int().min(1).max(99) })).min(1),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["RAZORPAY", "COD"]).default("RAZORPAY"),
})

export async function GET(req: NextRequest) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const sp = req.nextUrl.searchParams
  const status = sp.get("status") ?? undefined
  const take = Math.min(100, Number(sp.get("take")) || 50)
  const orders = await db.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take,
  })
  return ok(orders)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return bad("Invalid order data: " + parsed.error.issues[0]?.message)
  const d = parsed.data

  // Load products and validate stock/prices server-side
  const ids = d.items.map((i) => i.productId)
  const products = await db.product.findMany({ where: { id: { in: ids }, isActive: true } })
  if (products.length !== new Set(ids).size) return bad("Some products are unavailable")

  const lineItems = d.items.map((i) => {
    const p = products.find((p) => p.id === i.productId)!
    const price = effectivePrice(p)
    return { product: p, qty: i.qty, price }
  })
  for (const li of lineItems) {
    if (li.product.stock < li.qty) return bad(`Insufficient stock for ${li.product.name} (only ${li.product.stock} left)`)
  }

  const subtotal = lineItems.reduce((a, li) => a + li.price * li.qty, 0)

  // Coupon
  let discount = 0
  let couponCode: string | undefined
  if (d.couponCode?.trim()) {
    const coupon = await db.coupon.findUnique({ where: { code: d.couponCode.trim().toUpperCase() } })
    if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date()) && subtotal >= coupon.minOrder) {
      discount = coupon.type === "PERCENT" ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal)
      couponCode = coupon.code
    }
  }

  const { shipping } = await getShipping(subtotal - discount)
  const total = subtotal - discount + shipping

  const orderNumber = genOrderNumber()
  const settings = await getSettings()

  // Create order + items + decrement stock atomically
  const order = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        customerName: d.customer.name,
        email: d.customer.email ?? "",
        phone: d.customer.phone,
        address: d.customer.address,
        city: d.customer.city,
        state: d.customer.state,
        pincode: d.customer.pincode,
        subtotal,
        discount,
        shipping,
        total,
        couponCode,
        paymentMethod: d.paymentMethod,
        status: "PLACED",
        items: {
          create: lineItems.map((li) => ({
            productId: li.product.id,
            name: li.product.name,
            slug: li.product.slug,
            image: parseJsonArray<string>(li.product.images)[0] ?? "",
            price: li.price,
            qty: li.qty,
          })),
        },
      },
      include: { items: true },
    })
    for (const li of lineItems) {
      await tx.product.update({ where: { id: li.product.id }, data: { stock: { decrement: li.qty } } })
    }
    return created
  })

  // Payment setup
  if (d.paymentMethod === "RAZORPAY") {
    if (isRazorpayConfigured()) {
      try {
        const rzp = await createRazorpayOrder(Math.round(total * 100), orderNumber, { orderNumber })
        await db.order.update({ where: { id: order.id }, data: { razorpayOrderId: rzp.id } })
        return ok({
          orderNumber,
          payment: {
            keyId: process.env.RAZORPAY_KEY_ID,
            amount: rzp.amount,
            razorpayOrderId: rzp.id,
          },
        })
      } catch (e) {
        await db.order.update({ where: { id: order.id }, data: { paymentStatus: "FAILED" } })
        return bad(e instanceof Error ? e.message : "Payment gateway error — order saved, try COD", 502)
      }
    }
    // No live keys configured → demo mode
    return ok({ orderNumber, demo: true })
  }

  // COD
  void settings
  return ok({ orderNumber })
}
