import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { bad, isAdminResponse, ok, requireAdmin } from "@/lib/api"

const ORDER_STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED"]

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const { id } = await params
  const order = await db.order.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { slug: true } } } } },
  })
  if (!order) return bad("Order not found", 404)
  return ok(order)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const { id } = await params
  const body = await req.json().catch(() => null)
  const b = body as { status?: string; paymentStatus?: string }
  const orderId = id

  const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true } })
  if (!order) return bad("Order not found", 404)

  const data: Record<string, unknown> = {}
  if (b.status) {
    if (!ORDER_STATUSES.includes(b.status)) return bad("Invalid status")
    data.status = b.status
    // Restock when cancelling an order that wasn't already cancelled
    if (b.status === "CANCELLED" && order.status !== "CANCELLED") {
      await db.$transaction(
        order.items.map((i) =>
          db.product.update({ where: { id: i.productId }, data: { stock: { increment: i.qty } } })
        )
      )
    }
  }
  if (b.paymentStatus) {
    if (!PAYMENT_STATUSES.includes(b.paymentStatus)) return bad("Invalid payment status")
    data.paymentStatus = b.paymentStatus
  }

  const updated = await db.order.update({ where: { id: orderId }, data, include: { items: true } })
  return ok(updated)
}
