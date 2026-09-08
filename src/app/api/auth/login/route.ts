import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { db } from "@/lib/db"
import { ADMIN_COOKIE, createAdminToken } from "@/lib/auth"
import { bad } from "@/lib/api"

const schema = z.object({ email: z.string().min(3), password: z.string().min(1) })

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return bad("Email and password are required")

  const { email, password } = parsed.data
  const admin = await db.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
    return bad("Invalid email or password", 401)
  }

  const token = await createAdminToken({ sub: String(admin.id), email: admin.email, name: admin.name })
  const res = NextResponse.json({ ok: true, name: admin.name, email: admin.email })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
  return res
}
