import { useEffect, useState } from 'react'
import { getConfirmationDocuments, confirmDocument, type Document } from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ClipboardCheck,
  Check,
  Edit3,
  Sparkles,
  Building2,
  Calendar,
  AlertCircle,
  FileCheck2,
  CheckCheck,
  Receipt,
  Wallet,
  Calculator,
  Scale,
  Loader2,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

const CAT_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  tax: {
    label: 'Impostos & Guias',
    icon: Receipt,
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
  },
  payroll: {
    label: 'RH & Holerites',
    icon: Wallet,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
  },
  accounting: {
    label: 'Contábeis',
    icon: Calculator,
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
  },
  legal: {
    label: 'Legal & Contratos',
    icon: Scale,
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
  },
}

export default function AdminConfirmation() {
  const [docs, setDocs] = useState<Document[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const { toast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      const d = await getConfirmationDocuments()
      setDocs(d)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('documents', () => {
    loadData()
  })

  const handleConfirm = async (doc: Document) => {
    setActionLoadingId(doc.id)
    try {
      await confirmDocument(
        doc.id,
        doc.suggested_category || 'legal',
        false,
        doc.suggested_category || doc.category,
      )
      toast({
        title: 'Categoria confirmada',
        description: `O documento "${doc.title}" foi enviado para a fila de validação (IA Acertou).`,
      })
      await loadData()
    } catch {
      toast({
        title: 'Erro ao confirmar',
        description: 'Não foi possível confirmar o documento.',
        variant: 'destructive',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleChangeCategory = async (doc: Document, category: string) => {
    setActionLoadingId(doc.id)
    try {
      const wasModified = category !== (doc.suggested_category || doc.category)
      await confirmDocument(doc.id, category, wasModified, doc.suggested_category || doc.category)
      setEditingId(null)
      toast({
        title: wasModified ? 'Ajuste manual registrado' : 'Categoria confirmada',
        description: `Documento classificado como ${CAT_CONFIG[category]?.label || category}.`,
      })
      await loadData()
    } catch {
      toast({
        title: 'Erro ao reclassificar',
        description: 'Não foi possível salvar a nova categoria.',
        variant: 'destructive',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleConfirmAll = async () => {
    if (docs.length === 0) return
    setActionLoadingId('all')
    try {
      await Promise.all(
        docs.map((doc) =>
          confirmDocument(
            doc.id,
            doc.suggested_category || 'legal',
            false,
            doc.suggested_category || doc.category,
          ),
        ),
      )
      toast({
        title: 'Todos os documentos confirmados!',
        description: `${docs.length} documentos validados conforme as sugestões da IA.`,
      })
      await loadData()
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Top Banner / Explanation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Triagem Inteligente (IA)
              </h1>
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs">
                {docs.length} aguardando
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">
              Revise as sugestões automáticas da IA para os documentos recém-enviados pelos
              clientes.
            </p>
          </div>
        </div>

        {docs.length > 1 && (
          <Button
            onClick={handleConfirmAll}
            disabled={!!actionLoadingId}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2"
          >
            {actionLoadingId === 'all' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCheck className="w-4 h-4" />
            )}
            <span>Confirmar Todos ({docs.length})</span>
          </Button>
        )}
      </div>

      {/* Info card on workflow */}
      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-950">
        <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Como funciona a esteira contábil:</strong> Quando o cliente envia um arquivo,
          nossa IA analisa o título e conteúdo para propor a melhor categoria fiscal/contábil. O
          contador confirma a sugestão com um clique ou altera manualmente antes de liberar para
          aprovação final.
        </div>
      </div>

      {/* Main List */}
      {docs.length === 0 ? (
        <Card className="border border-slate-200 shadow-xs bg-white">
          <CardContent className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Triagem em Dia!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Nenhum documento aguardando confirmação de categoria neste momento. Novos envios
              aparecerão aqui automaticamente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b border-slate-200">
                  <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Documento
                  </TableHead>
                  <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Empresa
                  </TableHead>
                  <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Sugestão da IA
                  </TableHead>
                  <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Enviado em
                  </TableHead>
                  <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider text-right">
                    Decisão do Contador
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {docs.map((doc) => {
                  const suggestedKey = doc.suggested_category || 'legal'
                  const cat = CAT_CONFIG[suggestedKey] || CAT_CONFIG.legal
                  const Icon = cat.icon
                  const isProcessing = actionLoadingId === doc.id || actionLoadingId === 'all'

                  return (
                    <TableRow key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <TableCell className="py-4">
                        <div className="font-semibold text-slate-900 text-sm">{doc.title}</div>
                      </TableCell>
                      <TableCell className="py-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{doc.expand?.company?.name || 'Tech Solutions LTDA'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${cat.bg} ${cat.color}`}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{cat.label}</span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-xs text-slate-500 whitespace-nowrap">
                        {format(parseISO(doc.created), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        {editingId === doc.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <Select
                              onValueChange={(v) => handleChangeCategory(doc, v)}
                              defaultValue={suggestedKey}
                            >
                              <SelectTrigger className="w-48 h-8 text-xs bg-white">
                                <SelectValue placeholder="Escolha a categoria correta" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tax">Impostos & Guias</SelectItem>
                                <SelectItem value="payroll">RH & Holerites</SelectItem>
                                <SelectItem value="accounting">Contábeis</SelectItem>
                                <SelectItem value="legal">Legal & Contratos</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-xs text-slate-500"
                              onClick={() => setEditingId(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs shadow-xs"
                              onClick={() => handleConfirm(doc)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                              ) : (
                                <Check className="w-3.5 h-3.5 mr-1" />
                              )}
                              Confirmar Sugestão
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs text-slate-700 border-slate-200"
                              onClick={() => setEditingId(doc.id)}
                              disabled={isProcessing}
                            >
                              <Edit3 className="w-3.5 h-3.5 mr-1" /> Alterar
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
