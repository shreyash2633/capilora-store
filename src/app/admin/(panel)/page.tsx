import Link from "next/link"
import { ArrowRight, IndianRupee, Package, ShoppingBag, TriangleAlert } from "lucide-react"
import { db } from "@/lib/db"
import { formatINR } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const [paidOrders, allOrders, productCount, lowStock, recent] = await Promise.all([
    db.order.findMany({ where: { paymentStatus: "PAID", status: { not: "CANCELLED" } }, select: { total: true } }),
    db.order.count(),
    db.product.count(),
    db.product.findMany({ where: { stock: { lte: 5 } }, select: { id: true, name: true, stock: true } }),
    db.order.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { items: true } }),
  ])

  const revenue = paidOrders.reduce((a, o) => a + o.total, 0)

  const stats = [
    { label: "Total Revenue (paid)", value: formatINR(revenue), icon: IndianRupee, tone: "bg-lime-100 text-forest-800" },
    { label: "Orders", value: String(allOrders), icon: ShoppingBag, tone: "bg-lime-100 text-forest-800" },
    { label: "Products", value: String(productCount), icon: Package, tone: "bg-lime-100 text-forest-800" },
    { label: "Low Stock (≤5)", value: String(lowStock.length), icon: TriangleAlert, tone: "bg-amber-100 text-amber-700" },
  ]

  const statusTone: Record<string, string> = {
    PLACED: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-red-100 text-red-600",
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-forest-900/60">Store health at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-bold text-forest-950">{s.value}</div>
              <div className="text-xs font-medium text-forest-900/50">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div className="card border-amber-300 bg-amber-50 p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-800">
            <TriangleAlert className="h-4 w-4" /> Low stock alert
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p) => (
              <Link key={p.id} href={`/admin/products/${p.id}/edit`} className="badge bg-white text-amber-800 ring-1 ring-amber-300 hover:ring-amber-500">
                {p.name} · {p.stock} left
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-forest-900/10 p-5">
          <h2 className="font-bold text-forest-950">Recent Orders</h2>
          <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs font-bold text-leaf-600 hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-8 text-center text-sm text-forest-900/50">No orders yet — they&apos;ll appear here as soon as customers start buying.</div>
        ) : (
          <div className="overflow-x-auto">
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
                {recent.map((o) => (
                  <tr key={o.id} className="border-b border-forest-900/5 last:border-0 hover:bg-lime-50/50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-bold text-leaf-600 hover:underline">
                        {o.orderNumber}
                      </Link>
                      <div className="text-[11px] text-forest-900/40">{new Date(o.createdAt).toLocaleDateString("en-IN")}</div>
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
          </div>
        )}
      </div>
    </div>
  )
}
