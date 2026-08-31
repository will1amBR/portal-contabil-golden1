import { useEffect, useState, useMemo } from 'react'
import {
  getDocuments,
  getCompanies,
  approveDocument,
  rejectDocument,
  type Document,
  type Company,
} from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import { DocumentTable } from '@/components/DocumentTable'
import { DocumentUpload } from '@/components/DocumentUpload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Check,
  X,
  FileText,
  Search,
  Filter,
  Building2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AdminDocuments() {
  const [docs, setDocs] = useState<Document[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [rejectDoc, setRejectDoc] = useState<Document | null>(null)
  const [notes, setNotes] = useState('')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ company: 'all', category: 'all', status: 'all' })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      const [d, c] = await Promise.all([getDocuments(), getCompanies()])
      setDocs(d)
      setCompanies(c)
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

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false
      if (filters.company !== 'all' && d.company !== filters.company) return false
      if (filters.category !== 'all' && d.category !== filters.category) return false
      if (filters.status !== 'all' && d.validation_status !== filters.status) return false
      return true
    })
  }, [docs, search, filters])

  const handleApprove = async (doc: Document) => {
    try {
      await approveDocument(doc.id)
      toast({ title: 'Documento aprovado com sucesso!' })
      loadData()
    } catch {
      toast({ title: 'Erro ao aprovar documento.', variant: 'destructive' })
    }
  }

  const handleReject = async () => {
    if (!rejectDoc) return
    try {
      await rejectDocument(rejectDoc.id, notes.trim())
      toast({ title: 'Documento rejeitado.' })
      setRejectDoc(null)
      setNotes('')
      loadData()
    } catch {
      toast({ title: 'Erro ao rejeitar.', variant: 'destructive' })
    }
  }

  const resetFilters = () => {
    setSearch('')
    setFilters({ company: 'all', category: 'all', status: 'all' })
  }

  const actions = (doc: Document) =>
    doc.validation_status === 'pending' ? (
      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-2.5 text-xs"
          onClick={() => handleApprove(doc)}
          title="Aprovar documento"
        >
          <Check className="w-3.5 h-3.5 mr-1" /> Aprovar
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 h-8 px-2.5 text-xs"
          onClick={() => {
            setRejectDoc(doc)
            setNotes('')
          }}
          title="Rejeitar documento"
        >
          <X className="w-3.5 h-3.5 mr-1" /> Rejeitar
        </Button>
      </div>
    ) : null

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Base Geral de Documentos
            </h1>
            <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
              {docs.length} no total
            </Badge>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Repositório unificado com filtros por empresa, categoria fiscal e status de validação.
          </p>
        </div>

        <DocumentUpload companies={companies} onSuccess={loadData} />
      </div>

      {/* Filter Bar */}
      <Card className="border border-slate-200 shadow-xs bg-white">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Buscar por título ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 bg-slate-50/70 border-slate-200 text-sm"
              />
            </div>

            {/* Company Select */}
            <Select
              value={filters.company}
              onValueChange={(v) => setFilters((f) => ({ ...f, company: v }))}
            >
              <SelectTrigger className="w-full md:w-48 h-10 bg-slate-50/70 border-slate-200 text-xs">
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as empresas ({companies.length})</SelectItem>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Select */}
            <Select
              value={filters.category}
              onValueChange={(v) => setFilters((f) => ({ ...f, category: v }))}
            >
              <SelectTrigger className="w-full md:w-44 h-10 bg-slate-50/70 border-slate-200 text-xs">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="tax">Impostos & Guias</SelectItem>
                <SelectItem value="payroll">RH & Holerites</SelectItem>
                <SelectItem value="accounting">Contábeis</SelectItem>
                <SelectItem value="legal">Legal & Contratos</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Select */}
            <Select
              value={filters.status}
              onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            >
              <SelectTrigger className="w-full md:w-48 h-10 bg-slate-50/70 border-slate-200 text-xs">
                <SelectValue placeholder="Status de validação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending_confirmation">Aguardando Confirmação</SelectItem>
                <SelectItem value="pending">Em Validação</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
              </SelectContent>
            </Select>

            {(search ||
              filters.company !== 'all' ||
              filters.category !== 'all' ||
              filters.status !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-10 text-xs text-slate-500 hover:text-slate-900 gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <DocumentTable documents={filtered} showCompany actions={actions} />

      {/* Rejection Modal */}
      <Dialog open={!!rejectDoc} onOpenChange={(open) => !open && setRejectDoc(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl p-0 overflow-hidden">
          <div className="bg-red-950 text-white p-6 border-b border-red-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white">
                  Rejeitar Documento
                </DialogTitle>
                <DialogDescription className="text-xs text-red-200 mt-0.5">
                  Esta mensagem ficará visível para o cliente orientando o reenvio.
                </DialogDescription>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <p className="font-bold text-slate-900 text-sm">{rejectDoc?.title}</p>
            <Textarea
              placeholder="Motivo da rejeição..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="text-sm bg-slate-50 border-slate-200"
            />
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => setRejectDoc(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Confirmar Rejeição
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
