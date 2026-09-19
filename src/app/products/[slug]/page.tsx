import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CheckCircle2, ChevronRight, Package, ShieldCheck, Truck } from "lucide-react"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Price } from "@/components/site/price"
import { ProductCard } from "@/components/site/product-card"
import { AddToCart } from "./add-to-cart"
import { Gallery } from "./gallery"
import { discountPercent, parseJsonArray } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = await db.product.findUnique({ where: { slug } })
  if (!p) return { title: "Product not found" }
  const images = parseJsonArray<string>(p.images)
  const img = images[0] ? [images[0]] : undefined
  return {
    title: p.name,
    description: p.tagline || p.description.slice(0, 150),
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: `${p.name} · Capilora Professional`,
      description: p.tagline || p.description.slice(0, 150),
      images: img,
      type: "website",
    },
    twitter: { card: "summary_large_image", images: img },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  })
  if (!product || !product.isActive) notFound()

  const images = parseJsonArray<string>(product.images)
  const benefits = parseJsonArray<string>(product.benefits)
  const price = product.salePrice ?? product.mrp
  const off = discountPercent(product)
  const inStock = product.stock > 0

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline || product.description,
    image: images,
    brand: { "@type": "Brand", name: "Capilora Professional" },
    sku: `CAP-${product.id}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  }

  const related = await db.product.findMany({
    where: { isActive: true, categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
    select: { id: true, slug: true, name: true, tagline: true, size: true, mrp: true, salePrice: true, images: true, badge: true },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs font-medium text-forest-900/50">
        <Link href="/" className="hover:text-leaf-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-leaf-600">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-leaf-600">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-forest-950">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <Gallery images={images} alt={product.name} />

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="eyebrow mb-2">{product.category.name}</div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-forest-950">{product.name}</h1>
            {product.tagline && <p className="mt-2 text-base text-forest-900/60">{product.tagline}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Price mrp={product.mrp} salePrice={product.salePrice} large />
            <Badge tone="outline">{product.size}</Badge>
            {off > 0 && <Badge className="bg-forest-900 text-lime-100">{off}% OFF</Badge>}
            {inStock ? (
              <Badge className="bg-lime-100 text-forest-800">In stock</Badge>
            ) : (
              <Badge tone="danger">Out of stock</Badge>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-leaf-600">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 fill-butter-400 text-butter-400" aria-hidden>
                <path d="M9.05 2.9c.3-.9 1.6-.9 1.9 0l1.3 4a1 1 0 0 0 .95.69h4.2c.98 0 1.4 1.26.6 1.84l-3.4 2.47a1 1 0 0 0-.37 1.12l1.3 4c.3.93-.76 1.7-1.55 1.13l-3.4-2.46a1 1 0 0 0-1.17 0l-3.4 2.46c-.78.57-1.84-.2-1.54-1.12l1.3-4a1 1 0 0 0-.37-1.13L2 9.43c-.78-.58-.38-1.84.6-1.84h4.2a1 1 0 0 0 .95-.7l1.3-4Z" />
              </svg>
              4.8 · Professional Grade
            </span>
          </div>

          <p className="leading-relaxed text-forest-900/70">{product.description}</p>

          {benefits.length > 0 && (
            <ul className="space-y-2.5 rounded-3xl bg-lime-50 p-5 ring-1 ring-leaf-200/60">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-forest-900">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          <AddToCart
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price,
              mrp: product.mrp,
              image: images[0] || "",
              size: product.size,
              stock: product.stock,
            }}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, t: "Free shipping", s: "On orders ₹499+" },
              { icon: ShieldCheck, t: "Secure payment", s: "UPI · Cards · COD" },
              { icon: Package, t: "Fresh batches", s: "24-month shelf life" },
            ].map((f) => (
              <div key={f.t} className="card flex items-center gap-2.5 p-3.5">
                <f.icon className="h-4.5 w-4.5 text-leaf-600" />
                <div>
                  <div className="text-xs font-bold">{f.t}</div>
                  <div className="text-[11px] text-forest-900/50">{f.s}</div>
                </div>
              </div>
            ))}
          </div>

          <details className="card group p-5">
            <summary className="cursor-pointer list-none text-sm font-bold text-forest-950 marker:hidden">
              Full ingredient list
              <span className="float-right text-leaf-600 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-forest-900/70">{product.ingredients}</p>
            <p className="mt-2 text-[11px] text-forest-900/45">
              CAUTION: For external use only. Keep away from children. Avoid direct contact with eyes. Store in a cool
              &amp; dry place. Best before 24 months from manufacturing date.
            </p>
          </details>

          <details className="card group p-5">
            <summary className="cursor-pointer list-none text-sm font-bold text-forest-950 marker:hidden">
              Manufacturing &amp; marketing details
              <span className="float-right text-leaf-600 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-forest-900/70">
              Marketed by Capilora Professional. Manufactured at an ISO-certified cosmetic facility.
            </p>
          </details>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title mb-6 !text-2xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
