import { useState, useRef, useEffect } from 'react'
import { streamAgentChat, type DisplayMessage } from '@/lib/skipAi'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, User, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Chat() {
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [convId, setConvId] = useState<string | null>(null)
  const abortCtrl = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: DisplayMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      created: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    abortCtrl.current = new AbortController()
    let finalConvId = convId

    try {
      const res = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/ask-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: pb.authStore.token },
        body: JSON.stringify({ message: userMsg.content, conversation_id: convId }),
        signal: abortCtrl.current.signal,
      })

      let botMsgContent = ''
      const result = await streamAgentChat(res, {
        onChunk: (_, full) => {
          botMsgContent = full
          setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (last.role === 'assistant') {
              const updated = [...prev]
              updated[updated.length - 1] = { ...last, content: full }
              return updated
            }
            return [
              ...prev,
              { id: 'temp', role: 'assistant', content: full, created: new Date().toISOString() },
            ]
          })
        },
        signal: abortCtrl.current.signal,
      })

      finalConvId = res.headers.get('X-Conversation-Id') ?? result.conversation_id
      setConvId(finalConvId)

      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last.role === 'assistant') {
          updated[updated.length - 1] = {
            ...last,
            id: result.message_id,
            citations: result.citations,
          }
        }
        return updated
      })
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err',
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
          created: new Date().toISOString(),
        },
      ])
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col pb-16 md:pb-0">
      <Card className="flex-1 flex flex-col border-0 shadow-elevation overflow-hidden">
        <CardHeader className="border-b bg-slate-50 py-4">
          <CardTitle className="flex items-center gap-3 text-slate-900">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-600" />
            </div>
            Contador Virtual
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <Bot className="w-12 h-12 mb-4 opacity-50" />
                <p>Olá! Sou seu assistente contábil.</p>
                <p className="text-sm mt-2">
                  Pergunte-me sobre seus impostos, vencimentos ou peça para buscar um documento.
                </p>
              </div>
            )}
            <div className="space-y-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex gap-3 max-w-[85%]',
                    m.role === 'user' ? 'ml-auto flex-row-reverse' : '',
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
                      m.role === 'user' ? 'bg-slate-200' : 'bg-emerald-100',
                    )}
                  >
                    {m.role === 'user' ? (
                      <User className="w-4 h-4 text-slate-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'p-4 rounded-2xl',
                      m.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-900 rounded-tl-sm',
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/50">
                        <p className="text-xs font-semibold mb-1 opacity-70">Fontes:</p>
                        {m.citations.map((c) => (
                          <p
                            key={c.n}
                            className="text-[10px] opacity-70 truncate"
                            title={c.excerpt}
                          >
                            [{c.n}] {c.excerpt}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 text-slate-900 rounded-tl-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSend} className="relative flex items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="pr-12 py-6 rounded-full bg-slate-50 border-slate-200 focus-visible:ring-emerald-500"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700"
                disabled={!input.trim() || loading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
