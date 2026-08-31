import { useState, useMemo } from 'react'
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
import {
  Download,
  ArrowUpDown,
  FileText,
  Building2,
  Calendar,
  AlertCircle,
  Receipt,
  Wallet,
  Calculator,
  Scale,
  Sparkles,
} from 'lucide-react'
import { ValidationBadge } from '@/components/ValidationBadge'
import { getFileUrl, type Document } from '@/services/api'
import { format, parseISO } from 'date-fns'

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

type SortField = 'created' | 'title' | 'validation_status' | 'category'

interface DocumentTableProps {
  documents: Document[]
  showCompany?: boolean
  actions?: (doc: Document) => React.ReactNode
}

export function DocumentTable({ documents, showCompany = false, actions }: DocumentTableProps) {
  const [sortField, setSortField] = useState<SortField>('created')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const sorted = useMemo(() => {
    return [...documents].sort((a, b) => {
      let cmp = 0
      if (sortField === 'created') {
        cmp = new Date(a.created).getTime() - new Date(b.created).getTime()
      } else {
        cmp = String(a[sortField] || '').localeCompare(String(b[sortField] || ''))
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [documents, sortField, sortDir])

  const handleSort = (field: SortField) => {
    if (field === sortField) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const renderSortHeader = (field: SortField, label: string) => (
    <TableHead
      className="cursor-pointer select-none hover:text-slate-900 transition-colors py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1.5">
        {label} <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
      </span>
    </TableHead>
  )

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">Nenhum documento encontrado</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Não há registros correspondentes aos filtros aplicados neste momento.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-200">
              {renderSortHeader('title', 'Documento')}
              {showCompany && (
                <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Empresa
                </TableHead>
              )}
              {renderSortHeader('category', 'Categoria')}
              {renderSortHeader('validation_status', 'Status')}
              <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pagamento
              </TableHead>
              {renderSortHeader('created', 'Data')}
              <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {sorted.map((doc) => {
              const cat = CAT_CONFIG[doc.category] || {
                label: doc.category,
                icon: FileText,
                color: 'text-slate-700',
                bg: 'bg-slate-50 border-slate-200',
              }
              const Icon = cat.icon

              return (
                <TableRow key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Document title & notes */}
                  <TableCell className="py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">{doc.title}</p>
                        {doc.validation_status === 'rejected' && doc.validation_notes && (
                          <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1 bg-red-50 p-1.5 rounded border border-red-100">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Motivo: {doc.validation_notes}</span>
                          </div>
                        )}
                        {doc.validation_status === 'approved' && doc.validated_at && (
                          <p className="text-[11px] text-emerald-600 mt-0.5">
                            Validado em {format(parseISO(doc.validated_at), 'dd/MM/yyyy')}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Company */}
                  {showCompany && (
                    <TableCell className="text-slate-700 text-xs py-4">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">
                          {doc.expand?.company?.name || 'Tech Solutions'}
                        </span>
                      </div>
                    </TableCell>
                  )}

                  {/* Category */}
                  <TableCell className="py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${cat.bg} ${cat.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </span>
                  </TableCell>

                  {/* Validation status */}
                  <TableCell className="py-4">
                    <ValidationBadge status={doc.validation_status || 'pending'} />
                  </TableCell>

                  {/* Payment status */}
                  <TableCell className="py-4">
                    {doc.payment_status === 'pending' && (
                      <Badge className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-semibold hover:bg-amber-100">
                        Pendente
                      </Badge>
                    )}
                    {doc.payment_status === 'paid' && (
                      <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-semibold hover:bg-emerald-100">
                        Pago
                      </Badge>
                    )}
                    {doc.payment_status === 'n/a' && (
                      <span className="text-xs text-slate-400 font-mono">-</span>
                    )}
                  </TableCell>

                  {/* Created date */}
                  <TableCell className="text-xs text-slate-500 py-4 whitespace-nowrap">
                    {format(parseISO(doc.created), 'dd/MM/yyyy HH:mm')}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end gap-2">
                      {doc.file && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-8 px-2.5 text-xs text-slate-700 hover:text-emerald-700 border-slate-200"
                        >
                          <a href={getFileUrl(doc, doc.file)} target="_blank" rel="noreferrer">
                            <Download className="w-3.5 h-3.5 mr-1.5" /> Baixar
                          </a>
                        </Button>
                      )}
                      {actions?.(doc)}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
