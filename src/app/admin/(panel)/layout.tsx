import { redirect } from "next/navigation"
import { getAdmin } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/sidebar"

export const dynamic = "force-dynamic"
export const metadata = { title: "Admin Panel" }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin()
  if (!admin) redirect("/admin/login")

  return (
    <div className="flex min-h-screen flex-col bg-cream lg:flex-row">
      <AdminSidebar adminName={admin.name} />
      <div className="flex-1 overflow-y-auto lg:h-screen">
        <div className="mx-auto max-w-6xl p-5 sm:p-8">{children}</div>
      </div>
    </div>
  )
}
