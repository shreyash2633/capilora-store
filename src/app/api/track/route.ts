import { db } from "@/lib/db"
import { bad, ok } from "@/lib/api"

export const dynamic = "force-dynamic"

const TIMELINE = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"] as const

export async function GET(req: Request) {
  const url = new URL(req.url)
  const orderNumber = (url.searchParams.get("order") ?? "").trim().toUpperCase()
  const phone = (url.searchParams.get("phone") ?? "").replace(/\D/g, "").slice(-4)

  if (!orderNumber || phone.length !== 4) {
    return bad("Enter your order number and the last 4 digits of your phone number.")
  }

  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  })

  if (!order || order.phone.replace(/\D/g, "").slice(-4) !== phone) {
    return bad("No order found with those details. Double-check and try again.")
  }

  const stepIndex = TIMELINE.indexOf(order.status as (typeof TIMELINE)[number])
  const cancelled = order.status === "CANCELLED"

  return ok({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    placedAt: order.createdAt,
    cancelled,
    stepIndex: stepIndex < 0 ? 0 : stepIndex,
    total: order.total,
    items: order.items.map((i) => ({ name: i.name, image: i.image, qty: i.qty, price: i.price })),
  })
}
