import { FormEvent, useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Bot, Loader2, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/context/ToastContext"
import { getApiError } from "@/services/api"
import { queryMeeting } from "@/services/chat"
import type { ChatMessage } from "@/types"

export function MeetingChat({ meetingId, workspaceId }: { meetingId: string; workspaceId: string }) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Ask anything about this meeting. I will only query the current meeting memory.",
    },
  ])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: trimmed }
    const pendingId = crypto.randomUUID()

    setMessages((current) => [
      ...current,
      userMessage,
      { id: pendingId, role: "assistant", content: "Thinking through the meeting context...", pending: true },
    ])
    setQuery("")
    setLoading(true)

    try {
      const response = await queryMeeting({
        query: trimmed,
        workspace_id: workspaceId,
        meeting_id: meetingId,
      })

      setMessages((current) =>
        current.map((message) =>
          message.id === pendingId ? { ...message, content: response.answer, pending: false } : message
        )
      )
    } catch (error) {
      setMessages((current) => current.filter((message) => message.id !== pendingId))
      toast({ title: "AI query failed", description: getApiError(error), tone: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="glass-panel flex min-h-[42rem] flex-col rounded-lg">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-lg font-semibold">AI chat</h2>
        <p className="mt-1 text-sm text-muted-foreground">Semantic answers from this meeting only.</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
        {messages.map((message) => {
          const isUser = message.role === "user"

          return (
            <div key={message.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser ? (
                <div className="grid size-8 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  {message.pending ? <Loader2 className="size-4 animate-spin" /> : <Bot className="size-4" />}
                </div>
              ) : null}
              <div
                className={`max-w-[88%] rounded-lg border px-4 py-3 text-sm leading-6 ${
                  isUser
                    ? "border-primary/30 bg-primary/15 text-foreground"
                    : "border-white/10 bg-white/[0.045] text-muted-foreground"
                }`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="mb-2 list-disc pl-5">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 list-decimal pl-5">{children}</ol>,
                    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              {isUser ? (
                <div className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06]">
                  <User className="size-4" />
                </div>
              ) : null}
            </div>
          )
        })}
        <div ref={scrollRef} />
      </div>

      <form className="sticky bottom-0 border-t border-white/10 bg-background/80 p-4 backdrop-blur-xl" onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <Textarea
            className="max-h-36 min-h-11 resize-none"
            placeholder="Ask about a decision, blocker, owner, or task..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
          />
          <Button size="icon-lg" type="submit" disabled={loading || !query.trim()}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </div>
      </form>
    </section>
  )
}
