import { NextResponse } from "next/server"
import { getAdmin, type AdminPayload } from "./auth"

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data as unknown as Record<string, unknown>, { status })
}

export function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function requireAdmin(): Promise<AdminPayload | NextResponse> {
  const admin = await getAdmin()
  if (!admin) return bad("Unauthorized — admin login required", 401)
  return admin
}

export function isAdminResponse(v: unknown): v is AdminPayload {
  return typeof v === "object" && v !== null && "sub" in (v as Record<string, unknown>)
}
