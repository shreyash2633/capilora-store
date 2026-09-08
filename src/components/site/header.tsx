"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, Phone, Search, ShoppingBag, X } from "lucide-react"
import { Logo } from "./logo"
import { useCart } from "@/components/providers/cart-provider"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/products", label: "Shop All" },
  { href: "/products?category=hair-care", label: "Hair Care" },
  { href: "/products?category=skin-care", label: "Skin Care" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Header({
  announcement,
  phone,
  whatsapp,
  email,
}: {
  announcement: string
  phone: string
  whatsapp: string
  email: string
}) {
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const cat = searchParams.get("category")

  useEffect(() => setMounted(true), [])

  if (pathname?.startsWith("/admin")) return null

  return (
    <header className="sticky top-0 z-50">
      {announcement ? (
        <div className="overflow-hidden bg-forest-950 py-2 text-lime-100">
          <div className="flex w-max marquee-track">
            {[0, 1].map((k) => (
              <span
                key={k}
                className="whitespace-nowrap px-6 text-[12px] font-medium tracking-wide"
              >
                {`${announcement}   •   ${announcement}   •   ${announcement}   •   ${announcement}`}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div className="glass-header border-b border-forest-900/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => {
              const active =
                n.href === "/products"
                  ? pathname === "/products" && !cat
                  : n.href === "/about"
                    ? pathname === "/about"
                    : n.href === "/contact"
                      ? pathname === "/contact"
                      : pathname === "/products" && cat === n.href.split("=")[1]
              return (
                <Link
                  key={n.label}
                  href={n.href}
                  className={cn(
                    "relative text-sm font-semibold transition after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-leaf-500 after:transition-all hover:text-leaf-600 hover:after:w-full",
                    active ? "text-leaf-600 after:w-full" : "text-forest-900/80"
                  )}
                >
                  {n.label}
                </Link>
              )
            })}
          </nav>

          <form action="/products" className="ml-auto hidden w-56 items-center md:flex">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/40" />
              <input
                name="q"
                placeholder="Search products…"
                className="input !rounded-full !py-2 pl-9 text-xs"
                aria-label="Search products"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 md:ml-3">
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-forest-900/15 px-3.5 py-2 text-xs font-semibold text-forest-900 transition hover:border-leaf-500 hover:text-leaf-600 sm:inline-flex"
              title={email}
            >
              <Phone className="h-3.5 w-3.5" /> {phone}
            </a>
            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-forest-900/10 transition hover:ring-leaf-500"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5 text-forest-900" />
              {mounted && count > 0 && (
                <span className="animate-pop absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-leaf-500 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-forest-900/10 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "overflow-hidden border-t border-forest-900/10 bg-cream transition-all duration-300 lg:hidden",
            open ? "max-h-[420px]" : "max-h-0 border-t-0"
          )}
        >
          <div className="px-4 py-3">
            <form action="/products" className="mb-3 md:hidden">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/40" />
                <input name="q" placeholder="Search products…" className="input !rounded-full pl-9" />
              </div>
            </form>
            <nav className="grid gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-forest-900 transition hover:bg-lime-100"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
