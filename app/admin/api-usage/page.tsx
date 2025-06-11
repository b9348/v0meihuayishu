"use client"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useAuth } from "@/hooks/use-auth"

// Mock data for API usage chart
const generateMockApiData = (users: any[]) => {
  const data = [
    { name: "gpt-4o-mini", calls: 0 },
    { name: "gpt-4.1-mini", calls: 0 },
    { name: "gpt-4.1-nano", calls: 0 },
  ]
  // Simulate calls based on total AI messages, assuming all use gpt-4o-mini for simplicity
  const totalAiMessages = users.reduce(
    (sum, user) =>
      sum + user.chatHistory.filter((msg: any) => msg.role === "assistant" && msg.id !== "initial-greeting").length,
    0,
  )

  data[0].calls = totalAiMessages // Assign all to gpt-4o-mini
  // You could distribute this more realistically if needed
  // data[1].calls = Math.floor(totalAiMessages * 0.2);
  // data[2].calls = Math.floor(totalAiMessages * 0.1);
  return data
}

export default function AdminApiUsagePage() {
  const { users } = useAuth()
  const apiUsageData = generateMockApiData(users)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">API 用量统计 (模拟)</h1>
        <p className="text-muted-foreground">查看各模型API的模拟调用次数。</p>

        <Card>
          <CardHeader>
            <CardTitle>模型调用次数</CardTitle>
            <CardDescription>这是一个基于用户消息数量的模拟统计。</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apiUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="calls" fill="hsl(var(--primary))" name="调用次数" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>数据说明</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>此处的API用量数据是基于用户与AI的交互次数模拟生成的。</li>
              <li>每一次AI的回复（不包括初始问候）被计为一次对 `gpt-4o-mini` 模型的调用。</li>
              <li>由于用户数据存储在客户端内存中，此统计仅反映当前会话期间的数据，刷新页面将重置。</li>
              <li>在实际生产环境中，API用量统计会通过后端日志或API提供商的仪表盘进行精确追踪。</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
