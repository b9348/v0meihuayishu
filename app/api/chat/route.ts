import { OpenAIStream, StreamingTextResponse, type Message } from "ai"
import { OpenAI } from "@ai-sdk/openai"

export const runtime = "edge" // Optional, but recommended for Vercel Edge Functions

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
})

const systemPrompt = process.env.NEXT_PUBLIC_SYSTEM_PROMPT || "你是一位梅花易数大师。"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Add the system prompt to the beginning of the messages array
    const messagesWithSystemPrompt: Message[] = [
      {
        id: "system-prompt", // Or any unique ID
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ]

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Or other models like gpt-4.1-mini, gpt-4.1-nano
      stream: true,
      messages: messagesWithSystemPrompt,
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("[API Chat Error]", error)
    if (error instanceof OpenAI.APIError) {
      return new Response(JSON.stringify({ error: error.message, status: error.status }), {
        status: error.status,
        headers: { "Content-Type": "application/json" },
      })
    }
    return new Response(JSON.stringify({ error: "服务器内部错误，请稍后再试。" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
