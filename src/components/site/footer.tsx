import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { Logo } from "./logo"
import type { StoreSettings } from "@/lib/settings"

const PAYMENTS = ["COD", "UPI (coming soon)"]

export function Footer({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="mt-24 bg-forest-950 text-lime-100/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="space-y-4">
          <Logo dark />
          <p className="text-sm leading-relaxed">
            Salon-grade hair &amp; skin care powered by proven actives. Sulphate free, paraben free, cruelty free.
          </p>
          <div className="flex gap-2 text-[11px] font-semibold">
            <span className="rounded-full bg-white/10 px-2.5 py-1">Sulphate Free</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1">Paraben Free</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1">Cruelty Free</span>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-leaf-400">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/products" className="transition hover:text-leaf-400">All Products</Link></li>
            <li><Link href="/products?category=hair-care" className="transition hover:text-leaf-400">Hair Care</Link></li>
            <li><Link href="/products?category=skin-care" className="transition hover:text-leaf-400">Skin Care</Link></li>
            <li><Link href="/cart" className="transition hover:text-leaf-400">Cart</Link></li>
            <li><Link href="/track" className="transition hover:text-leaf-400">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-leaf-400">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="transition hover:text-leaf-400">About Capilora</Link></li>
            <li><Link href="/contact" className="transition hover:text-leaf-400">Contact Us</Link></li>
            <li><Link href="/privacy" className="transition hover:text-leaf-400">Privacy Policy</Link></li>
            <li><Link href="/terms" className="transition hover:text-leaf-400">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-leaf-400">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-leaf-400" />
              <a href={`https://wa.me/${settings.contactWhatsApp}`} target="_blank" rel="noreferrer" className="transition hover:text-leaf-400">
                {settings.contactPhone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-leaf-400" />
              <a href={`mailto:${settings.contactEmail}`} className="transition hover:text-leaf-400">
                {settings.contactEmail}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf-400" />
              <span className="leading-relaxed">{settings.contactAddress}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-lime-100/50 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Capilora Professional. All rights reserved.</span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {PAYMENTS.map((p) => (
              <span key={p} className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-bold tracking-wide text-lime-100/80">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
