import { useEffect, useState } from 'react'
import { getDocuments, getCompanies, type Document, type Company } from '@/services/api'
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
import { Card, CardContent } from '@/components/ui/card'

const PAGE_INFO: Record<string, { title: string; desc: string }> = {
  tax: { title: 'Guias Fiscais', desc: 'Guias de impostos e documentos fiscais.' },
  payroll: { title: 'Holerites', desc: 'Folha de pagamento e documentos de RH.' },
  accounting: { title: 'Contábeis', desc: 'Documentos contábeis e balanços.' },
  legal: { title: 'Legais', desc: 'Documentos legais e contratos.' },
}

export default function ClientDocuments({ category }: { category?: Document['category'] }) {
  const [docs, setDocs] = useState<Document[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [statusFilter, setStatusFilter] = useState('all')

  const loadData = async () => {
    const d = await getDocuments(category ? { category } : undefined)
    setDocs(d)
    const c = await getCompanies()
    setCompanies(c)
  }

  useEffect(() => {
    loadData()
  }, [category])
  useRealtime('documents', () => {
    loadData()
  })

  const filtered =
    statusFilter === 'all' ? docs : docs.filter((d) => d.validation_status === statusFilter)

  const info = category
    ? PAGE_INFO[category]
    : { title: 'Documentos', desc: 'Todos os seus documentos.' }

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{info.title}</h1>
          <p className="text-slate-500 mt-1">{info.desc}</p>
        </div>
        <DocumentUpload companies={companies} onSuccess={loadData} />
      </div>

      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-slate-500">Filtrar por status:</span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="approved">Aprovados</SelectItem>
            <SelectItem value="rejected">Rejeitados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center text-slate-400">
            Nenhum documento encontrado.
          </CardContent>
        </Card>
      ) : (
        <DocumentTable documents={filtered} />
      )}
    </div>
  )
}
