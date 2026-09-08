import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { bad, ok } from "@/lib/api"
import { verifyRazorpaySignature } from "@/lib/razorpay"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const b = body as {
    orderNumber?: string
    razorpay_order_id?: string
    razorpay_payment_id?: string
    razorpay_signature?: string
  }

  if (!b?.orderNumber || !b.razorpay_order_id || !b.razorpay_payment_id || !b.razorpay_signature) {
    return bad("Missing payment verification fields")
  }

  const order = await db.order.findUnique({ where: { orderNumber: b.orderNumber } })
  if (!order) return bad("Order not found", 404)
  if (order.paymentStatus === "PAID") return ok({ ok: true, alreadyPaid: true })

  const valid = verifyRazorpaySignature(b.razorpay_order_id, b.razorpay_payment_id, b.razorpay_signature)
  if (!valid) {
    await db.order.update({ where: { id: order.id }, data: { paymentStatus: "FAILED" } })
    return bad("Payment signature verification failed", 400)
  }

  await db.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      razorpayPaymentId: b.razorpay_payment_id,
      isDemoPayment: false,
    },
  })
  return ok({ ok: true })
}
