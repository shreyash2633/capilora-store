import { NextRequest } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { bad, isAdminResponse, ok, requireAdmin } from "@/lib/api"

export async function GET() {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin
  const coupons = await db.coupon.findMany({ orderBy: { id: "desc" } })
  return ok(coupons)
}

const schema = z.object({
  code: z.string().min(2),
  type: z.enum(["PERCENT", "FLAT"]),
  value: z.number().positive(),
  minOrder: z.number().nonnegative().default(0),
})

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return bad("Invalid coupon data")
  const d = parsed.data
  try {
    const coupon = await db.coupon.create({
      data: { code: d.code.toUpperCase().trim(), type: d.type, value: d.value, minOrder: d.minOrder },
    })
    return ok(coupon, 201)
  } catch {
    return bad("A coupon with this code already exists")
  }
}
