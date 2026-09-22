import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Send,
  Loader2,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createLead } from '@/services/api'
import { useToast } from '@/hooks/use-toast'

interface LandingLeadFormProps {
  selectedRegime?: string
  onRegimeChange?: (regime: string) => void
}

export function LandingLeadForm({
  selectedRegime = 'simples',
  onRegimeChange,
}: LandingLeadFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    cnpj: '',
    tax_regime: selectedRegime,
    employees_count: '1-5',
    message: '',
  })

  // Synchronize when parent updates selectedRegime
  const currentRegime = selectedRegime || formData.tax_regime

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: 'Preencha os campos obrigatórios',
        description: 'Informe pelo menos seu nome e e-mail corporativo.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      await createLead({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company_name: formData.company_name.trim(),
        cnpj: formData.cnpj.trim(),
        tax_regime: currentRegime,
        employees_count: formData.employees_count,
        message: formData.message.trim(),
      })

      setSubmitted(true)
      toast({
        title: 'Proposta solicitada com sucesso!',
        description:
          'Nossa equipe contábil recebeu seus dados e entrará em contato em breve por e-mail e WhatsApp!',
      })
    } catch (err: any) {
      const isRateLimited = err?.status === 429 || err?.response?.code === 429
      if (isRateLimited) {
        toast({
          title: 'Muitas solicitações enviadas',
          description:
            err?.response?.message ||
            'Por segurança anti-spam, aguarde alguns minutos antes de enviar nova mensagem.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro ao enviar solicitação',
          description:
            err?.response?.message ||
            err?.message ||
            'Tente novamente ou envie um e-mail para contato@golden.com.br',
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="contratar"
      className="py-24 bg-slate-950 border-t border-slate-800 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Top Callout */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-slate-900 text-amber-200 border-amber-500/30 text-xs font-semibold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400 inline" />
            Contratação Assistida &bull; Sem Custos de Adesão
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Pronto para ter segurança tributária no seu CNPJ?
          </h2>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
            Preencha os dados abaixo para receber uma proposta técnica detalhada em até 2 horas
            úteis. Migração gratuita conduzida por contadores seniores com registro no CRC-SP.
          </p>
        </div>

        {/* Form and Info Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct contact info & Benefits */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">Por que escolher a Golden?</h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Você conta com acompanhamento consultivo de ponta a ponta, sem robôs impessoais nos
                momentos cruciais, apoiado por uma infraestrutura estável para acompanhamento de
                vencimentos e documentos fiscais.
              </p>
            </div>

            {/* Direct contact cards */}
            <div className="space-y-3.5 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                    E-mail Institucional
                  </p>
                  <p className="font-semibold text-white text-base">contato@golden.com.br</p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Notificação direta aos contadores responsáveis
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                    Telefone & WhatsApp Corporativo
                  </p>
                  <p className="font-semibold text-white text-base">
                    (11) 3456-7890 &bull; (11) 98765-4321
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Atendimento imediato em dias úteis
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                    Horário de Expediente
                  </p>
                  <p className="font-semibold text-white text-base">
                    Segunda a Sexta, das 08h às 18h
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Portal em nuvem disponível 24 horas por dia
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                    Sede Operacional
                  </p>
                  <p className="font-semibold text-white text-base">
                    Av. Paulista, 1000 &bull; São Paulo - SP
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Atendimento presencial com agendamento ou 100% digital em todo o território
                    nacional
                  </p>
                </div>
              </div>
            </div>

            {/* Security Guarantee badge */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Privacidade e Sigilo:</strong> Em estrita conformidade com a LGPD e normas
                do Conselho Federal de Contabilidade.
              </span>
            </div>
          </div>

          {/* Right Column: Lead Form Card */}
          <div className="lg:col-span-7">
            <Card className="border border-slate-800 bg-slate-900 shadow-xl rounded-xl overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                {submitted ? (
                  <div className="py-12 text-center space-y-5 animate-fade-in">
                    <div className="w-16 h-16 rounded-xl bg-slate-950 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">
                        Solicitação de Proposta Recebida com Sucesso!
                      </h3>
                      <p className="text-sm sm:text-base text-slate-200 max-w-md mx-auto leading-relaxed">
                        Nossa equipe técnica (sob supervisão do contador Paulo César) já foi
                        notificada e está avaliando o enquadramento fiscal do seu negócio. O contato
                        será realizado no e-mail <strong>{formData.email}</strong> e via WhatsApp.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 max-w-sm mx-auto text-left space-y-1.5 font-mono">
                      <p>
                        <span className="text-slate-400">Regime Selecionado:</span>{' '}
                        <strong className="text-amber-300 uppercase">{currentRegime}</strong>
                      </p>
                      <p>
                        <span className="text-slate-400">Responsável:</span> {formData.name}
                      </p>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Button
                        onClick={() => {
                          setSubmitted(false)
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            company_name: '',
                            cnpj: '',
                            tax_regime: 'simples',
                            employees_count: '1-5',
                            message: '',
                          })
                        }}
                        variant="outline"
                        className="bg-slate-950 hover:bg-slate-800 text-white border-slate-700 text-xs sm:text-sm h-11 w-full sm:w-auto"
                      >
                        Enviar outra mensagem
                      </Button>
                      <Link to="/login" className="w-full sm:w-auto">
                        <Button className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm h-11 w-full sm:w-auto gap-2">
                          <Lock className="w-4 h-4 text-slate-950" />
                          <span>Já sou cliente: Fazer Login</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        Solicite sua Proposta Personalizada
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        Preencha os dados da sua empresa. Retorno rápido sem taxas de adesão.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-200">
                          Nome Completo *
                        </Label>
                        <Input
                          required
                          placeholder="Ex: Carlos Silva"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white h-11 text-sm focus-visible:ring-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-200">
                          E-mail Corporativo *
                        </Label>
                        <Input
                          type="email"
                          required
                          placeholder="carlos@empresa.com.br"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white h-11 text-sm focus-visible:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-200">
                          WhatsApp / Telefone *
                        </Label>
                        <Input
                          required
                          placeholder="(11) 98765-4321"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white h-11 text-sm focus-visible:ring-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-200">
                          Nome da Empresa / Razão Social
                        </Label>
                        <Input
                          placeholder="Ex: Koren Soluções LTDA"
                          value={formData.company_name}
                          onChange={(e) =>
                            setFormData({ ...formData, company_name: e.target.value })
                          }
                          className="bg-slate-950 border-slate-800 text-white h-11 text-sm focus-visible:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-200">
                          CNPJ (se já constituído)
                        </Label>
                        <Input
                          placeholder="00.000.000/0001-00"
                          value={formData.cnpj}
                          onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white h-11 text-sm font-mono focus-visible:ring-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-200">
                          Regime Tributário de Interesse
                        </Label>
                        <Select
                          value={currentRegime}
                          onValueChange={(v) => {
                            setFormData({ ...formData, tax_regime: v })
                            if (onRegimeChange) onRegimeChange(v)
                          }}
                        >
                          <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-11 text-xs sm:text-sm focus-visible:ring-amber-500">
                            <SelectValue placeholder="Selecione o regime" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            <SelectItem value="simples">
                              Simples Nacional (desde R$ 149/mês)
                            </SelectItem>
                            <SelectItem value="presumido">
                              Lucro Presumido (desde R$ 249/mês)
                            </SelectItem>
                            <SelectItem value="real">
                              Lucro Real / Corporativo (Sob Medida)
                            </SelectItem>
                            <SelectItem value="mei">MEI (Microempreendedor Individual)</SelectItem>
                            <SelectItem value="nao_sei">
                              Não sei ainda / Solicitar diagnóstico gratuito
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-200">
                          Número de Sócios / Funcionários
                        </Label>
                        <Select
                          value={formData.employees_count}
                          onValueChange={(v) => setFormData({ ...formData, employees_count: v })}
                        >
                          <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-11 text-xs sm:text-sm focus-visible:ring-amber-500">
                            <SelectValue placeholder="Selecione a faixa" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            <SelectItem value="0">Apenas sócios (Sem colaboradores CLT)</SelectItem>
                            <SelectItem value="1-5">1 a 5 colaboradores</SelectItem>
                            <SelectItem value="6-15">6 a 15 colaboradores</SelectItem>
                            <SelectItem value="16-50">16 a 50 colaboradores</SelectItem>
                            <SelectItem value="50+">Mais de 50 colaboradores</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-200">
                          Objetivo Principal
                        </Label>
                        <Select defaultValue="migrar">
                          <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-11 text-xs sm:text-sm focus-visible:ring-amber-500">
                            <SelectValue placeholder="Selecione o objetivo" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            <SelectItem value="migrar">
                              Trocar de contador (Migração gratuita)
                            </SelectItem>
                            <SelectItem value="abrir">
                              Abrir uma nova empresa (CNPJ novo)
                            </SelectItem>
                            <SelectItem value="regularizar">
                              Regularizar pendências e certidões
                            </SelectItem>
                            <SelectItem value="reduzir">
                              Reduzir impostos (Planejamento tributário)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs sm:text-sm font-semibold text-slate-200">
                        Mensagem ou Particularidades da Empresa
                      </Label>
                      <Textarea
                        rows={3}
                        placeholder="Ex: Faturamento médio mensal, volume de notas fiscais emitidas, segmento de atuação..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-slate-950 border-slate-800 text-white text-xs sm:text-sm resize-none focus-visible:ring-amber-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold h-12 text-sm sm:text-base shadow-md shadow-amber-950/40 gap-2 mt-2 transition-all"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                          <span>Processando proposta...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 text-slate-950" />
                          <span>Solicitar Proposta & Falar com Contador Sênior</span>
                        </>
                      )}
                    </Button>

                    <div className="pt-1 flex items-center justify-center gap-2 text-xs text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Sem custo &bull; Resposta em até 2h úteis &bull; LGPD Compliant</span>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
