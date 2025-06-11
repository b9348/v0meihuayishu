"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>请登录或注册</DialogTitle>
          <DialogDescription>为了继续使用我们的服务并保存您的对话记录，请登录或注册一个账户。</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-center">
          <Button asChild onClick={onClose} className="bg-brand-purple hover:bg-brand-purple-dark">
            <Link href="/login">登录</Link>
          </Button>
          <Button variant="outline" asChild onClick={onClose}>
            <Link href="/register">注册</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
