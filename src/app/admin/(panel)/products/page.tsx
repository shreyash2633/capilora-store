"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { Pencil, Plus, Star, Trash2 } from "lucide-react"
import { api } from "@/lib/client"
import { formatINR, parseJsonArray } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface AdminProduct {
  id: number
  slug: string
  name: string
  tagline: string
  size: string
  mrp: number
  salePrice: number | null
  stock: number
  images: string
  badge: string | null
  isActive: boolean
  isFeatured: boolean
  category: { id: number; name: string; slug: string }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    try {
      setProducts(await api<AdminProduct[]>("/api/products?admin=1"))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function remove(p: AdminProduct) {
    if (!confirm(`Delete “${p.name}”? This cannot be undone.`)) return
    try {
      await api(`/api/products/${p.id}`, { method: "DELETE" })
      setProducts((prev) => prev.filter((x) => x.id !== p.id))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-forest-900/60">{products.length} products in catalog</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary btn-sm">
          <Plus className="h-4 w-4" /> New Product
        </Link>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-sm text-forest-900/50">Loading products…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest-900/10 text-left text-[11px] uppercase tracking-wide text-forest-900/50">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Flags</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = parseJsonArray<string>(p.images)[0]
                return (
                  <tr key={p.id} className="border-b border-forest-900/5 last:border-0 hover:bg-lime-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-lime-50">
                          {img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img} alt="" className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-forest-950">{p.name}</div>
                          <div className="text-[11px] text-forest-900/40">{p.size} · /{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs">{p.category?.name}</td>
                    <td className="px-5 py-3">
                      <div className="font-bold">{formatINR(p.salePrice ?? p.mrp)}</div>
                      {p.salePrice != null && p.salePrice < p.mrp && (
                        <div className="text-[11px] text-forest-900/40 line-through">{formatINR(p.mrp)}</div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={p.stock <= 5 ? "danger" : p.stock <= 15 ? "amber" : "leaf"}>{p.stock} pcs</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.isFeatured && <Badge tone="leaf"><Star className="h-3 w-3" /> Featured</Badge>}
                        <Badge tone={p.isActive ? "outline" : "danger"}>{p.isActive ? "Active" : "Hidden"}</Badge>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="rounded-lg p-2 text-forest-900/60 transition hover:bg-lime-100 hover:text-forest-950"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => remove(p)}
                          className="rounded-lg p-2 text-forest-900/60 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
