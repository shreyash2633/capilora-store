import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { getSettings } from "@/lib/settings"

export const dynamic = "force-dynamic"
export const metadata = { title: "Contact Us" }

export default async function ContactPage() {
  const s = await getSettings()
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="eyebrow mb-3">We&apos;re here to help</div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Contact Capilora</h1>
        <p className="mt-4 text-sm leading-relaxed text-forest-900/60">
          Questions about an order, product advice, or salon/bulk partnerships — our team replies fastest on WhatsApp.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <a
          href={`https://wa.me/${s.contactWhatsApp}?text=${encodeURIComponent("Hi Capilora! I have a question.")}`}
          target="_blank"
          rel="noreferrer"
          className="card group p-6 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 text-leaf-600">
            <MessageCircle className="h-5 w-5" />
          </span>
          <h3 className="font-bold">WhatsApp (fastest)</h3>
          <p className="mt-1 text-sm text-forest-900/60">{s.contactPhone}</p>
          <span className="mt-3 inline-block text-xs font-bold text-leaf-600 group-hover:underline">Chat now →</span>
        </a>

        <a href={`mailto:${s.contactEmail}`} className="card group p-6 transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 text-leaf-600">
            <Mail className="h-5 w-5" />
          </span>
          <h3 className="font-bold">Email</h3>
          <p className="mt-1 text-sm text-forest-900/60">{s.contactEmail}</p>
          <span className="mt-3 inline-block text-xs font-bold text-leaf-600 group-hover:underline">Write to us →</span>
        </a>

        <div className="card p-6">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 text-leaf-600">
            <MapPin className="h-5 w-5" />
          </span>
          <h3 className="font-bold">Registered Office</h3>
          <p className="mt-1 text-sm leading-relaxed text-forest-900/60">
            Marketed by Capilora Professional
          </p>
        </div>

        <div className="card p-6">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 text-leaf-600">
            <Clock className="h-5 w-5" />
          </span>
          <h3 className="font-bold">Support Hours</h3>
          <p className="mt-1 text-sm leading-relaxed text-forest-900/60">
            Monday – Saturday
            <br />
            10:00 AM – 7:00 PM IST
          </p>
        </div>
      </div>
    </div>
  )
}
