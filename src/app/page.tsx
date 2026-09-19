import Link from "next/link"
import { ArrowRight, CheckCircle2, FlaskConical, Leaf, Sparkles, Truck } from "lucide-react"
import { db } from "@/lib/db"
import { getSettings } from "@/lib/settings"
import { ProductCard } from "@/components/site/product-card"
import { parseJsonArray } from "@/lib/utils"

export const dynamic = "force-dynamic"

const ACTIVES = [
  { name: "Piroctone Olamine", where: "Dandruff Control Shampoo", what: "Gently eliminates dandruff-causing flakes without drying the scalp." },
  { name: "Niacinamide", where: "AC Serum · Conditioner", what: "Balances oil, refines pores and strengthens the hair & skin barrier." },
  { name: "Hyaluronic Acid", where: "Vitamin C Serum · Face Wash", what: "Multi-level hydration for plump, comfortable skin all day." },
  { name: "Zinc Oxide", where: "Sunscreen SPF 50", what: "Mineral broad-spectrum protection that's kind to sensitive skin." },
  { name: "Salicylic Acid", where: "AC Serum · Face Wash", what: "Keeps pores clear and smooths rough, bumpy texture." },
  { name: "AA2G Vitamin C", where: "Vitamin C Serum · Face Wash", what: "Stabilised Vitamin C for lasting brightness, never unstable." },
]

const REVIEWS = [
  { quote: "The Flake Fighter shampoo cleared my dandruff in two weeks. My scalp has never felt calmer.", name: "Ritika S.", role: "Verified Buyer" },
  { quote: "Vitamin C serum texture is beautiful — no stickiness, and the glow shows in my morning selfies.", name: "Aman K.", role: "Verified Buyer" },
  { quote: "I stock Capilora at my salon. Clients ask for the conditioner by name now.", name: "Priya M.", role: "Salon Owner" },
  { quote: "Finally a sunscreen that doesn't feel like a mask. SPF 50 and my skin can still breathe.", name: "Neha D.", role: "Verified Buyer" },
  { quote: "The AC serum calmed my breakouts in ten days. The ingredient list actually matches the results.", name: "Sanya R.", role: "Verified Buyer" },
  { quote: "Deep Repair Mask brought my chemically-treated hair back from the edge. Salon-finish at home.", name: "Kavya T.", role: "Verified Buyer" },
]

