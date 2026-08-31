import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
  FileType,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentUploadProps {
  companies: Company[]
  onSuccess: () => void
  defaultCategory?: string
  buttonLabel?: string
  variant?: 'primary' | 'outline'
}

// Quick keyword guesser on the client side for immediate visual delight before server-side AI
const guessCategory = (name: string): { label: string; key: string } => {
  const n = name.toLowerCase()
  if (
    n.includes('das') ||
    n.includes('darf') ||
    n.includes('imposto') ||
    n.includes('icms') ||
    n.includes('iss') ||
    n.includes('irpj') ||
    n.includes('guia')
  ) {
    return { label: 'Impostos & Guias Fiscais', key: 'tax' }
  }
  if (
    n.includes('holerite') ||
    n.includes('folha') ||
    n.includes('fgts') ||
    n.includes('inss') ||
    n.includes('salario') ||
    n.includes('recibo') ||
    n.includes('rh')
  ) {
    return { label: 'RH & Folha de Pagamento', key: 'payroll' }
  }
  if (
    n.includes('balanc') ||
    n.includes('dre') ||
    n.includes('razao') ||
    n.includes('diario') ||
    n.includes('contabil') ||
    n.includes('extrato')
  ) {
    return { label: 'Documentos Contábeis', key: 'accounting' }
  }
  if (
    n.includes('contrato') ||
    n.includes('social') ||
    n.includes('alteracao') ||
    n.includes('procuracao') ||
    n.includes('alvara') ||
    n.includes('cnpj')
  ) {
    return { label: 'Legal & Contratos', key: 'legal' }
  }
  return { label: 'Triagem Inteligente (IA)', key: 'pending' }
}

export function DocumentUpload({
  companies,
  onSuccess,
  buttonLabel = 'Enviar Documento',
  variant = 'primary',
}: DocumentUploadProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Auto-select company if only one available
  const effectiveCompanies = companies.length > 0 ? companies : []

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && effectiveCompanies.length === 1 && !companyId) {
      setCompanyId(effectiveCompanies[0].id)
    }
    if (!isOpen) {
      resetForm()
    }
  }

  const resetForm = () => {
    setTitle('')
    setFile(null)
    setIsDragging(false)
    setLoading(false)
  }

  const handleFileSelect = (selectedFile: File) => {
    // Validate file size (max 20MB)
    if (selectedFile.size > 20 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O arquivo não pode exceder 20MB.',
        variant: 'destructive',
      })
      return
    }

    setFile(selectedFile)
    if (!title) {
      // Auto-populate title from clean filename
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1))
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetCompanyId =
      companyId || (effectiveCompanies.length === 1 ? effectiveCompanies[0].id : '')

    if (!targetCompanyId) {
      toast({
        title: 'Empresa obrigatória',
        description: 'Selecione a empresa associada ao documento.',
        variant: 'destructive',
      })
      return
    }

    if (!title.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Informe uma descrição ou título para o documento.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const fd = new FormData()
    fd.append('title', title.trim())
    fd.append('company', targetCompanyId)
    if (file) {
      fd.append('file', file)
    }

    try {
      await createDocument(fd)
      toast({
        title: 'Documento enviado com sucesso!',
        description: 'A IA realizou a pré-classificação e o documento já está na esteira contábil.',
      })
      setOpen(false)
      resetForm()
      onSuccess()
    } catch (err: any) {
      toast({
        title: 'Erro ao processar envio',
        description: err?.message || 'Falha na comunicação com o servidor.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const estimatedCategory = guessCategory(title || (file ? file.name : ''))

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {variant === 'primary' ? (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm gap-2 transition-all">
            <UploadCloud className="w-4 h-4" />
            <span>{buttonLabel}</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{buttonLabel}</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-white rounded-2xl shadow-2xl p-0 overflow-hidden">
        {/* Header styling */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                Enviar Documento Contábil
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-300 mt-0.5">
                O arquivo será analisado e categorizado pela inteligência artificial da Golden.
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpload} className="p-6 space-y-5">
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
              >
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Selecione a empresa associada" />
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
                Nenhuma empresa ativa vinculada à sua conta. Entre em contato com a contabilidade.
              </p>
            )}
          </div>

          {/* Drag & Drop File Zone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Arquivo Digital (PDF, PNG, JPG, XML)
            </Label>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0])
                }
              }}
              accept=".pdf,.png,.jpg,.jpeg,.xml"
            />

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2',
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]'
                    : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/20',
                )}
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Clique para selecionar ou arraste o arquivo aqui
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Formatos aceitos: PDF, Imagens (PNG/JPG) e XML &bull; Até 20MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB &bull; Pronto para upload
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-500"
                  onClick={() => {
                    setFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="doc-title"
              className="text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Identificação / Título do Documento
            </Label>
            <Input
              id="doc-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: DAS Simples Nacional - Janeiro 2026"
              className="h-11 bg-slate-50 border-slate-200 text-sm"
            />
          </div>

          {/* AI Pre-classification live banner */}
          {title.length > 2 && (
            <div className="p-3 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 flex items-center justify-between text-xs animate-fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>
                  Pré-classificação estimada:{' '}
                  <strong className="text-emerald-300">{estimatedCategory.label}</strong>
                </span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                IA Ativa
              </Badge>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando & Classificando...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Confirmar e Enviar</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
