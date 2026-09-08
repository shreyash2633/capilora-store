"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Coupon {
  id: number
  code: string
  type: "PERCENT" | "FLAT"
  value: number
  minOrder: number
  isActive: boolean
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [form, setForm] = useState({ code: "", type: "PERCENT" as "PERCENT" | "FLAT", value: 10, minOrder: 0 })
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      setCoupons(await api<Coupon[]>("/api/coupons"))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load")
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function create() {
    setBusy(true)
    setError("")
    try {
      await api("/api/coupons", { method: "POST", json: form })
      setForm({ code: "", type: "PERCENT", value: 10, minOrder: 0 })
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed")
    } finally {
      setBusy(false)
    }
  }

  async function toggle(c: Coupon) {
    try {
      await api(`/api/coupons/${c.id}`, { method: "PUT", json: { isActive: !c.isActive } })
      await load()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed")
    }
  }

  async function remove(c: Coupon) {
    if (!confirm(`Delete coupon ${c.code}?`)) return
    try {
      await api(`/api/coupons/${c.id}`, { method: "DELETE" })
      await load()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Coupons</h1>
        <p className="mt-1 text-sm text-forest-900/60">Create discount codes customers can apply at checkout.</p>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest-900/10 text-left text-[11px] uppercase tracking-wide text-forest-900/50">
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3">Min Order</th>
                <th className="px-5 py-3">Active</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-forest-900/5 last:border-0">
                  <td className="px-5 py-3 font-mono font-bold text-forest-950">{c.code}</td>
                  <td className="px-5 py-3">
                    {c.type === "PERCENT" ? `${c.value}%` : formatINR(c.value)}
                  </td>
                  <td className="px-5 py-3 text-xs">{c.minOrder > 0 ? formatINR(c.minOrder) : "—"}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggle(c)}>
                      <Badge tone={c.isActive ? "leaf" : "outline"}>{c.isActive ? "Active" : "Off"}</Badge>
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => remove(c)} className="rounded-lg p-2 text-forest-900/50 transition hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-forest-900/50">No coupons yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card h-fit space-y-4 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-forest-900/50">New Coupon</h2>
          <div>
            <label className="label">Code</label>
            <input
              className="input font-mono uppercase"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="SUMMER25"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "PERCENT" | "FLAT" })}>
                <option value="PERCENT">% Off</option>
                <option value="FLAT">₹ Flat</option>
              </select>
            </div>
            <div>
              <label className="label">Value</label>
              <input className="input" type="number" min={1} value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="label">Minimum Order (₹)</label>
            <input className="input" type="number" min={0} value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} />
          </div>
          <button className="btn-primary btn-sm w-full" onClick={create} disabled={busy || form.code.trim().length < 2}>
            <Plus className="h-4 w-4" /> Create Coupon
          </button>
        </div>
      </div>
    </div>
  )
}
