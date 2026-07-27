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
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ClipboardCheck, Check, Edit3 } from 'lucide-react'
import { format } from 'date-fns'

const CAT_LABELS: Record<string, string> = {
  tax: 'Impostos',
  payroll: 'RH',
  accounting: 'Contábil',
  legal: 'Legal',
}

export default function AdminConfirmation() {
  const [docs, setDocs] = useState<Document[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const loadData = async () => {
    const d = await getConfirmationDocuments()
    setDocs(d)
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('documents', () => {
    loadData()
  })

  const handleConfirm = async (doc: Document) => {
    await confirmDocument(doc.id, doc.suggested_category || 'legal')
    loadData()
  }

  const handleChangeCategory = async (doc: Document, category: string) => {
    await confirmDocument(doc.id, category)
    setEditingId(null)
    loadData()
  }

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <ClipboardCheck className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Documentos para Confirmação
          </h1>
          <p className="text-slate-500">
            Confirme a categoria sugerida pela IA ou altere conforme necessário.
          </p>
        </div>
      </div>

      {docs.length === 0 ? (
        <Card className="border-0 shadow-sm mt-6">
          <CardContent className="p-8 text-center text-slate-400">
            Nenhum documento aguardando confirmação.
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border bg-white overflow-x-auto mt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Título</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Categoria Sugerida (IA)</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell className="text-slate-600">
                    {doc.expand?.company?.name || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-[10px]">
                      {CAT_LABELS[doc.suggested_category || 'legal'] || 'Legal'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {format(new Date(doc.created), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === doc.id ? (
                      <Select onValueChange={(v) => handleChangeCategory(doc, v)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Escolha a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tax">Impostos</SelectItem>
                          <SelectItem value="payroll">RH</SelectItem>
                          <SelectItem value="accounting">Contábil</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleConfirm(doc)}
                        >
                          <Check className="w-4 h-4 mr-1" /> Confirmar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(doc.id)}>
                          <Edit3 className="w-4 h-4 mr-1" /> Alterar
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
