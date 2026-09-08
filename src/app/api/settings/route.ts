import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { isAdminResponse, ok, requireAdmin } from "@/lib/api"
import { getSettings } from "@/lib/settings"

export async function GET() {
  const settings = await getSettings()
  return ok(settings)
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") return ok(await getSettings())

  const entries = Object.entries(body as Record<string, unknown>).filter(([, v]) => typeof v === "string")
  for (const [key, value] of entries) {
    await db.setting.upsert({ where: { key }, update: { value: value as string }, create: { key, value: value as string } })
  }
  return ok(await getSettings())
}
