import Link from "next/link"
import { ArrowRight, CheckCircle2, FlaskConical, Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react"
import { db } from "@/lib/db"
import { getSettings } from "@/lib/settings"
import { ProductCard } from "@/components/site/product-card"
import { Badge } from "@/components/ui/badge"
import { parseJsonArray } from "@/lib/utils"

export const dynamic = "force-dynamic"

const TRUST = [
  { icon: Leaf, title: "Sulphate & Paraben Free", sub: "Gentle, clean formulations" },
  { icon: ShieldCheck, title: "Dermat-Friendly Actives", sub: "Piroctone Olamine, Niacinamide, AA2G" },
  { icon: FlaskConical, title: "ISO-Certified Manufacturing", sub: "Purete Laboratoire, Surat" },
  { icon: Truck, title: "Free Shipping ₹499+", sub: "Cash on Delivery available" },
]

const ACTIVES = [
  { name: "Piroctone Olamine", where: "Dandruff Control Shampoo", what: "Gently eliminates dandruff-causing flakes without drying the scalp." },
  { name: "Niacinamide", where: "AC Serum · Conditioner", what: "Balances oil, refines pores and strengthens the hair & skin barrier." },
  { name: "Hyaluronic Acid", where: "Vitamin C Serum · Face Wash", what: "Multi-level hydration for plump, comfortable skin all day." },
  { name: "Zinc Oxide", where: "Sunscreen SPF 50", what: "Mineral broad-spectrum protection that's kind to sensitive skin." },
  { name: "Salicylic Acid", where: "AC Serum · Face Wash", what: "Keeps pores clear and smooths rough, bumpy texture." },
  { name: "AA2G Vitamin C", where: "Vitamin C Serum · Face Wash", what: "Stabilised Vitamin C for lasting brightness, never unstable." },
]

const TESTIMONIALS = [
  {
    quote: "The Flake Fighter shampoo cleared my dandruff in two weeks and my scalp has never felt calmer. Finally a professional brand that delivers.",
    name: "Ritika S.", role: "Verified Buyer",
  },
  {
    quote: "Vitamin C serum texture is beautiful — no stickiness, and the glow is visible in my morning selfies. Repurchasing for sure.",
    name: "Aman K.", role: "Verified Buyer",
  },
  {
    quote: "I stock Capilora at my salon. Clients ask for the Hair Fall Control conditioner by name now — repeat sales tell the story.",
    name: "Priya M.", role: "Salon Owner",
  },
]

export default async function HomePage() {
  const settings = await getSettings()
  const [featured, categories] = await Promise.all([
    db.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      orderBy: { createdAt: "asc" },
      select: { id: true, slug: true, name: true, tagline: true, size: true, mrp: true, salePrice: true, images: true, badge: true },
    }),
    db.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { id: "asc" } }),
  ])

  const heroShots = featured.slice(0, 3).map((p) => ({
    src: parseJsonArray<string>(p.images)[0] ?? "",
    name: p.name,
    slug: p.slug,
  }))

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-lime-50 via-lime-100 to-leaf-200">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-leaf-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/50 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="relative space-y-7">
            <Badge tone="forest" className="animate-fade-up px-3 py-1">Professional Hair &amp; Skin Care</Badge>
            <h1 className="animate-fade-up anim-d1 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-forest-950 sm:text-6xl">
              Salon-grade care.
              <br />
              <span className="text-leaf-600">Proven actives.</span>
            </h1>
            <p className="animate-fade-up anim-d2 max-w-md text-base leading-relaxed text-forest-900/70">
              Capilora Professional brings dermatologist-trusted ingredients — Piroctone Olamine, Niacinamide, Hyaluronic
              Acid — into a clean, conscious range made for real results.
            </p>
            <div className="animate-fade-up anim-d3 flex flex-wrap items-center gap-3">
              <Link href="/products" className="btn-primary">
                Shop the Range <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className="btn-outline">
                Our Story
              </Link>
            </div>
            <div className="animate-fade-up anim-d4 flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs font-semibold text-forest-900/70">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-leaf-600" /> Sulphate Free</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-leaf-600" /> Paraben Free</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-leaf-600" /> Cruelty Free</span>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4">
            {heroShots[0] && (
              <Link href={`/products/${heroShots[0].slug}`} className="card animate-fade-up col-span-2 row-span-2 overflow-hidden p-0 transition hover:shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroShots[0].src} alt={heroShots[0].name} className="h-72 w-full object-cover sm:h-80" />
              </Link>
            )}
            {heroShots.slice(1).map(
              (s, i) =>
                s.src && (
                  <Link key={s.slug} href={`/products/${s.slug}`} className={`card animate-fade-up overflow-hidden p-0 transition hover:shadow-xl ${i === 1 ? "rotate-1 anim-d3" : "-rotate-1 anim-d2"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt={s.name} className="h-36 w-full object-cover" />
                  </Link>
                )
            )}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-forest-950 px-5 py-2.5 text-xs font-bold tracking-wide text-lime-100 shadow-lg">
              ✦ Trusted by salons across India
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-forest-900/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
          {TRUST.map((t, i) => (
            <div key={t.title} className={`animate-fade-up flex items-start gap-3 anim-d${i + 1}`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-leaf-600">
                <t.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-forest-950">{t.title}</div>
                <div className="text-xs text-forest-900/60">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow mb-2">Bestsellers &amp; New Launches</div>
            <h2 className="section-title">The Professional Range</h2>
          </div>
          <Link href="/products" className="btn-outline btn-sm">
            View all products <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="group relative overflow-hidden rounded-3xl bg-forest-900 p-8 text-lime-100 transition hover:bg-forest-800 sm:p-10"
            >
              <Leaf className="absolute -right-8 -top-8 h-40 w-40 text-leaf-500/20 transition group-hover:scale-110" />
              <div className="eyebrow !text-leaf-400">{c._count.products} products</div>
              <h3 className="mt-2 font-display text-3xl font-semibold">{c.name}</h3>
              <p className="mt-2 max-w-sm text-sm text-lime-100/70">{c.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-leaf-400">
                Explore {c.name} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ACTIVES */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <div className="eyebrow mb-2">What&apos;s inside matters</div>
            <h2 className="section-title">Powered by proven actives</h2>
            <p className="mt-3 text-sm leading-relaxed text-forest-900/60">
              Every Capilora formula is built around ingredients with real clinical credentials — listed in full on every
              pack and every product page.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVES.map((a, i) => (
              <div key={a.name} className={`card animate-fade-up p-5 transition hover:-translate-y-0.5 hover:shadow-md anim-d${(i % 6) + 1}`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-leaf-600" />
                  <div className="font-bold text-forest-950">{a.name}</div>
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-leaf-600">{a.where}</div>
                <p className="mt-2 text-sm leading-relaxed text-forest-900/60">{a.what}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <div className="eyebrow mb-2">Loved by customers &amp; salons</div>
          <h2 className="section-title">Real results, real reviews</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <figure key={t.name} className={`card animate-fade-up flex h-full flex-col p-6 anim-d${i + 1}`}>
              <div className="mb-3 flex gap-0.5 text-leaf-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-forest-900/80">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-bold text-forest-950">{t.name}</span>
                <span className="ml-2 text-xs text-forest-900/50">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest-900 to-leaf-600 px-8 py-14 text-center sm:px-16">
          <Sparkles className="absolute left-8 top-8 h-20 w-20 text-lime-100/10" />
          <h2 className="font-display text-3xl font-semibold text-lime-50 sm:text-4xl">
            Ready for your professional glow-up?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-lime-100/80">
            Free shipping over ₹{settings.freeShipThreshold}. Cash on Delivery available. Easy WhatsApp support at{" "}
            {settings.contactPhone}.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn-primary !bg-lime-100 !text-forest-950 hover:!bg-white">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={`https://wa.me/${settings.contactWhatsApp}`} target="_blank" rel="noreferrer" className="btn-outline !border-lime-100/40 !bg-transparent !text-lime-100 hover:!text-white">
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path d="M9.05 2.9c.3-.9 1.6-.9 1.9 0l1.3 4a1 1 0 0 0 .95.69h4.2c.98 0 1.4 1.26.6 1.84l-3.4 2.47a1 1 0 0 0-.37 1.12l1.3 4c.3.93-.76 1.7-1.55 1.13l-3.4-2.46a1 1 0 0 0-1.17 0l-3.4 2.46c-.78.57-1.84-.2-1.54-1.12l1.3-4a1 1 0 0 0-.37-1.13L2 9.43c-.78-.58-.38-1.84.6-1.84h4.2a1 1 0 0 0 .95-.7l1.3-4Z" />
    </svg>
  )
}
