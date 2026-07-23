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
import { Download, ArrowUpDown } from 'lucide-react'
import { ValidationBadge } from '@/components/ValidationBadge'
import { getFileUrl, type Document } from '@/services/api'
import { format } from 'date-fns'

const CAT_LABELS: Record<string, string> = {
  tax: 'Impostos',
  payroll: 'RH',
  accounting: 'Contábil',
  legal: 'Legal',
}

type SortField = 'created' | 'title' | 'validation_status' | 'category'

interface DocumentTableProps {
  documents: Document[]
  showCompany?: boolean
  actions?: (doc: Document) => React.ReactNode
}

export function DocumentTable({ documents, showCompany, actions }: DocumentTableProps) {
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
    <TableHead className="cursor-pointer select-none" onClick={() => handleSort(field)}>
      <span className="flex items-center gap-1">
        {label} <ArrowUpDown className="w-3 h-3" />
      </span>
    </TableHead>
  )

  if (sorted.length === 0) {
    return <div className="text-center py-12 text-slate-400">Nenhum documento encontrado.</div>
  }

  return (
    <div className="rounded-lg border bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            {renderSortHeader('title', 'Título')}
            {showCompany && <TableHead>Empresa</TableHead>}
            {renderSortHeader('category', 'Categoria')}
            {renderSortHeader('validation_status', 'Status')}
            <TableHead>Pagamento</TableHead>
            {renderSortHeader('created', 'Data')}
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((doc) => (
            <TableRow key={doc.id} className="hover:bg-slate-50">
              <TableCell className="font-medium">
                {doc.title}
                {doc.validation_status === 'rejected' && doc.validation_notes && (
                  <p className="text-xs text-red-600 mt-1">{doc.validation_notes}</p>
                )}
              </TableCell>
              {showCompany && (
                <TableCell className="text-slate-600">{doc.expand?.company?.name || '-'}</TableCell>
              )}
              <TableCell>
                <Badge variant="outline" className="text-[10px]">
                  {CAT_LABELS[doc.category] || doc.category}
                </Badge>
              </TableCell>
              <TableCell>
                <ValidationBadge status={doc.validation_status || 'pending'} />
              </TableCell>
              <TableCell>
                {doc.payment_status === 'pending' && (
                  <Badge variant="destructive" className="text-[10px]">
                    Pendente
                  </Badge>
                )}
                {doc.payment_status === 'paid' && (
                  <Badge className="bg-emerald-500 text-[10px]">Pago</Badge>
                )}
                {doc.payment_status === 'n/a' && <span className="text-xs text-slate-400">-</span>}
              </TableCell>
              <TableCell className="text-xs text-slate-500">
                {format(new Date(doc.created), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {doc.file && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={getFileUrl(doc, doc.file)} target="_blank" rel="noreferrer">
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {actions?.(doc)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
