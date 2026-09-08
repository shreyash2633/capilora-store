import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-forest-900 text-lime-100 shadow-sm transition group-hover:bg-leaf-600">
        <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden>
          <path
            d="M42 23c-3.2-2.6-7.6-3.6-11.6-2.2-5.8 2-8.8 8.2-6.6 14.2 2.1 5.8 8.3 8.6 14 6.5 2.4-.9 4.2-2.4 5.4-4.3"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M45 14c2.4 5.4-.2 9.8-5.6 12" stroke="#A6CC75" strokeWidth="5" fill="none" strokeLinecap="round" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-lg font-semibold tracking-[0.08em]",
            dark ? "text-lime-100" : "text-forest-950"
          )}
        >
          CAPILORA
        </span>
        <span
          className={cn(
            "mt-0.5 block text-[9px] font-bold uppercase tracking-[0.42em]",
            dark ? "text-leaf-400" : "text-leaf-600"
          )}
        >
          Professional
        </span>
      </span>
    </Link>
  )
}
