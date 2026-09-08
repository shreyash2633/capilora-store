"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { use, useCallback, useEffect, useState } from "react"
import { ArrowLeft, Loader2, MapPin, Phone } from "lucide-react"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface OrderDetail {
  id: string
  orderNumber: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  subtotal: number
  discount: number
  shipping: number
  total: number
  couponCode: string | null
  paymentMethod: string
  paymentStatus: string
  status: string
  razorpayOrderId: string | null
  razorpayPaymentId: string | null
  isDemoPayment: boolean
  createdAt: string
  items: { id: number; name: string; slug: string; image: string; price: number; qty: number }[]
}

const STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const orderId = id

  const load = useCallback(async () => {
    if (!orderId) return
    try {
      setOrder(await api<OrderDetail>(`/api/orders/${orderId}`))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load order")
    }
  }, [orderId])

  useEffect(() => {
    load()
  }, [load])

  async function update(data: { status?: string; paymentStatus?: string }) {
    setBusy(true)
    setError("")
    try {
      setOrder(await api<OrderDetail>(`/api/orders/${orderId}`, { method: "PATCH", json: data }))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed")
    } finally {
      setBusy(false)
    }
  }

  if (error && !order) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/admin/orders" className="btn-outline btn-sm mt-4">Back to Orders</Link>
      </div>
    )
  }
  if (!order) return <div className="card p-10 text-center text-sm text-forest-900/50">Loading order…</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button onClick={() => router.push("/admin/orders")} className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-forest-900/50 hover:text-leaf-600">
            <ArrowLeft className="h-3 w-3" /> All orders
          </button>
          <h1 className="font-display text-3xl font-semibold">{order.orderNumber}</h1>
          <p className="mt-1 text-xs text-forest-900/50">
            Placed {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={order.paymentStatus === "PAID" ? "leaf" : order.paymentStatus === "FAILED" ? "danger" : "amber"}>
            {order.paymentMethod} · {order.paymentStatus}{order.isDemoPayment ? " · DEMO" : ""}
          </Badge>
        </div>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-forest-900/50">Items</h2>
            <div className="space-y-3">
              {order.items.map((i) => (
                <div key={i.id} className="flex items-center gap-3 border-b border-forest-900/5 pb-3 last:border-0 last:pb-0">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-lime-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${i.slug}`} target="_blank" className="text-sm font-semibold hover:text-leaf-600">
                      {i.name}
                    </Link>
                    <div className="text-xs text-forest-900/50">{formatINR(i.price)} × {i.qty}</div>
                  </div>
                  <div className="text-sm font-bold">{formatINR(i.price * i.qty)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-forest-900/10 pt-4 text-sm">
              <div className="flex justify-between"><span className="text-forest-900/60">Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-leaf-600"><span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span><span>−{formatINR(order.discount)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-forest-900/60">Shipping</span><span>{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span></div>
              <div className="flex justify-between pt-1 text-base font-bold"><span>Total</span><span>{formatINR(order.total)}</span></div>
            </div>
          </section>

          {order.razorpayOrderId && (
            <section className="card p-6">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-forest-900/50">Payment Reference</h2>
              <div className="space-y-1 text-xs text-forest-900/60">
                <div>Razorpay Order ID: <span className="font-mono">{order.razorpayOrderId}</span></div>
                {order.razorpayPaymentId && <div>Payment ID: <span className="font-mono">{order.razorpayPaymentId}</span></div>}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-forest-900/50">Customer</h2>
            <div className="space-y-1 text-sm font-semibold">{order.customerName}</div>
            <div className="mt-1 space-y-1.5 text-xs text-forest-900/60">
              <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {order.phone}</div>
              {order.email && <div>{order.email}</div>}
              <div className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{order.address}, {order.city}, {order.state} — {order.pincode}</span>
              </div>
            </div>
            <a
              href={`https://wa.me/91${order.phone.replace(/\D/g, "").slice(-10)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline btn-sm mt-4 w-full"
            >
              WhatsApp Customer
            </a>
          </section>

          <section className="card space-y-4 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-forest-900/50">Fulfilment</h2>
            <div>
              <label className="label">Order Status</label>
              <select className="input" value={order.status} disabled={busy} onChange={(e) => update({ status: e.target.value })}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {order.status === "CANCELLED" && <p className="mt-1.5 text-[11px] text-forest-900/50">Items were returned to stock.</p>}
            </div>
            {order.paymentMethod === "COD" && order.paymentStatus !== "PAID" && (
              <button className="btn-primary btn-sm w-full" disabled={busy} onClick={() => update({ paymentStatus: "PAID" })}>
                {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Mark COD as Paid
              </button>
            )}
            {order.paymentMethod === "COD" && order.paymentStatus === "PAID" && (
              <button className="btn-outline btn-sm w-full" disabled={busy} onClick={() => update({ paymentStatus: "PENDING" })}>
                Undo Paid (COD)
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
