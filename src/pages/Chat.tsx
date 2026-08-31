import { useState, useRef, useEffect } from 'react'
import { streamAgentChat, type DisplayMessage } from '@/lib/skipAi'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Bot,
  User,
  Send,
  Sparkles,
  HelpCircle,
  FileSearch,
  Calendar,
  Building2,
  Receipt,
  Scale,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

const SUGGESTED_PROMPTS = [
  'Quais são os impostos que vencem este mês?',
  'Como funciona o regime Simples Nacional?',
  'Quais documentos faltam para minha empresa?',
  'Qual a diferença entre DARF e DAS?',
]

export default function Chat() {
  const { user, isAccountant } = useAuth()
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

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim() || loading) return

    const userMsg: DisplayMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend.trim(),
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
          content: 'Desculpe, ocorreu uma instabilidade momentânea na conexão com o assistente.',
          created: new Date().toISOString(),
        },
      ])
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col pb-16 lg:pb-0">
      <Card className="flex-1 flex flex-col border border-slate-200/90 shadow-sm bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="border-b border-slate-100 bg-slate-900 text-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold text-white">
                    Assistente Contábil Golden
                  </CardTitle>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                    Online
                  </Badge>
                </div>
                <CardDescription className="text-xs text-slate-300">
                  Respostas baseadas nos documentos, tributos e histórico da sua empresa.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Chat Stream Area */}
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-slate-50/40">
          <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-10 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Como posso ajudar hoje?</h3>
                <p className="text-xs text-slate-500 max-w-md mt-1 mb-6 leading-relaxed">
                  Tire dúvidas fiscais, consulte datas limites de obrigações tributárias ou solicite
                  resumos sobre seus arquivos contábeis.
                </p>

                {/* Suggestions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg text-left">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="p-3 text-xs rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/30 transition-all text-slate-700 font-medium text-left flex items-center justify-between group shadow-2xs"
                    >
                      <span className="line-clamp-2">{prompt}</span>
                      <span className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex gap-3 max-w-[88%] sm:max-w-[80%]',
                    m.role === 'user' ? 'ml-auto flex-row-reverse' : '',
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
                      m.role === 'user'
                        ? 'bg-slate-900 text-white'
                        : 'bg-emerald-100 text-emerald-700',
                    )}
                  >
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={cn(
                      'p-4 rounded-2xl text-sm leading-relaxed shadow-2xs',
                      m.role === 'user'
                        ? 'bg-emerald-700 text-white rounded-tr-xs'
                        : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-xs',
                    )}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Documentos Citados:
                        </p>
                        {m.citations.map((c) => (
                          <p
                            key={c.n}
                            className="text-[11px] text-slate-500 italic bg-slate-50 p-1.5 rounded border"
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
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 rounded-tl-xs flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span className="text-xs font-medium">Consultando base fiscal...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Box */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="relative flex items-center"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte sobre seus impostos, vencimentos ou documentos..."
                className="pr-12 py-5 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-emerald-600 text-sm"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1.5 h-8 w-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
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
