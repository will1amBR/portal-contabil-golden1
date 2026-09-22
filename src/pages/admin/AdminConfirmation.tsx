import { useEffect, useState } from 'react'
import {
  getConfirmationDocuments,
  confirmDocument,
  bulkConfirmDocuments,
  type Document,
} from '@/services/api'
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
import { Checkbox } from '@/components/ui/checkbox'
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
  Filter,
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
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([])
  const [companyFilter, setCompanyFilter] = useState<string>('all')
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

  // Grouped unique companies
  const companyOptions = Array.from(
    new Map(
      docs
        .filter((d) => d.expand?.company)
        .map((d) => [d.company, { id: d.company, name: d.expand!.company!.name }]),
    ).values(),
  )

  const filteredDocs =
    companyFilter === 'all' ? docs : docs.filter((d) => d.company === companyFilter)

  // Selection helpers
  const allFilteredSelected =
    filteredDocs.length > 0 && filteredDocs.every((d) => selectedDocIds.includes(d.id))
  const someFilteredSelected =
    filteredDocs.some((d) => selectedDocIds.includes(d.id)) && !allFilteredSelected

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      // Unselect all filtered docs
      const filteredIds = new Set(filteredDocs.map((d) => d.id))
      setSelectedDocIds((prev) => prev.filter((id) => !filteredIds.has(id)))
    } else {
      // Select all filtered docs
      const newIds = new Set([...selectedDocIds, ...filteredDocs.map((d) => d.id)])
      setSelectedDocIds(Array.from(newIds))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

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

  const handleConfirmSelected = async () => {
    const docsToConfirm = docs.filter((d) => selectedDocIds.includes(d.id))
    if (docsToConfirm.length === 0) return

    setActionLoadingId('selected')
    try {
      await bulkConfirmDocuments(
        docsToConfirm.map((doc) => ({
          id: doc.id,
          title: doc.title,
          company: doc.company,
          suggestedCategory: doc.suggested_category || doc.category,
          currentCategory: doc.category,
        })),
        'Validação em lote realizada com sucesso pela equipe Golden.',
      )
      toast({
        title: 'Documentos confirmados em lote!',
        description: `${docsToConfirm.length} documento(s) confirmados com sucesso. O cliente recebeu a notificação consolidada por e-mail.`,
      })
      setSelectedDocIds([])
      await loadData()
    } catch {
      toast({
        title: 'Erro na confirmação em lote',
        description: 'Não foi possível confirmar os documentos selecionados.',
        variant: 'destructive',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleConfirmCompanyBatch = async (companyId: string, companyName: string) => {
    const companyDocs = docs.filter((d) => d.company === companyId)
    if (companyDocs.length === 0) return

    setActionLoadingId(`company_${companyId}`)
    try {
      await bulkConfirmDocuments(
        companyDocs.map((doc) => ({
          id: doc.id,
          title: doc.title,
          company: doc.company,
          suggestedCategory: doc.suggested_category || doc.category,
          currentCategory: doc.category,
        })),
        `Validação em lote aprovada para a empresa ${companyName}.`,
      )
      toast({
        title: `Lote confirmado para ${companyName}!`,
        description: `${companyDocs.length} documento(s) confirmados. E-mail consolidado disparado para o cliente.`,
      })
      setSelectedDocIds((prev) => prev.filter((id) => !companyDocs.some((cd) => cd.id === id)))
      await loadData()
    } catch {
      toast({
        title: 'Erro ao confirmar lote da empresa',
        description: 'Não foi possível confirmar os documentos da empresa.',
        variant: 'destructive',
      })
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

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedDocIds.length > 0 && (
            <Button
              onClick={handleConfirmSelected}
              disabled={!!actionLoadingId}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2 font-semibold"
            >
              {actionLoadingId === 'selected' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
              <span>Confirmar Selecionados ({selectedDocIds.length})</span>
            </Button>
          )}

          {docs.length > 0 && selectedDocIds.length === 0 && (
            <Button
              onClick={() => {
                setSelectedDocIds(filteredDocs.map((d) => d.id))
              }}
              variant="outline"
              disabled={!!actionLoadingId}
              className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 gap-2 text-xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Selecionar Todos ({filteredDocs.length})</span>
            </Button>
          )}
        </div>
      </div>

      {/* Company Quick Action Cards (Aprovação em Lote por Cliente) */}
      {companyOptions.length > 0 && docs.length > 1 && (
        <Card className="border border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-white to-indigo-50/30 shadow-xs">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Aprovação em Lote por Empresa Cliente
              </CardTitle>
            </div>
            <span className="text-[11px] text-slate-500">
              Confirme de uma vez só todos os arquivos do mesmo cliente
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-1 flex flex-wrap items-center gap-3">
            {companyOptions.map((c) => {
              const count = docs.filter((d) => d.company === c.id).length
              const isProcessing = actionLoadingId === `company_${c.id}`
              if (count === 0) return null

              return (
                <div
                  key={c.id}
                  className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 truncate block max-w-[200px]">
                      {c.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {count} pendência(s) de triagem
                    </span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleConfirmCompanyBatch(c.id, c.name)}
                    disabled={!!actionLoadingId}
                    className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1 px-2.5"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                    <span>Confirmar Lote ({count})</span>
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Filter and Selection bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all-top"
              checked={allFilteredSelected ? true : someFilteredSelected ? 'indeterminate' : false}
              onCheckedChange={toggleSelectAll}
            />
            <label
              htmlFor="select-all-top"
              className="font-semibold text-slate-800 cursor-pointer select-none"
            >
              {allFilteredSelected
                ? 'Desmarcar todos'
                : `Selecionar todos da visualização (${filteredDocs.length})`}
            </label>
          </div>

          {selectedDocIds.length > 0 && (
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
              {selectedDocIds.length} selecionado(s)
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Filtrar por Empresa:</span>
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-52 h-8 text-xs bg-slate-50 border-slate-200">
              <SelectValue placeholder="Todas as empresas" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Todas as empresas ({docs.length})</SelectItem>
              {companyOptions.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} ({docs.filter((d) => d.company === c.id).length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                  <TableHead className="py-3.5 w-12 text-center">
                    <Checkbox
                      checked={
                        allFilteredSelected ? true : someFilteredSelected ? 'indeterminate' : false
                      }
                      onCheckedChange={toggleSelectAll}
                      aria-label="Selecionar todos os documentos"
                    />
                  </TableHead>
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
                {filteredDocs.map((doc) => {
                  const suggestedKey = doc.suggested_category || 'legal'
                  const cat = CAT_CONFIG[suggestedKey] || CAT_CONFIG.legal
                  const Icon = cat.icon
                  const isSelected = selectedDocIds.includes(doc.id)
                  const isProcessing =
                    actionLoadingId === doc.id ||
                    actionLoadingId === 'selected' ||
                    actionLoadingId === `company_${doc.company}`

                  return (
                    <TableRow
                      key={doc.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <TableCell className="py-4 text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectOne(doc.id)}
                          aria-label={`Selecionar ${doc.title}`}
                        />
                      </TableCell>
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
