import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { bad, isAdminResponse, ok, requireAdmin } from "@/lib/api"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const { id } = await params
  const body = await req.json().catch(() => null)
  const b = body as { isActive?: boolean; value?: number; minOrder?: number }
  const data: Record<string, unknown> = {}
  if (typeof b.isActive === "boolean") data.isActive = b.isActive
  if (typeof b.value === "number") data.value = b.value
  if (typeof b.minOrder === "number") data.minOrder = b.minOrder
  try {
    const coupon = await db.coupon.update({ where: { id: Number(id) }, data })
    return ok(coupon)
  } catch {
    return bad("Could not update coupon")
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin
  const { id } = await params
  try {
    await db.coupon.delete({ where: { id: Number(id) } })
    return ok({ ok: true })
  } catch {
    return bad("Could not delete coupon")
  }
}
