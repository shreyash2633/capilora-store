import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { formatINR } from "@/lib/utils"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const b = body as { code?: string; subtotal?: number }
  const code = (b?.code ?? "").trim().toUpperCase()
  const subtotal = Number(b?.subtotal) || 0
  if (!code) return Response.json({ ok: false, message: "Enter a coupon code" })

  const coupon = await db.coupon.findUnique({ where: { code } })
  if (!coupon || !coupon.isActive) return Response.json({ ok: false, message: "Invalid coupon code" })
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return Response.json({ ok: false, message: "This coupon has expired" })
  if (subtotal < coupon.minOrder)
    return Response.json({ ok: false, message: `Minimum order ${formatINR(coupon.minOrder)} required for ${code}` })

  const discount = coupon.type === "PERCENT" ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal)
  return Response.json({ ok: true, code: coupon.code, discount })
}
