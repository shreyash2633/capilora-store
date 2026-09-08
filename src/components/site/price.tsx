import { formatINR } from "@/lib/utils"

export function Price({ mrp, salePrice, large = false }: { mrp: number; salePrice: number | null; large?: boolean }) {
  const price = salePrice != null && salePrice > 0 && salePrice < mrp ? salePrice : mrp
  const hasSale = price < mrp
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={`font-bold text-forest-950 ${large ? "text-3xl" : "text-base"}`}>{formatINR(price)}</span>
      {hasSale && (
        <span className={`text-forest-900/40 line-through ${large ? "text-lg" : "text-xs"}`}>{formatINR(mrp)}</span>
      )}
    </span>
  )
}
