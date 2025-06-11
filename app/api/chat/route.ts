import { streamText, StreamingTextResponse, type Message as VercelAIMessage } from "ai"
import { openai } from "@ai-sdk/openai"

export const runtime = "edge"

const systemPrompt = process.env.NEXT_PUBLIC_SYSTEM_PROMPT || "你是一位梅花易数大师。"

export async function POST(req: Request) {
  try {
    const { messages }: { messages: VercelAIMessage[] } = await req.json()

    // Ensure messages passed to streamText have unique IDs if your client relies on them,
    // though streamText itself primarily cares about role and content.
    // The 'ai/react' Message type requires an id.
    const messagesWithSystemPrompt: VercelAIMessage[] = [
      {
        id: "system-" + Date.now(), // Ensure a unique ID for the system message
        role: "system",
        content: systemPrompt,
      },
      // Ensure all subsequent messages also have unique IDs if they don't already
      ...messages.map((msg, index) => ({
        ...msg,
        id: msg.id || `msg-${Date.now()}-${index}`,
      })),
    ]

    const result = await streamText({
      model: openai.chat(
        // Use .chat() for chat models
        "gpt-4o-mini", // Or your preferred model: gpt-4.1-mini, gpt-4.1-nano
        {
          apiKey: process.env.OPENAI_API_KEY, // Pass config here
          baseURL: process.env.OPENAI_API_BASE,
        },
      ),
      messages: messagesWithSystemPrompt,
      // You can also pass the system prompt directly to streamText if preferred:
      // system: systemPrompt,
      // messages: messages, // If system prompt is passed via the 'system' property
    })

    // The result.toAIStream() converts the AI SDK stream to a format
    // compatible with StreamingTextResponse, handling potential Vercel AI SDK specific data.
    return new StreamingTextResponse(result.toAIStream())
  } catch (error: any) {
    console.error("[API Chat Error]", error)

    let errorMessage = "服务器内部错误，请稍后再试。"
    let status = 500
    let errorName = "UnknownError"
    let errorCause = undefined

    if (error && typeof error.message === "string") {
      errorMessage = error.message
    }
    if (error && typeof error.status === "number") {
      status = error.status
    }
    if (error && typeof error.name === "string") {
      errorName = error.name
    }
    if (error && error.cause) {
      errorCause = String(error.cause)
    }

    // Log more details for server-side inspection
    console.error(
      `Error details: Name: ${errorName}, Status: ${status}, Message: ${errorMessage}, Cause: ${errorCause}`,
    )

    return new Response(
      JSON.stringify({
        error: errorMessage,
        name: errorName,
        status: status,
        cause: errorCause,
      }),
      {
        status: status,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
