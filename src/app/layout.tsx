import type { Metadata } from "next"
import { Manrope, Playfair_Display } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/providers/cart-provider"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { getSettings } from "@/lib/settings"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: {
    default: "Capilora Professional — Salon-Grade Hair & Skin Care",
    template: "%s · Capilora Professional",
  },
  description:
    "Capilora Professional — dermat-friendly, salon-grade hair and skin care. Sulphate free, paraben free, cruelty free. Powered by proven actives.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <CartProvider>
          <Header
            announcement={settings.announcement}
            phone={settings.contactPhone}
            whatsapp={settings.contactWhatsApp}
            email={settings.contactEmail}
          />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </CartProvider>
      </body>
    </html>
  )
}
