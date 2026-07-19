import { useEffect, useState } from 'react'
import {
  getDocuments,
  getCompanies,
  getFileUrl,
  updateDocumentStatus,
  type Document,
  type Company,
} from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, CheckCircle2 } from 'lucide-react'
import { DocumentUpload } from '@/components/DocumentUpload'
import { useAuth } from '@/hooks/use-auth'

const CAT_LABELS = {
  tax: 'Impostos',
  payroll: 'RH & Holerites',
  accounting: 'Contábil',
  legal: 'Legal',
}

export default function Documents() {
  const { isAccountant, user } = useAuth()
  const [docs, setDocs] = useState<Document[]>([])
  const [companies, setCompanies] = useState<Company[]>([])

  const loadData = async () => {
    const d = await getDocuments()
    setDocs(d)
    if (isAccountant) {
      const c = await getCompanies()
      setCompanies(c)
    } else {
      // If client, we still need their company to allow upload.
      // Usually, backend returns only their companies.
      const c = await getCompanies()
      setCompanies(c)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('documents', () => {
    loadData()
  })

  const handleMarkPaid = async (doc: Document) => {
    await updateDocumentStatus(doc.id, 'paid')
    loadData()
  }

  const renderList = (category: string) => {
    const filtered = category === 'all' ? docs : docs.filter((d) => d.category === category)

    if (filtered.length === 0)
      return <div className="text-center py-12 text-slate-400">Nenhum documento encontrado.</div>

    return (
      <div className="space-y-3 mt-4">
        {filtered.map((doc) => (
          <Card key={doc.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{doc.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">
                      {doc.expand?.company?.name || 'Empresa não encontrada'}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-slate-50">
                      {CAT_LABELS[doc.category as keyof typeof CAT_LABELS] || doc.category}
                    </Badge>
                    {doc.payment_status === 'pending' && (
                      <Badge variant="destructive" className="text-[10px]">
                        Pendente
                      </Badge>
                    )}
                    {doc.payment_status === 'paid' && (
                      <Badge className="bg-emerald-500 text-[10px]">Pago</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                {doc.file && (
                  <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                    <a href={getFileUrl(doc, doc.file)} target="_blank" rel="noreferrer">
                      <Download className="w-4 h-4 mr-2" /> Baixar
                    </a>
                  </Button>
                )}
                {doc.payment_status === 'pending' && !isAccountant && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
                    onClick={() => handleMarkPaid(doc)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Marcar Pago
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Central de Documentos
          </h1>
          <p className="text-slate-500 mt-1">
            Gerencie e acesse todos os arquivos de forma categorizada.
          </p>
        </div>
        {(isAccountant || companies.length > 0) && (
          <DocumentUpload companies={companies} onSuccess={loadData} />
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto bg-transparent h-auto p-0 border-b rounded-none mb-6">
          <TabsTrigger
            value="all"
            className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none pb-2"
          >
            Todos
          </TabsTrigger>
          <TabsTrigger
            value="tax"
            className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none pb-2"
          >
            Impostos
          </TabsTrigger>
          <TabsTrigger
            value="payroll"
            className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none pb-2"
          >
            RH & Holerites
          </TabsTrigger>
          <TabsTrigger
            value="accounting"
            className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none pb-2"
          >
            Contábil
          </TabsTrigger>
          <TabsTrigger
            value="legal"
            className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none pb-2"
          >
            Legal
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderList('all')}</TabsContent>
        <TabsContent value="tax">{renderList('tax')}</TabsContent>
        <TabsContent value="payroll">{renderList('payroll')}</TabsContent>
        <TabsContent value="accounting">{renderList('accounting')}</TabsContent>
        <TabsContent value="legal">{renderList('legal')}</TabsContent>
      </Tabs>
    </div>
  )
}
