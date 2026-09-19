import Link from "next/link"
import { CheckCircle2, MessageCircle } from "lucide-react"
import { db } from "@/lib/db"
import { getSettings } from "@/lib/settings"
import { formatINR } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const metadata = { title: "Order Confirmed" }

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order: orderNumber } = await searchParams
  const settings = await getSettings()

  const order = orderNumber
    ? await db.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      })
    : null

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Order not found</h1>
        <p className="mt-2 text-sm text-forest-900/60">Check your order confirmation or contact support.</p>
        <Link href="/products" className="btn-primary mt-6">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="card p-8 text-center sm:p-10">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-lime-100">
          <CheckCircle2 className="h-8 w-8 text-leaf-600" />
        </span>
        <h1 className="font-display text-3xl font-semibold text-forest-950">Thank you, {order.customerName.split(" ")[0]}!</h1>
        <p className="mt-2 text-sm text-forest-900/60">
          Your order <span className="font-bold text-forest-950">{order.orderNumber}</span> is confirmed. We&apos;ll update you on WhatsApp at {order.phone}.
        </p>

        <div className="mt-8 space-y-3 text-left">
          {order.items.map((i) => (
            <div key={i.id} className="flex items-center gap-3 rounded-xl bg-lime-50 p-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 text-sm">
                <div className="font-semibold">{i.name}</div>
                <div className="text-xs text-forest-900/50">Qty {i.qty} · {formatINR(i.price)}</div>
              </div>
              <div className="text-sm font-bold">{formatINR(i.price * i.qty)}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-1.5 border-t border-forest-900/10 pt-5 text-sm">
          <div className="flex justify-between"><span className="text-forest-900/60">Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-leaf-600"><span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span><span>−{formatINR(order.discount)}</span></div>
          )}
          <div className="flex justify-between"><span className="text-forest-900/60">Shipping</span><span>{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span></div>
          <div className="flex justify-between pt-2 text-base font-bold"><span>Total {order.paymentMethod === "COD" ? "(COD)" : "(Paid)"}</span><span>{formatINR(order.total)}</span></div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${settings.contactWhatsApp}?text=${encodeURIComponent(
              `Hi Capilora! I placed order ${order.orderNumber}. Please confirm.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            <MessageCircle className="h-4 w-4" /> Confirm on WhatsApp
          </a>
          <Link href={`/track?order=${order.orderNumber}`} className="btn-outline">
            Track Order
          </Link>
        </div>
        <Link href="/products" className="mt-4 inline-block text-sm font-semibold text-leaf-600 hover:underline">
          Continue shopping →
        </Link>
      </div>
    </div>
  )
}
