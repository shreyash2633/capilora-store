import { cn } from "@/lib/utils"

export function Badge({
  children,
  className,
  tone = "leaf",
}: {
  children: React.ReactNode
  className?: string
  tone?: "leaf" | "forest" | "outline" | "danger" | "amber"
}) {
  const tones: Record<string, string> = {
    leaf: "bg-lime-100 text-forest-800",
    forest: "bg-forest-900 text-lime-100",
    outline: "border border-forest-900/15 text-forest-900/70",
    danger: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-800",
  }
  return <span className={cn("badge", tones[tone], className)}>{children}</span>
}
