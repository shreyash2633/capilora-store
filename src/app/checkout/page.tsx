"use client"

import Link from "next/link"
import Script from "next/script"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BadgePercent, Banknote, CreditCard, Loader2, ShieldCheck } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/utils"

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void }
  }
}

interface AppliedCoupon {
  code: string
  discount: number
}

export default function CheckoutPage() {
  const { items, ready, subtotal, clear } = useCart()
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY")
  const [couponInput, setCouponInput] = useState("")
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null)
  const [couponMsg, setCouponMsg] = useState("")
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (ready && items.length === 0) router.replace("/cart")
  }, [ready, items.length, router])

  const discount = coupon?.discount ?? 0
  const afterDiscount = Math.max(0, subtotal - discount)
  const shipping = afterDiscount >= 499 ? 0 : 49
  const total = afterDiscount + shipping

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function applyCoupon() {
    setCouponMsg("")
    if (!couponInput.trim()) return
    try {
      const res = await api<{ ok: boolean; discount: number; code: string; message?: string }>("/api/coupons/validate", {
        method: "POST",
        json: { code: couponInput.trim(), subtotal },
      })
      if (res.ok) {
        setCoupon({ code: res.code, discount: res.discount })
        setCouponMsg(`✓ ${res.code} applied — you save ${formatINR(res.discount)}`)
      } else {
        setCoupon(null)
        setCouponMsg(res.message || "Coupon not valid")
      }
    } catch (e) {
      setCoupon(null)
      setCouponMsg(e instanceof Error ? e.message : "Could not validate coupon")
    }
  }

  async function placeOrder() {
    setError("")
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      setError("Please fill all required delivery details.")
      return
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, "").slice(-10))) {
      setError("Please enter a valid 10-digit phone number.")
      return
    }
    setPlacing(true)
    try {
      const order = await api<{
        orderNumber: string
        demo?: boolean
        payment?: { keyId: string; amount: number; razorpayOrderId: string }
      }>("/api/orders", {
        method: "POST",
        json: {
          customer: form,
          items: items.map((i) => ({ productId: i.id, qty: i.qty })),
          couponCode: coupon?.code ?? undefined,
          paymentMethod,
        },
      })

      if (paymentMethod === "COD") {
        clear()
        router.push(`/order/success?order=${order.orderNumber}`)
        return
      }

      if (order.demo) {
        await api("/api/payments/demo", { method: "POST", json: { orderNumber: order.orderNumber } })
        clear()
        router.push(`/order/success?order=${order.orderNumber}&demo=1`)
        return
      }

      const rzp = order.payment!
      if (!window.Razorpay) {
        await new Promise<void>((resolve) => {
          const s = document.createElement("script")
          s.src = "https://checkout.razorpay.com/v1/checkout.js"
          s.onload = () => resolve()
          s.onerror = () => resolve()
          document.body.appendChild(s)
        })
      }
      if (!window.Razorpay) throw new Error("Could not load payment gateway. Check your connection and try again.")

      const rz = new window.Razorpay({
        key: rzp.keyId,
        amount: rzp.amount,
        currency: "INR",
        name: "Capilora Professional",
        description: `Order ${order.orderNumber}`,
        order_id: rzp.razorpayOrderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#5C9139" },
        handler: async (response: Record<string, string>) => {
          try {
            await api("/api/payments/razorpay/verify", {
              method: "POST",
              json: { orderNumber: order.orderNumber, ...response },
            })
            clear()
            router.push(`/order/success?order=${order.orderNumber}`)
          } catch (e) {
            setError(e instanceof Error ? e.message : "Payment verification failed")
            setPlacing(false)
          }
        },
        modal: {
          ondismiss: () => {
            setPlacing(false)
            setError("Payment cancelled. Your order is saved as pending — you can retry or choose COD.")
          },
        },
      })
      rz.open()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not place order")
      setPlacing(false)
    }
  }

  if (!ready) return null

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <h1 className="section-title mb-8">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="mb-4 font-display text-xl font-semibold">Delivery Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Full Name *</label>
                <input className="input" value={form.name} onChange={set("name")} placeholder="Your full name" />
              </div>
              <div>
                <label className="label">Phone (10 digits) *</label>
                <input className="input" value={form.phone} onChange={set("phone")} placeholder="98XXXXXXXX" inputMode="tel" />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" value={form.email} onChange={set("email")} placeholder="you@email.com" type="email" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Address *</label>
                <textarea className="input min-h-20" value={form.address} onChange={set("address")} placeholder="House no, street, landmark" />
              </div>
              <div>
                <label className="label">City *</label>
                <input className="input" value={form.city} onChange={set("city")} />
              </div>
              <div>
                <label className="label">State *</label>
                <input className="input" value={form.state} onChange={set("state")} />
              </div>
              <div>
                <label className="label">PIN Code *</label>
                <input className="input" value={form.pincode} onChange={set("pincode")} inputMode="numeric" maxLength={6} />
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="mb-4 font-display text-xl font-semibold">Payment Method</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setPaymentMethod("RAZORPAY")}
                className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                  paymentMethod === "RAZORPAY" ? "border-leaf-500 bg-lime-50" : "border-forest-900/10 bg-white hover:border-leaf-300"
                }`}
              >
                <CreditCard className="mt-0.5 h-5 w-5 text-leaf-600" />
                <div>
                  <div className="text-sm font-bold">UPI / Cards / NetBanking</div>
                  <div className="text-xs text-forest-900/60">Secure payment via Razorpay</div>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod("COD")}
                className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                  paymentMethod === "COD" ? "border-leaf-500 bg-lime-50" : "border-forest-900/10 bg-white hover:border-leaf-300"
                }`}
              >
                <Banknote className="mt-0.5 h-5 w-5 text-leaf-600" />
                <div>
                  <div className="text-sm font-bold">Cash on Delivery</div>
                  <div className="text-xs text-forest-900/60">Pay when your order arrives</div>
                </div>
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-4 lg:sticky lg:top-28 lg:h-fit">
          <div className="card p-6">
            <h2 className="mb-4 font-display text-xl font-semibold">Order Summary</h2>
            <div className="mb-4 space-y-3">
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-lime-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-forest-900 text-[9px] font-bold text-white">
                      {i.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold">{i.name}</div>
                    <div className="text-[11px] text-forest-900/50">{i.size}</div>
                  </div>
                  <div className="text-xs font-bold">{formatINR(i.price * i.qty)}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                className="input !py-2 text-xs"
                placeholder="Coupon code e.g. WELCOME10"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              />
              <button className="btn-outline btn-sm shrink-0" onClick={applyCoupon} type="button">
                <BadgePercent className="h-3.5 w-3.5" /> Apply
              </button>
            </div>
            {couponMsg && <p className={`mt-2 text-xs font-medium ${coupon ? "text-leaf-600" : "text-red-500"}`}>{couponMsg}</p>}

            <div className="mt-4 space-y-2 border-t border-forest-900/10 pt-4 text-sm">
              <div className="flex justify-between"><span className="text-forest-900/60">Subtotal</span><span>{formatINR(subtotal)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-leaf-600"><span>Coupon {coupon?.code}</span><span>−{formatINR(discount)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-forest-900/60">Shipping</span><span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span></div>
              <div className="flex justify-between border-t border-forest-900/10 pt-3 text-base font-bold">
                <span>Total</span><span>{formatINR(total)}</span>
              </div>
            </div>

            {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">{error}</p>}

            <button className="btn-primary mt-4 w-full" onClick={placeOrder} disabled={placing || items.length === 0}>
              {placing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {placing ? "Placing order…" : paymentMethod === "COD" ? "Place Order (COD)" : `Pay ${formatINR(total)}`}
            </button>
            <p className="mt-3 text-center text-[11px] text-forest-900/50">
              By placing this order you agree to our{" "}
              <Link href="/terms" className="underline">Terms</Link> &amp;{" "}
              <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
