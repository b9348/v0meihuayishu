"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserCircle, MessageSquare } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const { currentUser, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>正在加载用户信息...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <UserCircle className="mx-auto h-16 w-16 text-brand-purple mb-2" />
          <CardTitle className="text-3xl">个人中心</CardTitle>
          <CardDescription>你好, {currentUser.username}! 这里是您的对话记录。</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-brand-purple-light" />
            对话历史
          </h3>
          {currentUser.chatHistory && currentUser.chatHistory.length > 0 ? (
            <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/30">
              {currentUser.chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-3 p-3 my-2 rounded-lg text-sm",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {msg.role === "assistant" && (
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="/placeholder.svg?height=28&width=28" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] p-2.5 rounded-lg shadow prose dark:prose-invert prose-sm",
                      msg.role === "user" ? "bg-brand-purple text-primary-foreground" : "bg-background",
                    )}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.role === "user" && (
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="/placeholder.svg?height=28&width=28" alt="User" />
                      <AvatarFallback>您</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground text-center py-4">暂无对话记录。</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
