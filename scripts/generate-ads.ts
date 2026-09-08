/**
 * Capilora Professional — Ad Creative Generator
 * Renders one square (1080×1080), one story (1080×1920) and one web banner
 * (1200×628) per product, using the cleaned packshots and the brand palette.
 *
 * Run:  npx tsx scripts/generate-ads.ts
 * Out:  public/ads/{slug}-{square|story|banner}.png
 */
import { chromium } from "playwright"
import { mkdir } from "fs/promises"
import path from "path"
import { PRODUCTS } from "./products-data"

const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, "public", "ads")

const C = {
  deep: "#0C1D07",
  forest: "#142B0B",
  forest700: "#264F18",
  leaf: "#5C9139",
  mid: "#A6CC75",
  pale: "#F1F9D0",
  cream: "#FBFDF5",
  white: "#FFFFFF",
}

const PHONE = "+91 82628 56278"
const WHATSAPP = "918262856278"

function fileUrl(p: string) {
  return "file:///" + p.replace(/\\/g, "/")
}

function packshotUrl(slug: string) {
  return fileUrl(path.join(ROOT, "public", "products", `${slug}.png`))
}

interface AdProduct {
  name: string
  tagline: string
  benefits: string[]
  size: string
  price: number
  mrp: number
}

function brandRow(light = true) {
  const fg = light ? C.pale : C.forest
  const sub = light ? C.mid : C.leaf
  return `
  <div style="display:flex;align-items:center;gap:14px;">
    <div style="width:46px;height:46px;border-radius:12px;background:${light ? "rgba(241,249,208,0.12)" : C.forest};display:flex;align-items:center;justify-content:center;">
      <svg viewBox="0 0 64 64" width="26" height="26"><path d="M42 23c-3.2-2.6-7.6-3.6-11.6-2.2-5.8 2-8.8 8.2-6.6 14.2 2.1 5.8 8.3 8.6 14 6.5 2.4-.9 4.2-2.4 5.4-4.3" stroke="${fg}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M45 14c2.4 5.4-.2 9.8-5.6 12" stroke="${C.mid}" stroke-width="5" fill="none" stroke-linecap="round"/></svg>
    </div>
    <div style="line-height:1;">
      <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:600;letter-spacing:3px;color:${fg};">CAPILORA</div>
      <div style="font-family:'Manrope',sans-serif;font-size:10px;font-weight:800;letter-spacing:6.5px;color:${sub};margin-top:4px;">PROFESSIONAL</div>
    </div>
  </div>`
}

function badgeRow(dark = false) {
  const items = ["Sulphate Free", "Paraben Free", "Cruelty Free"]
  return items
    .map(
      (t) =>
        `<span style="font-family:'Manrope',sans-serif;font-size:15px;font-weight:700;padding:8px 16px;border-radius:999px;border:1.5px solid ${dark ? "rgba(241,249,208,0.35)" : "rgba(20,43,11,0.25)"};color:${dark ? C.pale : C.forest};">${t}</span>`
    )
    .join("")
}

function cta() {
  return `<div style="display:inline-flex;align-items:center;gap:12px;background:${C.leaf};color:#fff;border-radius:999px;padding:14px 30px;font-family:'Manrope',sans-serif;font-size:17px;font-weight:800;letter-spacing:0.4px;box-shadow:0 8px 24px rgba(92,145,57,0.45);">
    Order on WhatsApp&nbsp;·&nbsp;${PHONE}
  </div>`
}

