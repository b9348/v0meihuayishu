import type { Message } from "ai"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <ScrollArea className="h-[calc(100vh-24rem)] w-full rounded-md border p-4 flex-grow">
      {messages.map((m) => (
        <div
          key={m.id}
          className={cn(
            "flex items-start gap-3 p-3 my-2 rounded-lg",
            m.role === "user" ? "justify-end" : "justify-start",
          )}
        >
          {m.role === "assistant" && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          )}
          <div
            className={cn(
              "max-w-[70%] p-3 rounded-xl shadow-md prose dark:prose-invert prose-sm",
              m.role === "user" ? "bg-brand-purple text-primary-foreground" : "bg-muted",
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
          </div>
          {m.role === "user" && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>您</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="flex items-start gap-3 p-3 my-2 justify-start">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="max-w-[70%] p-3 rounded-xl shadow-md bg-muted">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-muted-foreground">AI正在思考中</span>
              <div className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-foreground rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </ScrollArea>
  )
}
