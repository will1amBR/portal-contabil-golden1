import { useEffect, useState, useMemo } from 'react'
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
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Receipt,
  Wallet,
  Calculator,
  Scale,
  FileText,
  Search,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

const PAGE_INFO: Record<string, { title: string; desc: string; icon: any }> = {
  tax: {
    title: 'Guias & Impostos Fiscais',
    desc: 'DAS do Simples Nacional, DARFs, ICMS e comprovantes de tributos.',
    icon: Receipt,
  },
  payroll: {
    title: 'RH & Folha de Pagamento',
    desc: 'Holerites de funcionários, GPS, FGTS e pró-labore.',
    icon: Wallet,
  },
  accounting: {
    title: 'Documentos Contábeis',
    desc: 'Balancetes, DRE, extratos bancários e livros contábeis.',
    icon: Calculator,
  },
  legal: {
    title: 'Legal, Contratos & Alvarás',
    desc: 'Contrato social, procurações, licenças ambientais e certidões.',
    icon: Scale,
  },
}

export default function ClientDocuments({ category }: { category?: Document['category'] }) {
  const [docs, setDocs] = useState<Document[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const d = await getDocuments(category ? { category } : undefined)
      setDocs(d)
      const c = await getCompanies()
      setCompanies(c)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [category])

  useRealtime('documents', () => {
    loadData()
  })

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== 'all' && d.validation_status !== statusFilter) return false
      return true
    })
  }, [docs, search, statusFilter])

  const info = category
    ? PAGE_INFO[category]
    : {
        title: 'Central de Documentos',
        desc: 'Acesse e consulte todos os arquivos enviados pela sua empresa e validados pela contabilidade.',
        icon: FileText,
      }
  const Icon = info.icon

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {info.title}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{info.desc}</p>
          </div>
        </div>

        <DocumentUpload
          companies={companies}
          onSuccess={loadData}
          defaultCategory={category}
          buttonLabel="Enviar Arquivo"
        />
      </div>

      {/* Filters */}
      <Card className="border border-slate-200 shadow-xs bg-white">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Buscar por nome do arquivo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-slate-50/70 border-slate-200 text-sm"
            />
          </div>

          <div className="w-full sm:w-60">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 bg-slate-50/70 border-slate-200 text-xs">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status ({docs.length})</SelectItem>
                <SelectItem value="pending_confirmation">Aguardando Confirmação</SelectItem>
                <SelectItem value="pending">Em Validação</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(search || statusFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
              }}
              className="h-10 text-xs text-slate-500 hover:text-slate-900 gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Limpar
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <DocumentTable documents={filtered} />
    </div>
  )
}