/* ---------------- SQUARE 1080×1080 ---------------- */
function squareHtml(d: AdProduct, img: string) {
  const benefits = d.benefits
    .slice(0, 3)
    .map(
      (b) => `<li style="display:flex;gap:10px;align-items:flex-start;font-family:'Manrope',sans-serif;font-size:17px;font-weight:600;color:rgba(241,249,208,0.9);line-height:1.45;">
        <svg width="18" height="18" viewBox="0 0 20 20" style="flex-shrink:0;margin-top:3px;"><path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm-1.5 14.5L4 10l1.4-1.4 3.1 3.1 6.1-6.1L16 7l-7.5 7.5z" fill="${C.mid}"/></svg>
        <span>${b}</span></li>`
    )
    .join("")

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>*{margin:0;padding:0;box-sizing:border-box;}</style></head>
  <body><div style="width:1080px;height:1080px;position:relative;overflow:hidden;background:linear-gradient(135deg,${C.forest} 0%,${C.deep} 55%,#1A3A0E 100%);">
    <div style="position:absolute;right:-160px;top:-160px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(166,204,117,0.22),transparent 70%);"></div>
    <div style="position:absolute;left:-120px;bottom:-180px;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle,rgba(92,145,57,0.25),transparent 70%);"></div>

    <div style="position:relative;height:100%;display:flex;flex-direction:column;padding:56px 64px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        ${brandRow(true)}
        <div style="font-family:'Manrope',sans-serif;font-size:14px;font-weight:800;letter-spacing:2.5px;color:${C.mid};border:1.5px solid rgba(166,204,117,0.5);border-radius:999px;padding:9px 18px;">PROFESSIONAL CARE</div>
      </div>

      <div style="flex:1;display:flex;gap:44px;align-items:center;margin-top:8px;">
        <div style="flex:1.08;">
          <h1 style="font-family:'Playfair Display',serif;font-size:58px;font-weight:700;line-height:1.08;color:${C.white};letter-spacing:-0.5px;">${d.name}</h1>
          <p style="font-family:'Manrope',sans-serif;font-size:20px;font-weight:600;color:${C.mid};margin-top:14px;line-height:1.5;">${d.tagline}</p>
          <ul style="list-style:none;margin-top:30px;display:flex;flex-direction:column;gap:15px;">${benefits}</ul>
          <div style="margin-top:34px;display:flex;align-items:baseline;gap:16px;">
            <span style="font-family:'Manrope',sans-serif;font-size:46px;font-weight:800;color:${C.white};">₹${d.price}</span>
            ${d.mrp > d.price ? `<span style="font-family:'Manrope',sans-serif;font-size:24px;font-weight:600;color:rgba(241,249,208,0.45);text-decoration:line-through;">₹${d.mrp}</span>` : ""}
            <span style="font-family:'Manrope',sans-serif;font-size:17px;font-weight:700;color:${C.mid};padding:6px 14px;border-radius:8px;background:rgba(166,204,117,0.15);">${d.size}</span>
          </div>
        </div>
        <div style="flex:0.92;height:560px;position:relative;">
          <div style="position:absolute;inset:18px -8px -8px 18px;border-radius:32px;background:${C.leaf};opacity:0.35;filter:blur(2px);"></div>
          <div style="position:relative;width:100%;height:100%;border-radius:32px;overflow:hidden;background:${C.white};box-shadow:0 30px 70px rgba(0,0,0,0.5);transform:rotate(1.5deg);">
            <img src="${img}" style="width:100%;height:100%;object-fit:cover;" />
          </div>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
        <div style="display:flex;gap:10px;">${badgeRow(true)}</div>
        ${cta()}
      </div>
    </div>
  </div></body></html>`
}

/* ---------------- STORY 1080×1920 ---------------- */
function storyHtml(d: AdProduct, img: string) {
  const benefits = d.benefits
    .slice(0, 4)
    .map(
      (b) => `<li style="display:flex;gap:14px;align-items:flex-start;font-family:'Manrope',sans-serif;font-size:24px;font-weight:600;color:rgba(241,249,208,0.92);line-height:1.4;">
        <svg width="26" height="26" viewBox="0 0 20 20" style="flex-shrink:0;margin-top:4px;"><path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm-1.5 14.5L4 10l1.4-1.4 3.1 3.1 6.1-6.1L16 7l-7.5 7.5z" fill="${C.mid}"/></svg>
        <span>${b}</span></li>`
    )
    .join("")

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>*{margin:0;padding:0;box-sizing:border-box;}</style></head>
  <body><div style="width:1080px;height:1920px;position:relative;overflow:hidden;background:linear-gradient(170deg,${C.forest700} 0%,${C.forest} 30%,${C.deep} 100%);">
    <div style="position:absolute;left:-200px;top:-200px;width:640px;height:640px;border-radius:50%;background:radial-gradient(circle,rgba(166,204,117,0.18),transparent 70%);"></div>
    <div style="position:absolute;right:-220px;bottom:280px;width:640px;height:640px;border-radius:50%;background:radial-gradient(circle,rgba(92,145,57,0.22),transparent 70%);"></div>

    <div style="position:relative;height:100%;display:flex;flex-direction:column;align-items:center;padding:80px 72px 70px;">
      ${brandRow(true)}

      <div style="width:100%;height:820px;margin-top:56px;border-radius:44px;overflow:hidden;background:${C.white};box-shadow:0 40px 90px rgba(0,0,0,0.55);border:10px solid rgba(241,249,208,0.12);">
        <img src="${img}" style="width:100%;height:100%;object-fit:cover;" />
      </div>

      <div style="width:100%;margin-top:52px;">
        <div style="text-align:center;">
          <h1 style="font-family:'Playfair Display',serif;font-size:64px;font-weight:700;line-height:1.1;color:${C.white};">${d.name}</h1>
          <p style="font-family:'Manrope',sans-serif;font-size:26px;font-weight:600;color:${C.mid};margin-top:12px;">${d.tagline}</p>
        </div>
        <ul style="list-style:none;margin-top:44px;display:flex;flex-direction:column;gap:20px;padding:0 8px;">${benefits}</ul>
      </div>

      <div style="flex:1;"></div>

      <div style="width:100%;display:flex;align-items:center;justify-content:space-between;background:rgba(241,249,208,0.08);border:1.5px solid rgba(241,249,208,0.15);border-radius:32px;padding:28px 36px;">
        <div style="display:flex;align-items:baseline;gap:14px;">
          <span style="font-family:'Manrope',sans-serif;font-size:52px;font-weight:800;color:${C.white};">₹${d.price}</span>
          ${d.mrp > d.price ? `<span style="font-family:'Manrope',sans-serif;font-size:26px;font-weight:600;color:rgba(241,249,208,0.45);text-decoration:line-through;">₹${d.mrp}</span>` : ""}
        </div>
        ${cta()}
      </div>
      <div style="margin-top:22px;display:flex;gap:12px;">${badgeRow(true)}</div>
    </div>
  </div></body></html>`
}

