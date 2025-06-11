"use client"

import type React from "react"

import { useChat, type Message } from "ai/react"
import { useEffect, useState, useRef } from "react"
import ChatMessages from "@/components/chat/chat-messages"
import ChatInput from "@/components/chat/chat-input"
import AuthModal from "@/components/auth/auth-modal"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

const initialGreeting =
  process.env.NEXT_PUBLIC_INITIAL_GREETING || "欢迎！我已准备好帮助您探索梅花易数的奥秘。尽管问我！"

export default function ChatPage() {
  const { isAuthenticated, currentUser, addMessageToHistory } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [conversationTurn, setConversationTurn] = useState(0)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, error } = useChat({
    api: "/api/chat",
    initialMessages:
      currentUser?.chatHistory && currentUser.chatHistory.length > 0
        ? currentUser.chatHistory
        : [{ id: "initial-greeting", role: "assistant", content: initialGreeting }],
    onFinish: (message) => {
      if (isAuthenticated && currentUser) {
        addMessageToHistory(message) // Add AI's final message
      }
      setConversationTurn((prev) => prev + 1)
    },
    onError: (err) => {
      console.error("Chat error:", err)
      // Potentially show a toast notification here
    },
  })

  // Sync messages from AuthContext when user logs in/out or history changes
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.chatHistory.length > 0) {
        setMessages(currentUser.chatHistory)
      } else {
        // If user has no history, but there's an initial greeting, keep it.
        // Otherwise, set the initial greeting.
        const currentMessagesIncludeGreeting = messages.some((m) => m.id === "initial-greeting")
        if (!currentMessagesIncludeGreeting) {
          setMessages([{ id: "initial-greeting", role: "assistant", content: initialGreeting }])
        }
      }
      setConversationTurn(currentUser.chatHistory.filter((m) => m.role === "user").length)
    } else {
      // User logged out or not authenticated, reset to initial greeting
      setMessages([{ id: "initial-greeting", role: "assistant", content: initialGreeting }])
      setConversationTurn(0)
    }
  }, [isAuthenticated, currentUser, setMessages])

  // Handle adding user message to history (for authenticated users)
  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(), // Or use uuid
      role: "user",
      content: input,
    }

    if (isAuthenticated && currentUser) {
      addMessageToHistory(userMessage)
    }

    handleSubmit(e, {
      options: {
        body: {
          // Potentially add other options here if needed by your API
        },
      },
    })
    if (!isAuthenticated) {
      setConversationTurn((prev) => prev + 1)
    }
  }

  // Registration prompt logic
  useEffect(() => {
    // 2 exchanges = 1 user message + 1 AI response (initial greeting) + 1 user message + 1 AI response
    // So, prompt after the 2nd user message has been sent, meaning conversationTurn (user turns) is 2.
    if (!isAuthenticated && conversationTurn >= 2 && !isLoading) {
      setIsAuthModalOpen(true)
    }
  }, [conversationTurn, isAuthenticated, isLoading])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center p-2 sm:p-6">
      <Card className="w-full max-w-3xl h-full flex flex-col shadow-2xl bg-card/80 backdrop-blur-md">
        <CardHeader className="text-center border-b pb-4">
          <CardTitle className="text-3xl font-bold text-brand-purple-light">梅花易数AI大师</CardTitle>
          <CardDescription className="text-muted-foreground">与AI一同探索命运的玄机</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-grow relative">
            <ChatMessages messages={messages} isLoading={isLoading} />
            <div ref={messagesEndRef} />
            {messages.length > 3 && ( // Show scroll to bottom button if messages overflow
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-4 right-4 rounded-full h-10 w-10 bg-background/70 hover:bg-muted"
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-5 w-5" />
              </Button>
            )}
          </div>
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleChatSubmit}
            isLoading={isLoading}
            isDisabled={isAuthModalOpen} // Disable input if auth modal is open
          />
        </CardContent>
      </Card>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      {error && (
        <div className="mt-4 text-red-500 text-center">
          发生错误: {error.message || "无法连接到AI服务，请稍后再试。"}
        </div>
      )}
    </div>
  )
}
