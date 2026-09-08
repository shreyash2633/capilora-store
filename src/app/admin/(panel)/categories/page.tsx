"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { api } from "@/lib/client"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  _count: { products: number }
}

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      setCats(await api<Category[]>("/api/categories"))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load")
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function create() {
    if (!name.trim()) return
    setBusy(true)
    setError("")
    try {
      await api("/api/categories", { method: "POST", json: { name, description } })
      setName("")
      setDescription("")
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed")
    } finally {
      setBusy(false)
    }
  }

  async function remove(c: Category) {
    if (!confirm(`Delete category “${c.name}”?`)) return
    try {
      await api(`/api/categories/${c.id}`, { method: "DELETE" })
      await load()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Categories</h1>
        <p className="mt-1 text-sm text-forest-900/60">Organise your catalog.</p>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest-900/10 text-left text-[11px] uppercase tracking-wide text-forest-900/50">
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Products</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c.id} className="border-b border-forest-900/5 last:border-0">
                  <td className="px-5 py-3">
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-[11px] text-forest-900/40">/{c.slug}</div>
                  </td>
                  <td className="px-5 py-3"><Badge tone="leaf">{c._count.products}</Badge></td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => remove(c)} className="rounded-lg p-2 text-forest-900/50 transition hover:bg-red-50 hover:text-red-600" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {cats.length === 0 && (
                <tr><td colSpan={3} className="px-5 py-8 text-center text-sm text-forest-900/50">No categories yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card h-fit space-y-4 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-forest-900/50">Add Category</h2>
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Body Care" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-20" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button className="btn-primary btn-sm w-full" onClick={create} disabled={busy || !name.trim()}>
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>
      </div>
    </div>
  )
}
