"use client"

import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"
import { formatINR } from "@/lib/utils"

const FREE_SHIP = 499

export default function CartPage() {
  const { items, ready, subtotal, setQty, remove } = useCart()

  if (!ready) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-forest-900/50">Loading cart…</div>
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="card animate-fade-up mx-auto flex max-w-md flex-col items-center gap-4 p-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-100">
            <ShoppingBag className="h-7 w-7 text-leaf-600" />
          </span>
          <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
          <p className="text-sm text-forest-900/60">Discover the professional range and treat your hair &amp; skin.</p>
          <Link href="/products" className="btn-primary mt-2">Shop the Range</Link>
        </div>
      </div>
    )
  }

  const toFree = Math.max(0, FREE_SHIP - subtotal)
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIP) * 100))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="section-title mb-8">Your Cart ({items.length})</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="card flex items-center gap-3 p-4">
            <Truck className={`h-5 w-5 shrink-0 ${toFree === 0 ? "text-leaf-600" : "text-forest-900/40"}`} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-forest-950">
                {toFree === 0 ? (
                  <>You&apos;ve unlocked <span className="text-leaf-600">FREE shipping</span> 🎉</>
                ) : (
                  <>Add {formatINR(toFree)} more for <span className="text-leaf-600">FREE shipping</span></>
                )}
              </p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-forest-900/10">
                <div
                  className="h-full rounded-full bg-leaf-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          {items.map((i) => (
            <div key={i.id} className="card flex gap-4 p-4">
              <Link href={`/products/${i.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-lime-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/products/${i.slug}`} className="text-sm font-bold text-forest-950 hover:text-leaf-600">
                      {i.name}
                    </Link>
                    <div className="mt-0.5 text-xs text-forest-900/50">{i.size}</div>
                  </div>
                  <button
                    onClick={() => remove(i.id)}
                    className="text-forest-900/30 transition hover:text-red-500"
                    aria-label={`Remove ${i.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-full border border-forest-900/15 bg-white">
                    <button className="flex h-8 w-8 items-center justify-center" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold">{i.qty}</span>
                    <button className="flex h-8 w-8 items-center justify-center" onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-forest-950">{formatINR(i.price * i.qty)}</div>
                    {i.mrp > i.price && (
                      <div className="text-[11px] text-forest-900/40 line-through">{formatINR(i.mrp * i.qty)}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit space-y-4 p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-semibold">Order Summary</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-forest-900/60">Subtotal</span>
              <span className="font-semibold">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-forest-900/50">
              <span>Shipping &amp; coupons</span>
              <span>calculated at checkout</span>
            </div>
          </div>
          <div className="border-t border-forest-900/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-bold">Total</span>
              <span className="text-xl font-bold text-forest-950">{formatINR(subtotal)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary w-full">Proceed to Checkout</Link>
          <Link href="/products" className="btn-outline w-full !border-0 !bg-transparent text-forest-900/60 hover:!text-leaf-600">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
