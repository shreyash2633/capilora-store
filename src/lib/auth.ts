import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

export const ADMIN_COOKIE = "capilora_admin"

export interface AdminPayload {
  sub: string
  email: string
  name: string
}

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET || "capilora-dev-secret"
  return new TextEncoder().encode(s)
}

export async function createAdminToken(payload: AdminPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (!payload.sub) return null
    return { sub: payload.sub, email: String(payload.email ?? ""), name: String(payload.name ?? "Admin") }
  } catch {
    return null
  }
}

/** Server components / route handlers: returns the signed-in admin or null. */
export async function getAdmin(): Promise<AdminPayload | null> {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  if (!token) return null
  return verifyAdminToken(token)
}
