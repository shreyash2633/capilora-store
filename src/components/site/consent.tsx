"use client"

import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/react"

const KEY = "capilora-consent"

export function ConsentAndAnalytics() {
  const [consent, setConsent] = useState<string | null>(null)

  useEffect(() => {
    setConsent(localStorage.getItem(KEY))
  }, [])

  const decide = (value: string) => {
    localStorage.setItem(KEY, value)
    setConsent(value)
  }

  return (
    <>
      {consent === "yes" && <Analytics />}
      {consent === null && (
        <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-50 p-4">
          <div className="card mx-auto flex max-w-2xl flex-col gap-4 bg-white/95 p-5 shadow-xl backdrop-blur sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="text-sm font-semibold text-forest-950">We use cookies</p>
              <p className="mt-1 text-xs leading-relaxed text-forest-900/60">
                We use privacy-friendly analytics to understand how the site is used. No tracking or advertising cookies are set.
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => decide("no")} className="btn-outline flex-1 sm:flex-none">Decline</button>
              <button onClick={() => decide("yes")} className="btn-primary flex-1 sm:flex-none">Accept</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}