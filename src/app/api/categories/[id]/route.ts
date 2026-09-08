import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { bad, isAdminResponse, ok, requireAdmin } from "@/lib/api"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const { id } = await params
  const body = await req.json().catch(() => null)
  const b = body as { name?: string; description?: string }
  const data: Record<string, unknown> = {}
  if (b?.name?.trim()) {
    data.name = b.name.trim()
    data.slug = b.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  }
  if (typeof b?.description === "string") data.description = b.description
  try {
    const category = await db.category.update({ where: { id: Number(id) }, data })
    return ok(category)
  } catch {
    return bad("Could not update category")
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const { id } = await params
  const count = await db.product.count({ where: { categoryId: Number(id) } })
  if (count > 0) return bad(`Cannot delete — ${count} products use this category`)
  try {
    await db.category.delete({ where: { id: Number(id) } })
    return ok({ ok: true })
  } catch {
    return bad("Could not delete category")
  }
}
