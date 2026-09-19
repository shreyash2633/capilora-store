import type { MetadataRoute } from "next"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3300"

  let productEntries: MetadataRoute.Sitemap = []
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })
    productEntries = products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  } catch {
    // DB unavailable (e.g. build-time prerender) — static routes still ship
  }

  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/track`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ]

  return [...staticEntries, ...productEntries]
}