/* ---------------- BANNER 1200×628 ---------------- */
function bannerHtml(d: AdProduct, img: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>*{margin:0;padding:0;box-sizing:border-box;}</style></head>
  <body><div style="width:1200px;height:628px;position:relative;overflow:hidden;background:${C.cream};display:flex;">
    <div style="flex:1.15;display:flex;flex-direction:column;justify-content:space-between;padding:48px 24px 44px 56px;position:relative;">
      <div style="position:absolute;left:-90px;bottom:-120px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(166,204,117,0.35),transparent 70%);"></div>
      ${brandRow(false)}
      <div style="position:relative;">
        <div style="font-family:'Manrope',sans-serif;font-size:13px;font-weight:800;letter-spacing:3px;color:${C.leaf};margin-bottom:10px;">PROFESSIONAL HAIR &amp; SKIN CARE</div>
        <h1 style="font-family:'Playfair Display',serif;font-size:44px;font-weight:700;line-height:1.08;color:${C.forest};max-width:480px;">${d.name}</h1>
        <p style="font-family:'Manrope',sans-serif;font-size:18px;font-weight:600;color:rgba(20,43,11,0.65);margin-top:10px;max-width:470px;line-height:1.45;">${d.tagline}</p>
        <div style="display:flex;align-items:center;gap:14px;margin-top:18px;">
          <span style="font-family:'Manrope',sans-serif;font-size:34px;font-weight:800;color:${C.forest};">₹${d.price}</span>
          ${d.mrp > d.price ? `<span style="font-family:'Manrope',sans-serif;font-size:19px;font-weight:600;color:rgba(20,43,11,0.4);text-decoration:line-through;">₹${d.mrp}</span>` : ""}
          <span style="font-family:'Manrope',sans-serif;font-size:14px;font-weight:700;color:${C.forest700};padding:5px 12px;border-radius:8px;background:${C.pale};">${d.size}</span>
        </div>
      </div>
      <div style="position:relative;display:flex;align-items:center;gap:14px;">
        <div style="display:inline-flex;align-items:center;gap:10px;background:${C.forest};color:${C.pale};border-radius:999px;padding:12px 26px;font-family:'Manrope',sans-serif;font-size:15px;font-weight:800;">
          Shop Now · WhatsApp ${PHONE}
        </div>
        <div style="display:flex;gap:6px;">${badgeRow(false)}</div>
      </div>
    </div>
    <div style="flex:0.85;position:relative;background:linear-gradient(160deg,${C.pale},${C.mid});">
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
        <div style="width:78%;height:78%;border-radius:36px;overflow:hidden;background:${C.white};box-shadow:0 30px 70px rgba(12,29,7,0.35);transform:rotate(-2deg);">
          <img src="${img}" style="width:100%;height:100%;object-fit:cover;" />
        </div>
      </div>
      <svg width="120" height="120" viewBox="0 0 64 64" style="position:absolute;top:26px;right:26px;opacity:0.25;"><path d="M42 23c-3.2-2.6-7.6-3.6-11.6-2.2-5.8 2-8.8 8.2-6.6 14.2 2.1 5.8 8.3 8.6 14 6.5 2.4-.9 4.2-2.4 5.4-4.3" stroke="${C.forest}" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
    </div>
  </div></body></html>`
}

const FORMATS = [
  { key: "square", width: 1080, height: 1080, make: squareHtml },
  { key: "story", width: 1080, height: 1920, make: storyHtml },
  { key: "banner", width: 1200, height: 628, make: bannerHtml },
] as const

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  let count = 0

  for (const p of PRODUCTS) {
    const price = p.salePrice && p.salePrice < p.mrp ? p.salePrice : p.mrp
    const ad: AdProduct = {
      name: p.name.replace(" — Flake Fighter", ""),
      tagline: p.tagline,
      benefits: p.benefits,
      size: p.size,
      price,
      mrp: p.mrp,
    }
    const img = packshotUrl(p.slug)

    for (const f of FORMATS) {
      const page = await browser.newPage({ viewport: { width: f.width, height: f.height }, deviceScaleFactor: 1 })
      await page.setContent(f.make(ad, img), { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(150)
      const out = path.join(OUT_DIR, `${p.slug}-${f.key}.png`)
      await page.screenshot({ path: out, clip: { x: 0, y: 0, width: f.width, height: f.height } })
      await page.close()
      count++
      console.log(`  ✓ ${p.slug}-${f.key}.png`)
    }
  }

  await browser.close()
  console.log(`Done — ${count} creatives written to public/ads/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
