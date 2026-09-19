import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { CATEGORIES, PRODUCTS, DEFAULT_SETTINGS, COUPONS } from "./products-data"
import { existsSync } from "fs"
import { resolve } from "path"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding Capilora Professional store…")

  // Categories
  const catMap = new Map<string, number>()
  for (const c of CATEGORIES) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: { slug: c.slug, name: c.name, description: c.description },
    })
    catMap.set(c.slug, cat.id)
  }

  // Products
  for (const p of PRODUCTS) {
    const images = [...p.images]
    const stickerPath = `/products/stickers/${encodeURIComponent(p.stickerFile)}`
    const packshot = `/products/${p.slug}.png`
    const absPackshot = resolve(process.cwd(), "public", "products", `${p.slug}.png`)
    if (existsSync(absPackshot)) images.push(packshot)
    images.push(stickerPath)

    const data = {
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      benefits: JSON.stringify(p.benefits),
      ingredients: p.ingredients,
      size: p.size,
      mrp: p.mrp,
      salePrice: p.salePrice,
      stock: p.stock,
      images: JSON.stringify(images),
      badge: p.badge ?? null,
      isActive: true,
      isFeatured: p.isFeatured,
      categoryId: catMap.get(p.category)!,
    }
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    })
    console.log(`  ✓ ${p.name}`)
  }

  // Admin user — credentials come from env; refuse to create a well-known default.
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@capilora.in").toLowerCase().trim()
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD env var is required (min 12 chars) to seed the admin user.")
  }
  const passwordHash = bcrypt.hashSync(adminPassword, 10)
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, name: "Store Admin", passwordHash },
  })
  console.log(`  ✓ Admin: ${adminEmail} (password from ADMIN_PASSWORD env)`)

  // Coupons
  for (const c of COUPONS) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: { type: c.type, value: c.value, minOrder: c.minOrder, isActive: true },
      create: { code: c.code, type: c.type, value: c.value, minOrder: c.minOrder },
    })
  }
  console.log("  ✓ Coupons: WELCOME10, FLAT100, HAIR20")

  // Settings
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
  }
  console.log("  ✓ Settings")
  console.log("Done.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
