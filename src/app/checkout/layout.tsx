import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for your Capilora Professional order. Cash on Delivery available across India.",
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}