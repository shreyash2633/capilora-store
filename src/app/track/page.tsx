"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CheckCircle2, Circle, Loader2, PackageSearch, Truck, XCircle } from "lucide-react"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/utils"

interface TrackResult {
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  placedAt: string
  cancelled: boolean
  stepIndex: number
  total: number
  items: { name: string; image: string; qty: number; price: number }[]
}

const STEPS = ["Order placed", "Confirmed", "Shipped", "Delivered"]

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [result, setResult] = useState<TrackResult | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Prefill order number when arriving from /order/success?order=CP-XXXX
    const o = new URLSearchParams(window.location.search).get("order")
    if (o) setOrderNumber(o.toUpperCase())
  }, [])

  async function track(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setResult(null)
    setLoading(true)
    try {
      const res = await api<TrackResult>(
        `/api/track?order=${encodeURIComponent(orderNumber.trim())}&phone=${encodeURIComponent(phone.trim())}`
      )
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not track order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-lime-100">
          <PackageSearch className="h-6 w-6 text-leaf-600" />
        </span>
        <h1 className="section-title">Track Your Order</h1>
        <p className="mt-2 text-sm text-forest-900/60">
          Enter the order number from your confirmation along with your phone number.
        </p>
      </div>

      <form onSubmit={track} className="card space-y-4 p-6 sm:p-8">
        <div>
          <label className="label">Order Number</label>
          <input
            className="input uppercase"
            placeholder="e.g. CP-XXXXXX"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            required
          />
        </div>
        <div>
          <label className="label">Last 4 digits of phone number</label>
          <input
            className="input"
            placeholder="e.g. 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            maxLength={4}
            required
          />
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
          {loading ? "Tracking…" : "Track Order"}
        </button>
      </form>

      {result && (
        <div className="card animate-fade-up mt-8 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="eyebrow mb-1">Order</div>
              <div className="font-display text-2xl font-semibold text-forest-950">{result.orderNumber}</div>
              <div className="mt-1 text-xs text-forest-900/50">
                Placed {new Date(result.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                {" · "}
                {result.paymentMethod === "COD" ? "Cash on Delivery" : "Paid online"}
                {result.paymentStatus === "PAID" ? " ✓" : ""}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-forest-900/50">Total</div>
              <div className="text-xl font-bold text-forest-950">{formatINR(result.total)}</div>
            </div>
          </div>

          {result.cancelled ? (
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              <XCircle className="h-5 w-5" /> This order was cancelled. Contact support for help.
            </div>
          ) : (
            <ol className="mt-8 space-y-0">
              {STEPS.map((s, i) => {
                const done = i <= result.stepIndex
                const isLast = i === STEPS.length - 1
                return (
                  <li key={s} className="relative flex gap-4 pb-8 last:pb-0">
                    {!isLast && (
                      <span
                        className={`absolute left-[11px] top-6 h-full w-0.5 ${i < result.stepIndex ? "bg-leaf-500" : "bg-forest-900/10"}`}
                      />
                    )}
                    {done ? (
                      <CheckCircle2 className="relative z-10 h-6 w-6 shrink-0 text-leaf-600" />
                    ) : (
                      <Circle className="relative z-10 h-6 w-6 shrink-0 text-forest-900/20" />
                    )}
                    <div className={done ? "font-semibold text-forest-950" : "text-forest-900/40"}>
                      <div className="text-sm">{s}</div>
                      {i === result.stepIndex && (
                        <div className="text-xs font-medium text-leaf-600">Current status</div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          )}

          <div className="mt-6 space-y-2 border-t border-forest-900/10 pt-5">
            {result.items.map((i, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-lime-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <div className="truncate font-semibold">{i.name}</div>
                  <div className="text-xs text-forest-900/50">Qty {i.qty}</div>
                </div>
                <div className="text-sm font-bold">{formatINR(i.price * i.qty)}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="btn-outline btn-sm">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  )
}
