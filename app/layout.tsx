import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import MainHeader from "@/components/layout/main-header"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "梅花易数AI大师",
  description: "AI驱动的梅花易数在线咨询与解读",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <MainHeader />
            <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-10rem)]">{children}</main>
            <footer className="text-center py-4 border-t text-sm text-muted-foreground">
              © {new Date().getFullYear()} 梅花易数AI大师. 版权所有.
            </footer>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