const STATS = [
  { value: "8", label: "Specialist formulas" },
  { value: "12+", label: "Proven actives" },
  { value: "100%", label: "Vegan & cruelty-free" },
  { value: "4.8★", label: "Average rating" },
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
      {/* ————— HERO ————— */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-50 via-lime-100 to-leaf-200" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-leaf-300/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-apricot-100/70 blur-3xl" />
        <Sparkles className="pointer-events-none absolute right-[8%] top-16 hidden h-8 w-8 animate-wiggle text-berry-400/70 lg:block" />
        <Leaf className="pointer-events-none absolute left-[4%] bottom-24 hidden h-10 w-10 animate-float text-leaf-400/60 lg:block" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-2 lg:pb-32 lg:pt-16">
          <div className="relative space-y-7">
            <span className="badge animate-fade-up gap-1.5 bg-white/80 px-3 py-1.5 text-[11px] text-berry-600 shadow-sm ring-1 ring-berry-400/30">
              <Sparkles className="h-3 w-3" /> Professional Hair &amp; Skin Care
            </span>
            <h1 className="animate-fade-up anim-d1 font-display text-5xl font-semibold leading-[1.06] tracking-tight text-forest-950 sm:text-6xl">
              Salon-grade care.
              <br />
              <span className="text-marker">Proven actives.</span>
              <br />
              <span className="text-leaf-600">Real results.</span>
            </h1>
            <p className="animate-fade-up anim-d2 max-w-md text-base leading-relaxed text-forest-900/70">
              Capilora Professional brings dermatologist-trusted ingredients — Piroctone Olamine, Niacinamide, Hyaluronic
              Acid — into a clean, conscious range made for visible change.
            </p>
            <div className="animate-fade-up anim-d3 flex flex-wrap items-center gap-3">
              <Link href="/products" className="btn-apricot">
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

          {/* Floating collage */}
          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4 pb-6">
            {heroShots[0] && (
              <Link
                href={`/products/${heroShots[0].slug}`}
                className="card animate-fade-up col-span-2 row-span-2 overflow-hidden p-0 shadow-soft transition hover:shadow-pop"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroShots[0].src} alt={heroShots[0].name} className="h-72 w-full object-cover sm:h-80" />
              </Link>
            )}
            {heroShots.slice(1).map(
              (s, i) =>
                s.src && (
                  <Link
                    key={s.slug}
                    href={`/products/${s.slug}`}
                    className={`card animate-fade-up overflow-hidden p-0 shadow-soft transition hover:shadow-pop ${i === 1 ? "animate-wiggle rotate-2 anim-d3" : "animate-float -rotate-2 anim-d2"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt={s.name} className="h-36 w-full object-cover" />
                  </Link>
                )
            )}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-forest-950 px-5 py-2.5 text-xs font-bold tracking-wide text-lime-100 shadow-soft">
              ✦ Trusted by salons across India
            </div>
          </div>
        </div>
      </section>

      {/* ————— STATS BAND (floating card straddling hero edge) ————— */}
      <section className="relative z-10 mx-auto -mt-10 max-w-5xl px-4 sm:px-6">
        <div className="card animate-fade-up grid grid-cols-2 divide-forest-900/5 rounded-3xl p-6 shadow-soft sm:grid-cols-4 sm:divide-x sm:p-7">
          {STATS.map((s) => (
            <div key={s.label} className="px-3 py-2 text-center">
              <div className="font-display text-3xl font-semibold text-leaf-600">{s.value}</div>
              <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-forest-900/55">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ————— FEATURED ————— */}
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

      {/* ————— CATEGORIES (bento) ————— */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-5">
          {categories.map((c, idx) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className={`group relative overflow-hidden rounded-[2rem] bg-forest-900 p-8 text-lime-100 transition hover:bg-forest-800 ${idx === 0 ? "md:col-span-3" : "md:col-span-2"} ${idx === 1 ? "md:order-2" : ""}`}
            >
              <Leaf className="absolute -right-8 -top-8 h-44 w-44 text-leaf-500/15 transition duration-500 group-hover:rotate-12 group-hover:scale-110" />
              <span className="badge bg-leaf-500/20 px-2.5 py-1 text-[11px] text-leaf-400">
                {c._count.products} products
              </span>
              <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{c.name}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-lime-100/70">{c.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-leaf-400">
                Explore {c.name}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ————— ACTIVES ————— */}
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
              <div
                key={a.name}
                className={`card animate-fade-up p-5 transition duration-300 hover:-translate-y-1 hover:bg-butter-100 hover:shadow-soft anim-d${(i % 6) + 1}`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-apricot-600" />
                  <div className="font-bold text-forest-950">{a.name}</div>
                </div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-berry-600">{a.where}</div>
                <p className="mt-2 text-sm leading-relaxed text-forest-900/60">{a.what}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— REVIEW MARQUEE ————— */}
      <section className="overflow-hidden py-16">
        <div className="mx-auto mb-8 max-w-7xl px-4 text-center sm:px-6">
          <div className="eyebrow mb-2">Loved by customers &amp; salons</div>
          <h2 className="section-title">Real results, real reviews</h2>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent" />
          <div className="flex w-max gap-5 review-track px-4">
            {[...REVIEWS, ...REVIEWS].map((t, i) => (
              <figure key={i} className="card flex w-80 shrink-0 flex-col p-5">
                <div className="mb-2.5 flex gap-0.5 text-berry-500">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="flex-1 text-sm leading-relaxed text-forest-900/80">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-bold text-forest-950">{t.name}</span>
                  <span className="ml-2 text-xs font-semibold text-berry-600">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ————— CTA ————— */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-forest-900 via-forest-800 to-leaf-600 px-8 py-14 text-center sm:px-16">
          <Sparkles className="absolute left-8 top-8 h-20 w-20 text-lime-100/10" />
          <Leaf className="absolute -right-6 -bottom-6 h-40 w-40 text-lime-100/10" />
          <h2 className="font-display text-3xl font-semibold text-lime-50 sm:text-4xl">
            Ready for your professional glow-up?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-lime-100/80">
            Free shipping over ₹{settings.freeShipThreshold}. Cash on Delivery available. Easy WhatsApp support at{" "}
            {settings.contactPhone}.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn-apricot">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${settings.contactWhatsApp}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline !border-lime-100/40 !bg-transparent !text-lime-100 hover:!text-white"
            >
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
