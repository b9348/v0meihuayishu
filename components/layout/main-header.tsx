"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Home, User, LogIn, LogOut, Settings, ShieldCheck } from "lucide-react"
import ThemeToggle from "./theme-toggle" // Assuming you have this component

export default function MainHeader() {
  const { isAuthenticated, currentUser, logout, isAdminAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-brand-purple-light hover:text-brand-purple"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            <path d="M12 4v2m0 12v2m-6-6H4m14 0h-2m-7.75-4.25L4.5 6.5m13 0-1.75 1.75M4.5 17.5l1.75-1.75m11.5 0 1.75 1.75" />
          </svg>
          梅花易数AI
        </Link>
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="mr-1 h-4 w-4" /> 首页
            </Link>
          </Button>
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">
                  <User className="mr-1 h-4 w-4" />
                  个人中心
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1 h-4 w-4" />
                登出 ({currentUser?.username})
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                <LogIn className="mr-1 h-4 w-4" />
                登录/注册
              </Link>
            </Button>
          )}
          {isAdminAuthenticated && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/dashboard">
                <ShieldCheck className="mr-1 h-4 w-4" />
                管理后台
              </Link>
            </Button>
          )}
          {!isAdminAuthenticated && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/login">
                <Settings className="mr-1 h-4 w-4" />
                管理员
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
