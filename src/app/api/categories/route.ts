import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { bad, isAdminResponse, ok, requireAdmin } from "@/lib/api"

export async function GET() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { id: "asc" },
  })
  return ok(categories)
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const body = await req.json().catch(() => null)
  const b = body as { name?: string; description?: string }
  if (!b?.name?.trim()) return bad("Category name is required")
  const slug = b.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  try {
    const category = await db.category.create({
      data: { name: b.name.trim(), slug, description: b.description ?? "" },
    })
    return ok(category, 201)
  } catch {
    return bad("Category already exists")
  }
}
