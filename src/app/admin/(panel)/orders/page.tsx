"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AdminOrder {
  id: string
  orderNumber: string
  customerName: string
  phone: string
  total: number
  paymentMethod: string
  paymentStatus: string
  status: string
  createdAt: string
  items: { id: number; qty: number }[]
}

const FILTERS = ["ALL", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]

const statusTone: Record<string, string> = {
  PLACED: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-600",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [filter, setFilter] = useState("ALL")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const qs = filter === "ALL" ? "" : `?status=${filter}`
      setOrders(await api<AdminOrder[]>(`/api/orders${qs}`))
      setError("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Orders</h1>
        <p className="mt-1 text-sm text-forest-900/60">Track and fulfil customer orders.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold transition",
              filter === f ? "bg-forest-900 text-lime-100" : "bg-white text-forest-900 ring-1 ring-forest-900/10 hover:ring-leaf-500"
            )}
          >
            {f === "ALL" ? "All Orders" : f}
          </button>
        ))}
      </div>

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-sm text-forest-900/50">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-forest-900/50">No {filter !== "ALL" ? filter : ""} orders yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest-900/10 text-left text-[11px] uppercase tracking-wide text-forest-900/50">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-forest-900/5 last:border-0 hover:bg-lime-50/50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-bold text-leaf-600 hover:underline">
                      {o.orderNumber}
                    </Link>
                    <div className="text-[11px] text-forest-900/40">
                      {new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-semibold">{o.customerName}</div>
                    <div className="text-[11px] text-forest-900/40">{o.phone}</div>
                  </td>
                  <td className="px-5 py-3 text-xs">{o.items.reduce((a, i) => a + i.qty, 0)}</td>
                  <td className="px-5 py-3 font-bold">{formatINR(o.total)}</td>
                  <td className="px-5 py-3">
                    <Badge tone={o.paymentStatus === "PAID" ? "leaf" : o.paymentStatus === "FAILED" ? "danger" : "amber"}>
                      {o.paymentMethod} · {o.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge ${statusTone[o.status] ?? "bg-forest-900/10"}`}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
