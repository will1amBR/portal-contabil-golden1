import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  UploadCloud,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  HelpCircle,
  Eye,
  Check,
  FileCheck2,
  FileUp,
  Loader2,
  Receipt,
  Scale,
  Wallet,
  Calculator,
} from 'lucide-react'
import { createDocument, type Company, type TaxRegimeRequirement } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface ClientOnboardingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName?: string
  company?: Company | null
  requirements?: TaxRegimeRequirement[]
  onDocumentUploaded?: () => void
}

export function ClientOnboardingModal({
  open,
  onOpenChange,
  userName = 'William',
  company,
  requirements = [],
  onDocumentUploaded,
}: ClientOnboardingModalProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 4
  const { toast } = useToast()

  // State for Step 3: First Document Upload
  const [docTitle, setDocTitle] = useState('Comprovante DAS Simples Nacional')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedSuccess, setUploadedSuccess] = useState(false)

  const effectiveCompanyName = company?.name || 'Koren Ambiental LTDA'
  const effectiveCnpj = company?.cnpj || '48.912.340/0001-85'
  const effectiveRegime =
    company?.tax_regime === 'simples'
      ? 'Simples Nacional'
      : company?.tax_regime === 'presumido'
        ? 'Lucro Presumido'
        : company?.tax_regime === 'real'
          ? 'Lucro Real'
          : 'Simples Nacional'

  const handleFinish = () => {
    localStorage.setItem(`onboarding_completed_${userName || 'client'}`, 'true')
    onOpenChange(false)
    toast({
      title: 'Boas-vindas concluída!',
      description: 'Você pode revisitar o guia passo a passo a qualquer momento pelo menu.',
    })
  }

  const handleSkipOrClose = () => {
    localStorage.setItem(`onboarding_completed_${userName || 'client'}`, 'true')
    onOpenChange(false)
  }

  const handleUploadFirstDoc = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company?.id) {
      toast({
        title: 'Empresa não encontrada',
        description: 'Vincule uma empresa antes de fazer o envio.',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('title', docTitle.trim() || 'Primeiro Documento - Koren Ambiental')
      fd.append('company', company.id)
      if (selectedFile) {
        fd.append('file', selectedFile)
      }

      await createDocument(fd)
      setUploadedSuccess(true)
      toast({
        title: 'Primeiro documento enviado com sucesso!',
        description: 'A IA já iniciou a triagem e seu contador foi notificado.',
      })
      if (onDocumentUploaded) onDocumentUploaded()
    } catch (err: any) {
      toast({
        title: 'Erro ao enviar',
        description: err?.message || 'Não foi possível enviar o documento de teste.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const progressPercentage = (step / totalSteps) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white rounded-2xl shadow-2xl p-0 overflow-hidden border-slate-200">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-6 relative">
          <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Onboarding Guiado
                  </span>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                    Passo {step} de {totalSteps}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  Bem-vindo ao Portal Contábil Integrado
                </h2>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-1.5 bg-slate-800" />
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 space-y-6 min-h-[380px] flex flex-col justify-between">
          {/* STEP 1: Boas-vindas & Dados da Empresa */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Olá, <span className="text-emerald-700">{userName}</span>! Vamos conhecer seu
                  portal?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Este é o canal oficial de comunicação e envio de documentos entre a{' '}
                  <strong>{effectiveCompanyName}</strong> e o escritório{' '}
                  <strong>Golden Contabilidade</strong>.
                </p>
              </div>

              {/* Company Data Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Dados da sua Empresa Cadastrada
                    </span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                    Ativa &bull; Em Conformidade
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Razão Social:</span>
                    <span className="font-bold text-slate-900">{effectiveCompanyName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">CNPJ:</span>
                    <span className="font-bold text-slate-900">{effectiveCnpj}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Regime Tributário:</span>
                    <span className="font-bold text-emerald-700">{effectiveRegime}</span>
                  </div>
                </div>
              </div>

              {/* What client gets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Zero Risco de Multas</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Calendário com alertas de vencimento por e-mail 3 dias antes.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Triagem com IA</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Você anexa o arquivo e a IA pré-classifica automaticamente para o contador.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Entendimento das Obrigações & Pendências */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Obrigações e Calendário do Regime {effectiveRegime}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Seu calendário fiscal é montado automaticamente conforme a legislação do seu
                  regime tributário.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      DAS
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        DAS - Documento de Arrecadação do Simples
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Vencimento todo dia 20 &bull; Pagamento de tributos unificados
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 text-[10px]">Mensal</Badge>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      RH
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Folha de Pagamento & FGTS Digital
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Vencimento dia 15 e 20 &bull; DCTFWeb e guias previdenciárias
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Mensal</Badge>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      DEFIS
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        DEFIS - Declaração Socioeconômica e Fiscal
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Vencimento anual dia 31 de Março &bull; Prestação anual de contas
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 text-[10px]">Anual</Badge>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Lembretes Automáticos:</strong> O sistema envia avisos por e-mail para{' '}
                  <span className="font-semibold underline">william@korenambiental.com</span> dias
                  antes de cada vencimento.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Envio do 1º Documento */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Faça o envio do seu primeiro documento
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Experimente o fluxo completo de envio de guias ou contratos para a contabilidade.
                </p>
              </div>

              {uploadedSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-emerald-950">
                      Documento anexado com sucesso!
                    </h4>
                    <p className="text-xs text-emerald-800 mt-1 max-w-sm mx-auto">
                      O arquivo foi registrado na base da <strong>{effectiveCompanyName}</strong> e
                      agora segue para triagem contábil.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUploadFirstDoc} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">
                      Título / Descrição do Documento
                    </Label>
                    <Input
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="Ex: Guia DAS Março 2026"
                      className="h-10 text-sm bg-slate-50"
                      required
                    />
                  </div>

                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/70 text-center space-y-2">
                    <input
                      id="onboarding-file"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0])
                          if (!docTitle)
                            setDocTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''))
                        }
                      }}
                      accept=".pdf,.png,.jpg,.jpeg,.xml"
                    />
                    <label htmlFor="onboarding-file" className="cursor-pointer block">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        {selectedFile
                          ? selectedFile.name
                          : 'Clique para selecionar um comprovante ou guia'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        PDF, PNG ou JPG (opcional neste passo de teste)
                      </p>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={uploading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 gap-1.5 shadow-sm"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <FileUp className="w-3.5 h-3.5" />
                          <span>Enviar Documento de Teste</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 4: Como Acompanhar a Validação */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Como acompanhar o status e a validação
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Entenda os selos de status dos seus documentos e as etapas da equipe contábil.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Aguardando Confirmação</span>
                  </div>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    A IA leu o documento e o contador está confirmando a pasta correta (Fiscal, RH,
                    Contábil).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Em Validação</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    O contador responsável está conferindo valores, código de barras e vigência da
                    guia.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aprovado</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Documento validado com sucesso! Arquivado com segurança e compliance garantido.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-red-900 font-bold">
                    <HelpCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>Rejeitado / Pendente</span>
                  </div>
                  <p className="text-[11px] text-red-800 leading-relaxed">
                    O contador anexou uma justificativa (ex.: guia ilegível) para você reenviar com
                    facilidade.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Tudo pronto para iniciar a gestão contábil da sua empresa!</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                className="text-xs text-slate-600 gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSkipOrClose}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Pular Introdução
              </Button>
            )}

            <div className="flex items-center gap-2">
              {step < totalSteps ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setStep((s) => s + 1)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm"
                >
                  <span>Próximo Passo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleFinish}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm font-semibold px-4"
                >
                  <Check className="w-4 h-4" />
                  <span>Concluir & Acessar Portal</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
