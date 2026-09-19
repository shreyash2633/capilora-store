import Link from "next/link"
import { SearchX } from "lucide-react"
import { Logo } from "@/components/site/logo"

export const metadata = { title: "Page not found", robots: { index: false, follow: true } }

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      <Logo />
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-100">
        <SearchX className="h-7 w-7 text-leaf-600" />
      </span>
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-forest-950">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-forest-900/60">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Our products are still here, though.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/products" className="btn-primary">Shop the Range</Link>
        <Link href="/" className="btn-outline">Back to Home</Link>
      </div>
    </div>
  )
}