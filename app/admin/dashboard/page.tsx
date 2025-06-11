"use client"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, MessageSquareText, BarChartBig } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function AdminDashboardPage() {
  const { users } = useAuth() // Get users from context for display

  const totalMessages = users.reduce((sum, user) => sum + user.chatHistory.length, 0)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">管理仪表盘</h1>
        <p className="text-muted-foreground">欢迎来到梅花易数AI管理后台。在这里您可以概览网站数据。</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">注册用户总数</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">当前已注册的用户数量</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总消息数</CardTitle>
              <MessageSquareText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
              <p className="text-xs text-muted-foreground">所有用户的总对话消息数量</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API调用次数 (模拟)</CardTitle>
              <BarChartBig className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(totalMessages / 2).toFixed(0)} {/* Assuming 1 API call per AI response */}
              </div>
              <p className="text-xs text-muted-foreground">模拟的API调用统计</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>近期活动 (占位)</CardTitle>
            <CardDescription>这里将显示最近的用户注册或重要操作。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">暂无近期活动数据。</p>
            {/* Future: List recent registrations or other notable events */}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
