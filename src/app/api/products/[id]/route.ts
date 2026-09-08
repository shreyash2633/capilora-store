import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { bad, isAdminResponse, ok, requireAdmin } from "@/lib/api"

const productSelect = {
  id: true,
  slug: true,
  name: true,
  tagline: true,
  description: true,
  benefits: true,
  ingredients: true,
  size: true,
  mrp: true,
  salePrice: true,
  stock: true,
  images: true,
  badge: true,
  isActive: true,
  isFeatured: true,
  categoryId: true,
  category: { select: { id: true, name: true, slug: true } },
} as const

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({ where: { id: Number(id) }, select: productSelect })
  if (!product) return bad("Product not found", 404)
  return ok(product)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") return bad("Invalid data")

  const b = body as Record<string, unknown>
  const data: Record<string, unknown> = {}
  const strFields = ["name", "slug", "tagline", "description", "ingredients", "size"]
  for (const f of strFields) if (typeof b[f] === "string") data[f] = b[f]
  if (Array.isArray(b.benefits)) data.benefits = JSON.stringify(b.benefits)
  if (Array.isArray(b.images)) data.images = JSON.stringify(b.images)
  if (typeof b.mrp === "number") data.mrp = b.mrp
  if (b.salePrice === null || typeof b.salePrice === "number") data.salePrice = b.salePrice
  if (typeof b.stock === "number") data.stock = Math.trunc(b.stock)
  if (typeof b.isActive === "boolean") data.isActive = b.isActive
  if (typeof b.isFeatured === "boolean") data.isFeatured = b.isFeatured
  if (typeof b.categoryId === "number") data.categoryId = b.categoryId
  if (b.badge === null || typeof b.badge === "string") data.badge = b.badge || null

  try {
    const product = await db.product.update({ where: { id: Number(id) }, data, select: productSelect })
    return ok(product)
  } catch {
    return bad("Could not update product (duplicate slug?)")
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const { id } = await params
  try {
    await db.product.delete({ where: { id: Number(id) } })
    return ok({ ok: true })
  } catch {
    return bad("Could not delete product (it may be referenced by orders)")
  }
}
