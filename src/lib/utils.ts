import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 })

export function formatINR(n: number): string {
  return "₹" + inr.format(Math.round(n))
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export function parseJsonArray<T = string>(raw: string | null | undefined): T[] {
  if (!raw) return []
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function genOrderNumber(): string {
  const t = Date.now().toString(36).toUpperCase().slice(-6)
  const r = Math.random().toString(36).toUpperCase().slice(2, 6)
  return `CP-${t}${r}`
}

export function effectivePrice(p: { salePrice: number | null; mrp: number }): number {
  return p.salePrice != null && p.salePrice > 0 && p.salePrice < p.mrp ? p.salePrice : p.mrp
}

export function discountPercent(p: { salePrice: number | null; mrp: number }): number {
  const price = effectivePrice(p)
  if (price >= p.mrp || p.mrp <= 0) return 0
  return Math.round(((p.mrp - price) / p.mrp) * 100)
}
