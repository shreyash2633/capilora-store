import { NextRequest } from "next/server"
import { z } from "zod"
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
  createdAt: true,
} as const

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const adminView = sp.get("admin") === "1" && isAdminResponse(await requireAdmin().catch(() => null))
  const where = adminView ? {} : { isActive: true }
  const products = await db.product.findMany({
    where,
    select: productSelect,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  })
  return ok(products)
}

const upsertSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  tagline: z.string().default(""),
  description: z.string().default(""),
  benefits: z.array(z.string()).default([]),
  ingredients: z.string().default(""),
  size: z.string().default(""),
  mrp: z.number().nonnegative(),
  salePrice: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().default(0),
  images: z.array(z.string()).default([]),
  badge: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  categoryId: z.number().int(),
})

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const body = await req.json().catch(() => null)
  const parsed = upsertSchema.safeParse(body)
  if (!parsed.success) return bad("Invalid product data: " + parsed.error.issues[0]?.message)

  const d = parsed.data
  try {
    const product = await db.product.create({
      data: {
        name: d.name,
        slug: d.slug && d.slug.trim() ? d.slug.trim() : d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80),
        tagline: d.tagline,
        description: d.description,
        benefits: JSON.stringify(d.benefits),
        ingredients: d.ingredients,
        size: d.size,
        mrp: d.mrp,
        salePrice: d.salePrice ?? null,
        stock: d.stock,
        images: JSON.stringify(d.images),
        badge: d.badge || null,
        isActive: d.isActive,
        isFeatured: d.isFeatured,
        categoryId: d.categoryId,
      },
    })
    return ok(product, 201)
  } catch (e: unknown) {
    const msg = e instanceof Error && e.message.includes("Unique") ? "A product with this slug already exists" : "Could not create product"
    return bad(msg)
  }
}
