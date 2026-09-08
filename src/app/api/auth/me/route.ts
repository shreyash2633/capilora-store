import { getAdmin } from "@/lib/auth"
import { ok } from "@/lib/api"

export async function GET() {
  const admin = await getAdmin()
  if (!admin) return ok({ admin: null }, 200)
  return ok({ admin: { email: admin.email, name: admin.name } })
}
