"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAdminAuthenticated, adminLogout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAdminAuthenticated, router])

  if (!isAdminAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>正在跳转到管理员登录页面...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-muted p-6 border-r">
        <h2 className="text-2xl font-semibold mb-8 text-brand-purple">管理后台</h2>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/dashboard">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              仪表盘
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/users">
              <Users className="mr-2 h-5 w-5" />
              用户管理
            </Link>
          </Button>
          {/* <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/content"><FileText className="mr-2 h-5 w-5" />内容管理</Link>
          </Button> */}
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/api-usage">
              <BarChart3 className="mr-2 h-5 w-5" />
              API用量 (占位)
            </Link>
          </Button>
        </nav>
        <Button
          variant="outline"
          className="w-full mt-auto absolute bottom-6 left-0 right-0 mx-6"
          onClick={() => {
            adminLogout()
            router.push("/")
          }}
        >
          <LogOut className="mr-2 h-5 w-5" />
          退出管理后台
        </Button>
      </aside>
      <main className="flex-1 p-8 bg-background">{children}</main>
    </div>
  )
}
