import Link from "next/link"
import { CheckCircle2, FlaskConical, Leaf, ShieldCheck } from "lucide-react"

export const metadata = { title: "About Us" }

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <div className="eyebrow mb-3">Our Story</div>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Professional care, <span className="text-leaf-600">honestly formulated</span>
        </h1>
        <p className="mt-5 leading-relaxed text-forest-900/70">
          Capilora Professional was born from a simple belief: salon-grade results shouldn&apos;t come wrapped in
          mystery. Every formula in our range is built on actives with real clinical credentials — Piroctone Olamine,
          Niacinamide, Hyaluronic Acid, stabilised Vitamin C — and every ingredient is listed in full, right on the pack.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {[
          {
            icon: Leaf,
            title: "Clean by default",
            text: "Sulphate free, paraben free and cruelty free across the entire range. No compromises, no exceptions.",
          },
          {
            icon: FlaskConical,
            title: "Science-first",
            text: "Developed with Purete Laboratoire, an ISO-certified cosmetic manufacturing facility in Surat, Gujarat.",
          },
          {
            icon: ShieldCheck,
            title: "Made for pros",
            text: "Trusted by salons and stylists who need repeatable results on every client, every day.",
          },
        ].map((v) => (
          <div key={v.title} className="card p-6">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 text-leaf-600">
              <v.icon className="h-5 w-5" />
            </span>
            <h3 className="font-bold text-forest-950">{v.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-forest-900/60">{v.text}</p>
          </div>
        ))}
      </div>

      <div className="card mt-10 overflow-hidden">
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="bg-forest-950 p-8 text-lime-100 sm:p-10">
            <h2 className="font-display text-2xl font-semibold">Manufacturing excellence</h2>
            <p className="mt-3 text-sm leading-relaxed text-lime-100/70">
              All Capilora Professional products are manufactured by Purete Laboratoire, Surat - 395009, Gujarat, India —
              an ISO-certified cosmetic facility operating under Drug &amp; Cosmetic Act licence GC-1473. Every batch is
              quality-checked and carries a 24-month best-before window.
            </p>
          </div>
          <div className="p-8 sm:p-10">
            <ul className="space-y-3 text-sm">
              {[
                "ISO-certified manufacturing facility",
                "Mfg. Licence No: GC-1473",
                "Batch-tested with 24-month shelf life",
                "Full INCI disclosure on every pack",
                "Dermat-friendly, cruelty-free formulations",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 font-medium text-forest-900">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" /> {t}
                </li>
              ))}
            </ul>
            <Link href="/products" className="btn-primary mt-7">Explore the Range</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
