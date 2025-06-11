"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import type React from "react"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  isDisabled?: boolean
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  isDisabled = false,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 p-4 border-t">
      <Input
        type="text"
        placeholder={isDisabled ? "请先登录或注册以继续对话" : "输入您的问题..."}
        value={input}
        onChange={handleInputChange}
        disabled={isLoading || isDisabled}
        className="flex-1"
      />
      <Button
        type="submit"
        disabled={isLoading || isDisabled || !input.trim()}
        size="icon"
        className="bg-brand-purple hover:bg-brand-purple-dark"
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">发送</span>
      </Button>
    </form>
  )
}
