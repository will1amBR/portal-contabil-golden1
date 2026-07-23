import { useEffect, useState } from 'react'
import { getPendingDocuments, approveDocument, rejectDocument, type Document } from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import { DocumentTable } from '@/components/DocumentTable'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Check, X } from 'lucide-react'

export default function AdminPending() {
  const [docs, setDocs] = useState<Document[]>([])
  const [rejectDoc, setRejectDoc] = useState<Document | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    const d = await getPendingDocuments()
    setDocs(d)
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('documents', () => {
    loadData()
  })

  const handleApprove = async (doc: Document) => {
    await approveDocument(doc.id)
    loadData()
  }

  const handleReject = async () => {
    if (!rejectDoc) return
    setLoading(true)
    try {
      await rejectDocument(rejectDoc.id, notes)
      setRejectDoc(null)
      setNotes('')
      loadData()
    } finally {
      setLoading(false)
    }
  }

  const actions = (doc: Document) => (
    <>
      <Button
        size="sm"
        className="bg-emerald-600 hover:bg-emerald-700"
        onClick={() => handleApprove(doc)}
      >
        <Check className="w-4 h-4 mr-1" /> Aprovar
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => {
          setRejectDoc(doc)
          setNotes('')
        }}
      >
        <X className="w-4 h-4 mr-1" /> Rejeitar
      </Button>
    </>
  )

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
        Documentos Pendentes
      </h1>
      <p className="text-slate-500 mb-6">Valide documentos enviados pelos clientes.</p>

      {docs.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center text-slate-400">
            Nenhum documento pendente. Tudo em dia!
          </CardContent>
        </Card>
      ) : (
        <DocumentTable documents={docs} showCompany actions={actions} />
      )}

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
            <Button variant="destructive" onClick={handleReject} disabled={loading}>
              {loading ? 'Rejeitando...' : 'Confirmar Rejeição'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
