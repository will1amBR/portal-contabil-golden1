import { useEffect, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Check, X } from 'lucide-react'

export default function AdminDocuments() {
  const [docs, setDocs] = useState<Document[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [rejectDoc, setRejectDoc] = useState<Document | null>(null)
  const [notes, setNotes] = useState('')
  const [filters, setFilters] = useState({ company: 'all', category: 'all', status: 'all' })

  const loadData = async () => {
    const d = await getDocuments()
    setDocs(d)
    const c = await getCompanies()
    setCompanies(c)
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('documents', () => {
    loadData()
  })

  const filtered = docs.filter((d) => {
    if (filters.company !== 'all' && d.company !== filters.company) return false
    if (filters.category !== 'all' && d.category !== filters.category) return false
    if (filters.status !== 'all' && d.validation_status !== filters.status) return false
    return true
  })

  const handleApprove = async (doc: Document) => {
    await approveDocument(doc.id)
    loadData()
  }

  const handleReject = async () => {
    if (!rejectDoc) return
    await rejectDocument(rejectDoc.id, notes)
    setRejectDoc(null)
    setNotes('')
    loadData()
  }

  const actions = (doc: Document) =>
    doc.validation_status === 'pending' ? (
      <>
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => handleApprove(doc)}
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            setRejectDoc(doc)
            setNotes('')
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </>
    ) : null

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Todos os Documentos</h1>
      <p className="text-slate-500 mb-6">Gerencie todos os documentos de todas as empresas.</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          value={filters.company}
          onValueChange={(v) => setFilters((f) => ({ ...f, company: v }))}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Empresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas empresas</SelectItem>
            {companies.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.category}
          onValueChange={(v) => setFilters((f) => ({ ...f, category: v }))}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            <SelectItem value="tax">Impostos</SelectItem>
            <SelectItem value="payroll">RH</SelectItem>
            <SelectItem value="accounting">Contábil</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="pending_confirmation">Aguardando Confirmação</SelectItem>
            <SelectItem value="pending">Em Validação</SelectItem>
            <SelectItem value="approved">Aprovados</SelectItem>
            <SelectItem value="rejected">Rejeitados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DocumentTable documents={filtered} showCompany actions={actions} />

      <Dialog open={!!rejectDoc} onOpenChange={(open) => !open && setRejectDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Documento</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 mb-2">{rejectDoc?.title}</p>
          <Textarea
            placeholder="Motivo da rejeição..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setRejectDoc(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirmar Rejeição
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
