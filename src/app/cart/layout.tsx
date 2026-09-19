import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your Capilora Professional cart and check out with free shipping on orders over ₹499.",
  robots: { index: false, follow: false },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}