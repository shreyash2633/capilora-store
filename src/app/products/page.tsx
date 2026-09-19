import Link from "next/link"
import { SearchX } from "lucide-react"
import { db } from "@/lib/db"
import { ProductCard } from "@/components/site/product-card"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = { title: "Shop All Products", description: "Shop the full Capilora Professional range — dandruff control, anti-acne care, sunscreen, conditioners and more, with free shipping over ₹499.", alternates: { canonical: "/products" } }

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low → High" },
  { key: "price-desc", label: "Price: High → Low" },
  { key: "newest", label: "Newest" },
] as const

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}) {
  const sp = await searchParams
  const q = (sp.q ?? "").trim()
  const category = sp.category ?? ""
  const sort = sp.sort ?? "featured"

  const categories = await db.category.findMany({ orderBy: { id: "asc" } })
  const activeCategory = categories.find((c) => c.slug === category)

  const where = {
    isActive: true,
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { tagline: { contains: q } },
            { description: { contains: q } },
          ],
        }
      : {}),
    ...(activeCategory ? { categoryId: activeCategory.id } : {}),
  }

  const orderBy =
    sort === "price-asc"
      ? [{ salePrice: "asc" as const }, { mrp: "asc" as const }]
      : sort === "price-desc"
        ? [{ mrp: "desc" as const }]
        : sort === "newest"
          ? [{ createdAt: "desc" as const }]
          : [{ isFeatured: "desc" as const }, { createdAt: "asc" as const }]

  const products = await db.product.findMany({
    where,
    orderBy,
    select: { id: true, slug: true, name: true, tagline: true, size: true, mrp: true, salePrice: true, images: true, badge: true },
  })

  const qs = (over: Record<string, string>) => {
    const params = new URLSearchParams()
    const merged = { q, category, sort, ...over }
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v)
    const s = params.toString()
    return `/products${s ? `?${s}` : ""}`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="eyebrow mb-2">{activeCategory ? activeCategory.name : "Shop All"}</div>
        <h1 className="section-title">
          {q ? `Results for “${q}”` : activeCategory ? activeCategory.name : "The Capilora Range"}
        </h1>
        {activeCategory && <p className="mt-2 max-w-xl text-sm text-forest-900/60">{activeCategory.description}</p>}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Link
          href={qs({ category: "" })}
          className={cn(
            "rounded-full px-4 py-2 text-xs font-bold transition",
            !category ? "bg-forest-900 text-lime-100" : "bg-white text-forest-900 ring-1 ring-forest-900/10 hover:ring-leaf-500"
          )}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={qs({ category: c.slug })}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold transition",
              category === c.slug
                ? "bg-forest-900 text-lime-100"
                : "bg-white text-forest-900 ring-1 ring-forest-900/10 hover:ring-leaf-500"
            )}
          >
            {c.name}
          </Link>
        ))}
        <span className="mx-2 hidden h-5 w-px bg-forest-900/10 sm:block" />
        {SORTS.map((s) => (
          <Link
            key={s.key}
            href={qs({ sort: s.key })}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition",
              sort === s.key ? "bg-lime-100 text-forest-900 ring-1 ring-leaf-500" : "text-forest-900/60 hover:text-forest-950"
            )}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="card mx-auto flex max-w-md flex-col items-center gap-3 p-12 text-center">
          <SearchX className="h-10 w-10 text-leaf-500" />
          <h2 className="font-display text-xl font-semibold">No products found</h2>
          <p className="text-sm text-forest-900/60">Try a different search or browse the full range.</p>
          <Link href="/products" className="btn-primary btn-sm mt-2">View all products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  )
}
