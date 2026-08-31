import { useEffect, useState } from 'react'
import { getPendingDocuments, approveDocument, rejectDocument, type Document } from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import { DocumentTable } from '@/components/DocumentTable'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Check, X, Clock, CheckCircle2, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AdminPending() {
  const [docs, setDocs] = useState<Document[]>([])
  const [rejectDoc, setRejectDoc] = useState<Document | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const { toast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      const d = await getPendingDocuments()
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

  const handleApprove = async (doc: Document) => {
    setActionId(doc.id)
    try {
      await approveDocument(doc.id)
      toast({
        title: 'Documento aprovado!',
        description: `O documento "${doc.title}" foi validado e liberado para o cliente.`,
      })
      await loadData()
    } catch {
      toast({
        title: 'Erro ao aprovar',
        description: 'Não foi possível concluir a validação.',
        variant: 'destructive',
      })
    } finally {
      setActionId(null)
    }
  }

  const handleReject = async () => {
    if (!rejectDoc) return
    if (!notes.trim()) {
      toast({
        title: 'Motivo obrigatório',
        description: 'Informe o motivo da rejeição para orientar o cliente no reenvio.',
        variant: 'destructive',
      })
      return
    }

    setActionId(rejectDoc.id)
    try {
      await rejectDocument(rejectDoc.id, notes.trim())
      toast({
        title: 'Documento rejeitado',
        description: 'O cliente foi notificado com o motivo informado.',
      })
      setRejectDoc(null)
      setNotes('')
      await loadData()
    } catch {
      toast({
        title: 'Erro ao rejeitar',
        description: 'Não foi possível rejeitar o documento.',
        variant: 'destructive',
      })
    } finally {
      setActionId(null)
    }
  }

  const handleApproveAll = async () => {
    if (docs.length === 0) return
    setActionId('all')
    try {
      await Promise.all(docs.map((d) => approveDocument(d.id)))
      toast({
        title: 'Todos os documentos foram aprovados!',
        description: `${docs.length} documentos validados com sucesso.`,
      })
      await loadData()
    } finally {
      setActionId(null)
    }
  }

  const actions = (doc: Document) => {
    const isProcessing = actionId === doc.id || actionId === 'all'
    return (
      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-2.5 text-xs shadow-xs"
          onClick={() => handleApprove(doc)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
          ) : (
            <Check className="w-3.5 h-3.5 mr-1" />
          )}
          Aprovar
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 h-8 px-2.5 text-xs"
          onClick={() => {
            setRejectDoc(doc)
            setNotes('')
          }}
          disabled={isProcessing}
        >
          <X className="w-3.5 h-3.5 mr-1" /> Rejeitar
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Validação de Documentos
              </h1>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-semibold">
                {docs.length} pendentes
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">
              Revise o arquivo e aprove para conformidade fiscal ou solicite correções com
              justificativa.
            </p>
          </div>
        </div>

        {docs.length > 1 && (
          <Button
            onClick={handleApproveAll}
            disabled={!!actionId}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2"
          >
            {actionId === 'all' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>Aprovar Todos ({docs.length})</span>
          </Button>
        )}
      </div>

      {/* Content Table or Empty State */}
      {docs.length === 0 ? (
        <Card className="border border-slate-200 shadow-xs bg-white">
          <CardContent className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Nenhuma pendência na esteira!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Todos os documentos enviados já foram validados e aprovados. O cliente está em
              conformidade total.
            </p>
          </CardContent>
        </Card>
      ) : (
        <DocumentTable documents={docs} showCompany actions={actions} />
      )}

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
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Documento Selecionado
              </span>
              <p className="font-bold text-slate-900 text-sm">{rejectDoc?.title}</p>
              <p className="text-slate-500">
                {rejectDoc?.expand?.company?.name || 'Tech Solutions LTDA'}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="reject-notes"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                Motivo Detalhado da Rejeição
              </Label>
              <Textarea
                id="reject-notes"
                placeholder="Ex: Valor da guia diverge do apurado no Simples Nacional. Favor enviar o DARF com o código de barras legível."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="text-sm bg-slate-50 border-slate-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => setRejectDoc(null)} disabled={!!actionId}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!!actionId || !notes.trim()}
              >
                {actionId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Rejeitando...
                  </>
                ) : (
                  'Confirmar Rejeição'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
