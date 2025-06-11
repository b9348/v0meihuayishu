"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import type { Message } from "ai"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  username: string
  // In a real app, password would be hashed and not stored directly
  // For in-memory, we'll store it plain for simplicity as requested
  password?: string
  chatHistory: Message[]
}

interface AuthContextType {
  currentUser: User | null
  isAuthenticated: boolean
  isAdminAuthenticated: boolean
  login: (username: string, password?: string) => Promise<boolean> // Password optional for guest/auto-login
  register: (username: string, password?: string) => Promise<boolean>
  logout: () => void
  addMessageToHistory: (message: Message) => void
  adminLogin: (password: string) => boolean
  adminLogout: () => void
  users: User[] // For admin to potentially view (simplified)
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// In-memory store for users. This will reset on browser refresh/app restart.
let memoryUsers: User[] = []

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const { toast } = useToast()

  // Load user from localStorage if available (simulates session persistence for current tab)
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      // Re-validate or find in memoryUsers to ensure consistency if app logic requires
      const existingUser = memoryUsers.find((u) => u.id === parsedUser.id)
      if (existingUser) {
        setCurrentUser(existingUser)
      } else {
        // If user from localStorage isn't in memoryUsers (e.g. after a code update cleared memoryUsers)
        // Add them back or clear localStorage. For simplicity, we add them back.
        memoryUsers.push(parsedUser)
        setCurrentUser(parsedUser)
      }
    }
    const storedAdminAuth = localStorage.getItem("isAdminAuthenticated")
    if (storedAdminAuth === "true") {
      setIsAdminAuthenticated(true)
    }
  }, [])

  const login = async (username: string, password?: string): Promise<boolean> => {
    const user = memoryUsers.find((u) => u.username === username && u.password === password)
    if (user) {
      setCurrentUser(user)
      localStorage.setItem("currentUser", JSON.stringify(user))
      toast({ title: "登录成功", description: `欢迎回来, ${username}!` })
      return true
    }
    toast({ title: "登录失败", description: "用户名或密码错误。", variant: "destructive" })
    return false
  }

  const register = async (username: string, password?: string): Promise<boolean> => {
    if (memoryUsers.find((u) => u.username === username)) {
      toast({ title: "注册失败", description: "用户名已存在。", variant: "destructive" })
      return false
    }
    const newUser: User = {
      id: Date.now().toString(), // Simple ID generation
      username,
      password,
      chatHistory: [],
    }
    memoryUsers.push(newUser)
    setCurrentUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    toast({ title: "注册成功", description: `欢迎, ${username}!` })
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
    toast({ title: "已登出", description: "期待您的下次访问。" })
  }

  const addMessageToHistory = (message: Message) => {
    setCurrentUser((prevUser) => {
      if (!prevUser) return null
      const updatedUser = {
        ...prevUser,
        chatHistory: [...prevUser.chatHistory, message],
      }
      // Update in-memory store as well
      memoryUsers = memoryUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      return updatedUser
    })
  }

  const adminLogin = (password: string): boolean => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true)
      localStorage.setItem("isAdminAuthenticated", "true")
      toast({ title: "管理员登录成功" })
      return true
    }
    toast({ title: "管理员登录失败", description: "密码错误。", variant: "destructive" })
    return false
  }

  const adminLogout = () => {
    setIsAdminAuthenticated(false)
    localStorage.removeItem("isAdminAuthenticated")
    toast({ title: "管理员已登出" })
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdminAuthenticated,
        login,
        register,
        logout,
        addMessageToHistory,
        adminLogin,
        adminLogout,
        users: memoryUsers, // Provide users array for admin (simplified)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
