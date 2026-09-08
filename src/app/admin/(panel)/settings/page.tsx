"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/client"

const FIELDS: { key: string; label: string; hint?: string; textarea?: boolean }[] = [
  { key: "announcement", label: "Announcement Bar", hint: "Shown at the top of every page", textarea: true },
  { key: "contactPhone", label: "Support Phone" },
  { key: "contactWhatsApp", label: "WhatsApp Number", hint: "Digits only with country code, e.g. 918262856278" },
  { key: "contactEmail", label: "Support Email" },
  { key: "contactAddress", label: "Business / Mfg. Address", textarea: true },
  { key: "freeShipThreshold", label: "Free Shipping Threshold (₹)" },
  { key: "shippingFee", label: "Shipping Fee (₹)" },
]

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    try {
      setValues(await api<Record<string, string>>("/api/settings"))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load settings")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function save() {
    setSaving(true)
    setMessage("")
    setError("")
    try {
      setValues(await api<Record<string, string>>("/api/settings", { method: "PUT", json: values }))
      setMessage("✓ Settings saved — changes are live on the store.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="card p-10 text-center text-sm text-forest-900/50">Loading settings…</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Store Settings</h1>
          <p className="mt-1 text-sm text-forest-900/60">Contact info, shipping rules and announcements.</p>
        </div>
        <button className="btn-primary btn-sm" onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save Changes
        </button>
      </div>

      {message && <p className="rounded-xl bg-lime-100 p-4 text-sm font-semibold text-forest-800">{message}</p>}
      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      <div className="card grid gap-5 p-6 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.textarea ? "sm:col-span-2" : ""}>
            <label className="label">{f.label}</label>
            {f.textarea ? (
              <textarea
                className="input min-h-20"
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            ) : (
              <input
                className="input"
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            )}
            {f.hint && <p className="mt-1 text-[11px] text-forest-900/40">{f.hint}</p>}
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-forest-900/50">Payment Gateway</h2>
        <p className="mt-2 text-sm leading-relaxed text-forest-900/60">
          Razorpay keys are read from the <span className="font-mono text-xs">.env</span> file:{" "}
          <span className="font-mono text-xs">RAZORPAY_KEY_ID</span> and{" "}
          <span className="font-mono text-xs">RAZORPAY_KEY_SECRET</span>. Until live keys are added, online payments run
          in clearly-labelled <strong>demo mode</strong> so you can test the full flow. COD always works.
        </p>
      </div>
    </div>
  )
}
