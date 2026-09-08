import { NextRequest } from "next/server"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { bad, isAdminResponse, ok, requireAdmin } from "@/lib/api"
import { slugify } from "@/lib/utils"

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!isAdminResponse(admin)) return admin

  const form = await req.formData().catch(() => null)
  if (!form) return bad("Expected multipart form data")

  const files = form.getAll("files").filter((f): f is File => f instanceof File)
  if (files.length === 0) return bad("No files uploaded")

  const dir = path.join(process.cwd(), "public", "uploads")
  await mkdir(dir, { recursive: true })

  const paths: string[] = []
  for (const file of files) {
    if (!ALLOWED.includes(file.type)) return bad(`Unsupported file type: ${file.type}`)
    if (file.size > 8 * 1024 * 1024) return bad("Max file size is 8 MB")
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "")
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image"
    const name = `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`
    const buf = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(dir, name), buf)
    paths.push(`/uploads/${name}`)
  }

  return ok({ paths })
}
