import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track your Capilora Professional order by order number and phone number.",
  robots: { index: false, follow: false },
}

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}