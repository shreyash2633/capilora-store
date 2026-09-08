"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, LogOut, Package, Settings, ShoppingBag, Tag, TicketPercent, Wrench } from "lucide-react"
import { Logo } from "@/components/site/logo"
import { cn } from "@/lib/utils"
import { api } from "@/lib/client"

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await api("/api/auth/logout", { method: "POST" }).catch(() => {})
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-forest-900/10 bg-forest-950 text-lime-100 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="p-5">
        <Logo dark />
      </div>
      <nav className="flex flex-row gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3">
        {LINKS.map((l) => {
          const active = l.exact ? pathname === l.href : pathname?.startsWith(l.href)
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                active ? "bg-leaf-500 text-white" : "text-lime-100/70 hover:bg-white/10 hover:text-lime-100"
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          )
        })}
        <a
          href="/"
          target="_blank"
          className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-lime-100/70 transition hover:bg-white/10 hover:text-lime-100"
        >
          <Wrench className="h-4 w-4" /> View Store ↗
        </a>
      </nav>
      <div className="hidden border-t border-white/10 p-4 lg:block">
        <div className="mb-3 text-xs text-lime-100/50">
          Signed in as <span className="font-bold text-lime-100">{adminName}</span>
        </div>
        <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-lime-100/70 transition hover:bg-white/10 hover:text-white">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
      <button onClick={logout} className="m-3 flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold lg:hidden">
        <LogOut className="h-3.5 w-3.5" /> Sign out
      </button>
    </aside>
  )
}
