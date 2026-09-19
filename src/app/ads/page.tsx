import { readdir, stat } from "fs/promises"
import path from "path"
import { Download } from "lucide-react"
import { PRODUCTS } from "../../../scripts/products-data"

export const dynamic = "force-dynamic"
export const metadata = { title: "Ad Creatives", description: "Ready-to-post ad creatives for Capilora Professional products — square, story and banner formats.", alternates: { canonical: "/ads" } }

const FORMATS: Record<string, string> = {
  square: "1080×1080 · Instagram / Facebook Post",
  story: "1080×1920 · Story / Reels / Status",
  banner: "1200×628 · Website / Web Banner",
}

export default async function AdsPage() {
  const adsDir = path.join(process.cwd(), "public", "ads")
  let files: string[] = []
  try {
    files = (await readdir(adsDir)).filter((f) => f.endsWith(".png") || f.endsWith(".webp"))
    await Promise.all(files.map(async (f) => stat(path.join(adsDir, f))))
  } catch {
    files = []
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="eyebrow mb-3">Marketing Kit</div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Product Ad Creatives</h1>
        <p className="mt-4 text-sm leading-relaxed text-forest-900/60">
          {files.length > 0
            ? `${files.length} ready-to-post creatives across ${PRODUCTS.length} products — three formats each. Click any image to open it full-size, then save.`
            : "Ad creatives have not been generated yet. Run `npm run ads` to generate them."}
        </p>
      </div>

      {PRODUCTS.map((p) => {
        const set = ["square", "story", "banner"]
          .map((f) => files.find((file) => file === `${p.slug}-${f}.png` || file === `${p.slug}-${f}.webp`))
          .filter((f): f is string => !!f)
          .map((file) => ({ f: file.replace(/^.*?-(square|story|banner)\.(png|webp)$/, "$1"), file }))
        if (set.length === 0) return null
        return (
          <section key={p.slug} className="mt-12">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-2xl font-semibold text-forest-950">{p.name}</h2>
              <span className="text-xs font-semibold text-forest-900/50">{p.size} · {p.tagline}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {set.map(({ f, file }) => (
                <div key={file} className="card group overflow-hidden p-0">
                  <a href={`/ads/${file}`} target="_blank" rel="noreferrer" className="block bg-lime-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/ads/${file}`} alt={`${p.name} ${f} ad`} className="max-h-80 w-full object-contain transition group-hover:scale-[1.02]" />
                  </a>
                  <div className="flex items-center justify-between gap-2 border-t border-forest-900/10 p-3">
                    <div className="text-[11px] font-semibold text-forest-900/60">{FORMATS[f]}</div>
                    <a href={`/ads/${file}`} download className="inline-flex items-center gap-1 text-[11px] font-bold text-leaf-600 hover:underline">
                      <Download className="h-3 w-3" /> PNG
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
