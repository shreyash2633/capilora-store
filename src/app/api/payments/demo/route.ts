import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { bad, ok } from "@/lib/api"
import { isRazorpayConfigured } from "@/lib/razorpay"

/**
 * Marks an order as paid WITHOUT a real gateway — only allowed while
 * Razorpay keys are not configured (local/demo mode). This keeps the full
 * order flow testable end-to-end before live keys are added.
 */
export async function POST(req: NextRequest) {
  if (isRazorpayConfigured()) {
    return bad("Demo payments are disabled because live Razorpay keys are configured", 403)
  }

  const body = await req.json().catch(() => null)
  const orderNumber = (body as { orderNumber?: string })?.orderNumber
  if (!orderNumber) return bad("Missing orderNumber")

  const order = await db.order.findUnique({ where: { orderNumber } })
  if (!order) return bad("Order not found", 404)
  if (order.paymentStatus === "PAID") return ok({ ok: true, alreadyPaid: true })

  await db.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      razorpayOrderId: `demo_order_${order.orderNumber}`,
      razorpayPaymentId: `demo_pay_${Date.now()}`,
      isDemoPayment: true,
    },
  })
  return ok({ ok: true, demo: true })
}
