"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, Trash2, Upload } from "lucide-react"
import { api } from "@/lib/client"
import { slugify } from "@/lib/utils"

interface Category {
  id: number
  name: string
  slug: string
}

interface ProductData {
  id?: number
  name: string
  slug?: string
  tagline: string
  description: string
  benefits: string[]
  ingredients: string
  size: string
  mrp: number
  salePrice: number | null
  stock: number
  images: string[]
  badge: string
  isActive: boolean
  isFeatured: boolean
  categoryId: number
}

const EMPTY: ProductData = {
  name: "",
  tagline: "",
  description: "",
  benefits: [""],
  ingredients: "",
  size: "",
  mrp: 0,
  salePrice: null,
  stock: 0,
  images: [],
  badge: "",
  isActive: true,
  isFeatured: false,
  categoryId: 0,
}

export function ProductForm({ productId }: { productId?: number }) {
  const router = useRouter()
  const [cats, setCats] = useState<Category[]>([])
  const [d, setD] = useState<ProductData>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const cs = await api<Category[]>("/api/categories")
        setCats(cs)
        if (productId) {
          const p = await api<Record<string, unknown>>(`/api/products/${productId}`)
          setD({
            id: p.id as number,
            name: String(p.name ?? ""),
            slug: String(p.slug ?? ""),
            tagline: String(p.tagline ?? ""),
            description: String(p.description ?? ""),
            benefits: Array.isArray(p.benefits) ? (p.benefits as string[]) : [],
            ingredients: String(p.ingredients ?? ""),
            size: String(p.size ?? ""),
            mrp: Number(p.mrp ?? 0),
            salePrice: p.salePrice == null ? null : Number(p.salePrice),
            stock: Number(p.stock ?? 0),
            images: Array.isArray(p.images) ? (p.images as string[]) : [],
            badge: String(p.badge ?? ""),
            isActive: Boolean(p.isActive),
            isFeatured: Boolean(p.isFeatured),
            categoryId: Number(p.categoryId ?? cs[0]?.id ?? 0),
          })
        } else {
          setD((prev) => ({ ...prev, categoryId: cs[0]?.id ?? 0 }))
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load")
      } finally {
        setLoading(false)
      }
    })()
  }, [productId])

  const set = <K extends keyof ProductData>(k: K, v: ProductData[K]) => setD((prev) => ({ ...prev, [k]: v }))

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError("")
    try {
      const fd = new FormData()
      for (const f of Array.from(files)) fd.append("files", f)
      const res = await api<{ paths: string[] }>("/api/upload", { method: "POST", body: fd })
      setD((prev) => ({ ...prev, images: [...prev.images, ...res.paths] }))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    setError("")
    if (!d.name.trim()) return setError("Product name is required")
    if (!d.categoryId) return setError("Choose a category")
    if (d.mrp <= 0) return setError("MRP must be greater than 0")
    setSaving(true)
    try {
      const payload = {
        name: d.name.trim(),
        slug: d.slug?.trim() ? slugify(d.slug) : slugify(d.name),
        tagline: d.tagline,
        description: d.description,
        benefits: d.benefits.filter((b) => b.trim()),
        ingredients: d.ingredients,
        size: d.size,
        mrp: d.mrp,
        salePrice: d.salePrice,
        stock: d.stock,
        images: d.images,
        badge: d.badge.trim() || null,
        isActive: d.isActive,
        isFeatured: d.isFeatured,
        categoryId: d.categoryId,
      }
      if (productId) {
        await api(`/api/products/${productId}`, { method: "PUT", json: payload })
      } else {
        await api("/api/products", { method: "POST", json: payload })
      }
      router.push("/admin/products")
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
      setSaving(false)
    }
  }

  if (loading) return <div className="card p-10 text-center text-sm text-forest-900/50">Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">{productId ? "Edit Product" : "New Product"}</h1>
        <div className="flex gap-2">
          <button className="btn-outline btn-sm" onClick={() => router.push("/admin/products")}>Cancel</button>
          <button className="btn-primary btn-sm" onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save Product
          </button>
        </div>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="card space-y-4 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-forest-900/50">Basics</h2>
            <div>
              <label className="label">Product Name *</label>
              <input className="input" value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Vitamin C Face Serum" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Slug (URL)</label>
                <input className="input" value={d.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" />
              </div>
              <div>
                <label className="label">Size / Net Content</label>
                <input className="input" value={d.size} onChange={(e) => set("size", e.target.value)} placeholder="30 ml" />
              </div>
            </div>
            <div>
              <label className="label">Tagline</label>
              <input className="input" value={d.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Short marketing one-liner" />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input min-h-28" value={d.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div>
              <label className="label">Key Benefits (one per line)</label>
              <textarea
                className="input min-h-24"
                value={d.benefits.join("\n")}
                onChange={(e) => set("benefits", e.target.value.split("\n"))}
                placeholder={"Benefit one\nBenefit two"}
              />
            </div>
            <div>
              <label className="label">Full Ingredient List (INCI)</label>
              <textarea className="input min-h-24" value={d.ingredients} onChange={(e) => set("ingredients", e.target.value)} />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card space-y-4 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-forest-900/50">Pricing &amp; Stock</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">MRP (₹) *</label>
                <input className="input" type="number" min={0} value={d.mrp} onChange={(e) => set("mrp", Number(e.target.value))} />
              </div>
              <div>
                <label className="label">Sale Price (₹)</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={d.salePrice ?? ""}
                  placeholder="same as MRP"
                  onChange={(e) => set("salePrice", e.target.value === "" ? null : Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="label">Stock (units)</label>
              <input className="input" type="number" min={0} value={d.stock} onChange={(e) => set("stock", Number(e.target.value))} />
            </div>
          </section>

          <section className="card space-y-4 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-forest-900/50">Organisation</h2>
            <div>
              <label className="label">Category *</label>
              <select className="input" value={d.categoryId} onChange={(e) => set("categoryId", Number(e.target.value))}>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Badge (e.g. Bestseller)</label>
              <input className="input" value={d.badge} onChange={(e) => set("badge", e.target.value)} placeholder="optional" />
            </div>
            <label className="flex items-center gap-2.5 text-sm font-semibold">
              <input type="checkbox" className="h-4 w-4 accent-[#5C9139]" checked={d.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2.5 text-sm font-semibold">
              <input type="checkbox" className="h-4 w-4 accent-[#5C9139]" checked={d.isActive} onChange={(e) => set("isActive", e.target.checked)} />
              Visible in store
            </label>
          </section>

          <section className="card space-y-3 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-forest-900/50">Images</h2>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-forest-900/20 p-5 text-center transition hover:border-leaf-500">
              {uploading ? <Loader2 className="h-5 w-5 animate-spin text-leaf-600" /> : <Upload className="h-5 w-5 text-leaf-600" />}
              <span className="text-xs font-semibold text-forest-900/60">Click to upload images (JPG/PNG/WebP, max 8 MB)</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
            </label>
            {d.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {d.images.map((src, i) => (
                  <div key={`${src}-${i}`} className="group relative overflow-hidden rounded-lg bg-lime-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="aspect-square w-full object-cover" />
                    <button
                      onClick={() => set("images", d.images.filter((_, j) => j !== i))}
                      className="absolute right-1 top-1 rounded-md bg-white/90 p-1 text-red-500 opacity-0 transition group-hover:opacity-100"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-forest-900/80 px-1.5 py-0.5 text-[9px] font-bold text-white">MAIN</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="text-[11px] text-forest-900/40">First image is the main product photo shown in listings.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
