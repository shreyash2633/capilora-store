"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Minus, Plus, ShoppingBag, Zap } from "lucide-react"
import { useCart, type CartItem } from "@/components/providers/cart-provider"

export function AddToCart({
  product,
}: {
  product: Omit<CartItem, "qty"> & { stock: number }
}) {
  const { add } = useCart()
  const router = useRouter()
  const [qty, setQtyLocal] = useState(1)
  const [added, setAdded] = useState(false)
  const outOfStock = product.stock <= 0

  const payload = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    mrp: product.mrp,
    image: product.image,
    size: product.size,
  }

  function handleAdd() {
    add(payload, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  function handleBuyNow() {
    add(payload, qty)
    router.push("/checkout")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-forest-900/15 bg-white">
          <button
            className="flex h-11 w-11 items-center justify-center text-forest-900 transition hover:text-leaf-600 disabled:opacity-30"
            onClick={() => setQtyLocal((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-bold">{qty}</span>
          <button
            className="flex h-11 w-11 items-center justify-center text-forest-900 transition hover:text-leaf-600"
            onClick={() => setQtyLocal((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-xs font-medium text-forest-900/50">
          {outOfStock ? "Out of stock" : `${product.stock} in stock`}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="btn-primary flex-1" onClick={handleAdd} disabled={outOfStock}>
          <ShoppingBag className="h-4 w-4" />
          {added ? "Added to cart ✓" : "Add to Cart"}
        </button>
        <button className="btn-dark flex-1" onClick={handleBuyNow} disabled={outOfStock}>
          <Zap className="h-4 w-4" /> Buy It Now
        </button>
      </div>
    </div>
  )
}
