"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export interface CartItem {
  id: number
  slug: string
  name: string
  price: number
  mrp: number
  image: string
  size: string
  qty: number
}

interface CartCtx {
  items: CartItem[]
  ready: boolean
  count: number
  subtotal: number
  add: (item: Omit<CartItem, "qty">, qty?: number) => void
  setQty: (id: number, qty: number) => void
  remove: (id: number) => void
  clear: () => void
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = "capilora_cart_v1"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(KEY, JSON.stringify(items))
      } catch {}
    }
  }, [items, ready])

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: Math.min(99, i.qty + qty) } : i))
      }
      return [...prev, { ...item, qty }]
    })
  }, [])

  const setQty = useCallback((id: number, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, qty) } : i))
    )
  }, [])

  const remove = useCallback((id: number) => setItems((prev) => prev.filter((i) => i.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((a, i) => a + i.qty, 0)
    const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0)
    return { items, ready, count, subtotal, add, setQty, remove, clear }
  }, [items, ready, add, setQty, remove, clear])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
