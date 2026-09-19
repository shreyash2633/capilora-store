"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Loader2, ShoppingBag, Star } from "lucide-react"
import { Price } from "./price"
import { useCart } from "@/components/providers/cart-provider"
import { discountPercent, parseJsonArray } from "@/lib/utils"

export interface ProductCardData {
  id: number
  slug: string
  name: string
  tagline: string
  size: string
  mrp: number
  salePrice: number | null
  images: string
  badge: string | null
}

export function ProductCard({ p, index = 0 }: { p: ProductCardData; index?: number }) {
  const images = parseJsonArray<string>(p.images)
  const img = images[0] || "/icon.svg"
  const img2 = images[1] || ""
  const off = discountPercent(p)
  const { add } = useCart()
  const [state, setState] = useState<"idle" | "busy" | "done">("idle")

  async function quickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (state !== "idle") return
    setState("busy")
    add({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.salePrice ?? p.mrp,
      mrp: p.mrp,
      image: img,
      size: p.size,
    })
    await new Promise((r) => setTimeout(r, 450))
    setState("done")
    setTimeout(() => setState("idle"), 1400)
  }

  return (
    <Link
      href={`/products/${p.slug}`}
      className={`group card animate-fade-up overflow-hidden p-2.5 transition duration-300 hover:-translate-y-1.5 hover:shadow-soft anim-d${(index % 6) + 1}`}
    >
      {/* Double bezel: white frame around a soft-tinted image plate */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-lime-50 ring-1 ring-forest-900/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={p.name}
          className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.07] ${img2 ? "group-hover:opacity-0" : ""}`}
          loading="lazy"
        />
        {img2 && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={img2}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-[1.07] object-cover opacity-0 transition duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
            loading="lazy"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {p.badge ? (
            <span className="badge bg-forest-900 text-lime-100 shadow-sm">{p.badge}</span>
          ) : null}
          {off > 0 ? (
            <span className="badge bg-apricot-500 text-forest-950 shadow-sm">{off}% OFF</span>
          ) : null}
        </div>

        <button
          onClick={quickAdd}
          disabled={state !== "idle"}
          className={`absolute bottom-3 right-3 inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-bold shadow-lg transition-all duration-300 ${
            state === "done"
              ? "bg-forest-900 text-lime-100"
              : "bg-white text-forest-950 hover:bg-forest-900 hover:text-lime-100"
          } ${state === "idle" ? "translate-y-1.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100" : ""}`}
          aria-label={`Add ${p.name} to cart`}
        >
          {state === "busy" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : state === "done" ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <ShoppingBag className="h-3.5 w-3.5" />
          )}
          {state === "done" ? "Added" : "Add"}
        </button>
      </div>

      <div className="space-y-1 px-2 pb-1.5 pt-3">
        <div className="flex items-center gap-1 text-[11px] font-bold text-berry-600">
          <Star className="h-3 w-3 fill-berry-400 text-berry-400" /> 4.8
          <span className="font-medium text-forest-900/45">· Professional Grade</span>
        </div>
        <h3 className="line-clamp-1 font-semibold text-forest-950">{p.name}</h3>
        <p className="line-clamp-1 text-xs text-forest-900/55">{p.tagline}</p>
        <div className="flex items-center justify-between pt-1.5">
          <Price mrp={p.mrp} salePrice={p.salePrice} />
          <span className="text-[11px] font-semibold text-forest-900/45">{p.size}</span>
        </div>
      </div>
    </Link>
  )
}
