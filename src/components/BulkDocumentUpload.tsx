import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createDocument, type Company } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  X,
  FileUp,
  AlertCircle,
  Building2,
  Loader2,
  Files,
  Receipt,
  Wallet,
  Calculator,
  Scale,
  Trash2,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BulkDocumentItem {
  id: string
  file: File
  title: string
  suggestedCategory: 'tax' | 'payroll' | 'accounting' | 'legal'
  categoryLabel: string
  status: 'idle' | 'uploading' | 'success' | 'error'
  errorMessage?: string
}

interface BulkDocumentUploadProps {
  companies: Company[]
  onSuccess: () => void
  buttonLabel?: string
  variant?: 'primary' | 'outline'
}

export const CATEGORY_INFO: Record<
  string,
  { label: string; icon: any; color: string; bg: string; badgeBg: string }
> = {
  tax: {
    label: 'Impostos & Guias Fiscais',
    icon: Receipt,
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  payroll: {
    label: 'RH & Folha de Pagamento',
    icon: Wallet,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  accounting: {
    label: 'Documentos Contábeis',
    icon: Calculator,
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  legal: {
    label: 'Legal & Contratos',
    icon: Scale,
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
  },
}

export const guessAiCategory = (
  name: string,
): { key: 'tax' | 'payroll' | 'accounting' | 'legal'; label: string } => {
  const n = name.toLowerCase()
  if (
    n.includes('das') ||
    n.includes('darf') ||
    n.includes('imposto') ||
    n.includes('icms') ||
    n.includes('iss') ||
    n.includes('irpj') ||
    n.includes('csll') ||
    n.includes('guia') ||
    n.includes('tribut') ||
    n.includes('simples') ||
    n.includes('pis') ||
    n.includes('cofins')
  ) {
    return { key: 'tax', label: 'Impostos & Guias Fiscais' }
  }
  if (
    n.includes('holerite') ||
    n.includes('folha') ||
    n.includes('fgts') ||
    n.includes('inss') ||
    n.includes('salario') ||
    n.includes('recibo') ||
    n.includes('rh') ||
    n.includes('ferias') ||
    n.includes('13') ||
    n.includes('rescis') ||
    n.includes('admiss')
  ) {
    return { key: 'payroll', label: 'RH & Folha de Pagamento' }
  }
  if (
    n.includes('balanc') ||
    n.includes('dre') ||
    n.includes('razao') ||
    n.includes('diario') ||
    n.includes('contabil') ||
    n.includes('extrato') ||
    n.includes('concilia') ||
    n.includes('faturamento') ||
    n.includes('balancete')
  ) {
    return { key: 'accounting', label: 'Documentos Contábeis' }
  }
  if (
    n.includes('contrato') ||
    n.includes('social') ||
    n.includes('alteracao') ||
    n.includes('procuracao') ||
    n.includes('alvara') ||
    n.includes('cnpj') ||
    n.includes('estatuto') ||
    n.includes('acordo') ||
    n.includes('termo')
  ) {
    return { key: 'legal', label: 'Legal & Contratos' }
  }
  return { key: 'tax', label: 'Impostos & Guias Fiscais' }
}

export function BulkDocumentUpload({
  companies,
  onSuccess,
  buttonLabel = 'Upload em Lote (IA)',
  variant = 'primary',
}: BulkDocumentUploadProps) {
  const [open, setOpen] = useState(false)
  const [companyId, setCompanyId] = useState('')
  const [items, setItems] = useState<BulkDocumentItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingAll, setUploadingAll] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const effectiveCompanies = companies.length > 0 ? companies : []

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && effectiveCompanies.length === 1 && !companyId) {
      setCompanyId(effectiveCompanies[0].id)
    }
    if (!isOpen) {
      resetState()
    }
  }

  const resetState = () => {
    setItems([])
    setIsDragging(false)
    setUploadingAll(false)
    setOverallProgress(0)
  }

  const addFiles = (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles)
    if (fileArray.length === 0) return

    const newItems: BulkDocumentItem[] = []
    let oversizedCount = 0

    fileArray.forEach((f) => {
      if (f.size > 20 * 1024 * 1024) {
        oversizedCount++
        return
      }

      const cleanName = f.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
      const formattedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
      const aiPrediction = guessAiCategory(f.name)

      newItems.push({
        id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
        file: f,
        title: formattedTitle,
        suggestedCategory: aiPrediction.key,
        categoryLabel: aiPrediction.label,
        status: 'idle',
      })
    })

    if (oversizedCount > 0) {
      toast({
        title: 'Alguns arquivos excedem 20MB',
        description: `${oversizedCount} arquivo(s) foram ignorados por ultrapassar o limite de tamanho.`,
        variant: 'destructive',
      })
    }

    setItems((prev) => [...prev, ...newItems])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const handleUpdateItem = (id: string, updates: Partial<BulkDocumentItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...updates } : it)))
  }

  const handleUploadAll = async () => {
    const targetCompanyId =
      companyId || (effectiveCompanies.length === 1 ? effectiveCompanies[0].id : '')

    if (!targetCompanyId) {
      toast({
        title: 'Selecione a Empresa',
        description: 'É necessário selecionar a empresa destino para vincular os documentos.',
        variant: 'destructive',
      })
      return
    }

    if (items.length === 0) {
      toast({
        title: 'Nenhum documento anexado',
        description: 'Adicione pelo menos um arquivo para iniciar o upload.',
        variant: 'destructive',
      })
      return
    }

    setUploadingAll(true)
    let successfulCount = 0
    let failedCount = 0

    // Process sequentially or in small parallel batches with individual error handling
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.status === 'success') {
        successfulCount++
        continue
      }

      handleUpdateItem(item.id, { status: 'uploading' })

      try {
        const fd = new FormData()
        fd.append('title', item.title.trim() || item.file.name)
        fd.append('company', targetCompanyId)
        fd.append('file', item.file)
        fd.append('category', item.suggestedCategory)
        fd.append('suggested_category', item.suggestedCategory)
        fd.append('original_suggested_category', item.suggestedCategory)
        fd.append('validation_status', 'pending_confirmation')

        await createDocument(fd)

        successfulCount++
        handleUpdateItem(item.id, { status: 'success' })
      } catch (err: any) {
        failedCount++
        handleUpdateItem(item.id, {
          status: 'error',
          errorMessage: err?.message || 'Falha ao enviar arquivo',
        })
      }

      setOverallProgress(Math.round(((i + 1) / items.length) * 100))
    }

    setUploadingAll(false)

    if (failedCount === 0) {
      toast({
        title: 'Upload em lote concluído com sucesso!',
        description: `${successfulCount} documento(s) pré-categorizados pela IA e enviados para a esteira contábil.`,
      })
      setTimeout(() => {
        setOpen(false)
        resetState()
        onSuccess()
      }, 1200)
    } else {
      toast({
        title: 'Upload finalizado com pendências',
        description: `${successfulCount} enviado(s) com sucesso, ${failedCount} com falha. Você pode tentar reenviar os que falharam.`,
        variant: 'destructive',
      })
      onSuccess()
    }
  }

  const successCount = items.filter((i) => i.status === 'success').length
  const isAllDone = items.length > 0 && successCount === items.length

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {variant === 'primary' ? (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm gap-2 transition-all">
            <Files className="w-4 h-4" />
            <span>{buttonLabel}</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-2 font-medium"
          >
            <Files className="w-4 h-4" />
            <span>{buttonLabel}</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl p-0 overflow-hidden">
        {/* Header styling */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Files className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl font-bold text-white">
                    Upload em Lote com IA
                  </DialogTitle>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                    Multi-Arquivos
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-slate-300 mt-0.5">
                  Arraste dezenas de documentos fiscais de uma só vez. A IA pré-categoriza cada um
                  automaticamente.
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Company Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Empresa Destino
            </Label>
            {effectiveCompanies.length > 0 ? (
              <Select
                value={
                  companyId || (effectiveCompanies.length === 1 ? effectiveCompanies[0].id : '')
                }
                onValueChange={setCompanyId}
                disabled={uploadingAll}
              >
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Selecione a empresa associada aos arquivos" />
                </SelectTrigger>
                <SelectContent>
                  {effectiveCompanies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-slate-900">{c.name}</span>
                        <span className="text-xs text-slate-400 font-mono">({c.cnpj})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                Nenhuma empresa ativa vinculada à sua conta.
              </p>
            )}
          </div>

          {/* Multiple File Drop Zone */}
          <div className="space-y-1.5">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  addFiles(e.target.files)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }
              }}
              accept=".pdf,.png,.jpg,.jpeg,.xml,.csv,.xlsx,.docx"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !uploadingAll && fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2',
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/20',
                uploadingAll && 'opacity-60 pointer-events-none',
              )}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Clique para selecionar múltiplos arquivos ou arraste-os aqui
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Envie de uma vez: Guias DAS, DARF, Holerites, DREs, Extratos, Contratos (PDF, XML,
                  Imagens) &bull; Até 20MB cada
                </p>
              </div>
            </div>
          </div>

          {/* Upload Progress Bar if processing */}
          {uploadingAll && (
            <div className="space-y-2 p-4 rounded-xl bg-slate-900 text-white animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  Processando esteira contábil e pré-classificação...
                </span>
                <span className="font-mono text-emerald-400 font-bold">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2 bg-slate-800" />
            </div>
          )}

          {/* Files List with AI Suggestions & Individual Control */}
          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Documentos na Fila ({items.length})
                  </Label>
                  <Badge
                    variant="outline"
                    className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                  >
                    <Sparkles className="w-3 h-3 mr-1 text-indigo-500" /> IA Classificou
                  </Badge>
                </div>
                {!uploadingAll && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setItems([])}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-7"
                  >
                    Limpar Todos
                  </Button>
                )}
              </div>

              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const catCfg = CATEGORY_INFO[item.suggestedCategory] || CATEGORY_INFO.tax
                  const Icon = catCfg.icon

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white',
                        item.status === 'success' && 'border-emerald-400 bg-emerald-50/30',
                        item.status === 'error' && 'border-red-300 bg-red-50/30',
                        item.status === 'uploading' && 'border-indigo-300 bg-indigo-50/30',
                        item.status === 'idle' && 'border-slate-200 hover:border-slate-300',
                      )}
                    >
                      {/* Left info: index, name, size, input title */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5',
                            item.status === 'success'
                              ? 'bg-emerald-600 text-white'
                              : item.status === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-100 text-slate-600',
                          )}
                        >
                          {item.status === 'success' ? (
                            <Check className="w-4 h-4" />
                          ) : item.status === 'error' ? (
                            <AlertCircle className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <Input
                            value={item.title}
                            onChange={(e) => {
                              const newTitle = e.target.value
                              const ai = guessAiCategory(newTitle || item.file.name)
                              handleUpdateItem(item.id, {
                                title: newTitle,
                                suggestedCategory: ai.key,
                                categoryLabel: ai.label,
                              })
                            }}
                            disabled={uploadingAll || item.status === 'success'}
                            className="h-8 text-xs font-semibold bg-slate-50/80 border-slate-200"
                            placeholder="Título do documento..."
                          />
                          <p className="text-[11px] text-slate-500 truncate">
                            Arquivo:{' '}
                            <span className="font-mono text-slate-700">{item.file.name}</span>{' '}
                            &bull; {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          {item.errorMessage && (
                            <p className="text-[11px] text-red-600 font-medium">
                              {item.errorMessage}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right info: IA suggestion badge / picker and status */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <Select
                          value={item.suggestedCategory}
                          onValueChange={(val: any) =>
                            handleUpdateItem(item.id, {
                              suggestedCategory: val,
                              categoryLabel: CATEGORY_INFO[val]?.label || val,
                            })
                          }
                          disabled={uploadingAll || item.status === 'success'}
                        >
                          <SelectTrigger className="h-8 text-xs w-44 bg-slate-50 border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tax">
                              <span className="flex items-center gap-1.5 text-xs">
                                <Receipt className="w-3.5 h-3.5 text-blue-600" /> Impostos & Guias
                              </span>
                            </SelectItem>
                            <SelectItem value="payroll">
                              <span className="flex items-center gap-1.5 text-xs">
                                <Wallet className="w-3.5 h-3.5 text-emerald-600" /> RH & Holerites
                              </span>
                            </SelectItem>
                            <SelectItem value="accounting">
                              <span className="flex items-center gap-1.5 text-xs">
                                <Calculator className="w-3.5 h-3.5 text-purple-600" /> Contábeis
                              </span>
                            </SelectItem>
                            <SelectItem value="legal">
                              <span className="flex items-center gap-1.5 text-xs">
                                <Scale className="w-3.5 h-3.5 text-amber-600" /> Legal & Contratos
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {item.status === 'uploading' && (
                          <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                        )}

                        {item.status === 'success' && (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                            Enviado
                          </Badge>
                        )}

                        {!uploadingAll && item.status !== 'success' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-8 w-8 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Workflow explanation note */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Esteira de Confirmação:</strong> Ao confirmar o envio em lote, todos os
              documentos entrarão na esteira contábil como{' '}
              <em>"Aguardando confirmação da contabilidade"</em>. O contador Paulinho poderá validar
              as sugestões em lote ou ajustar individualmente.
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-500">
            {items.length > 0 && (
              <span>
                Total: <strong>{items.length}</strong> documento(s) selecionado(s)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={uploadingAll}
            >
              {isAllDone ? 'Fechar' : 'Cancelar'}
            </Button>
            <Button
              type="button"
              onClick={handleUploadAll}
              disabled={items.length === 0 || uploadingAll || isAllDone}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-sm"
            >
              {uploadingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando Lote ({overallProgress}%)...</span>
                </>
              ) : isAllDone ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Todos Enviados!</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Confirmar e Enviar Lote ({items.length})</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
