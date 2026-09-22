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
      className="py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-t border-slate-800 relative overflow-hidden"
    >
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Top Callout */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-semibold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-400 inline" />
            Contratação 100% Online & Sem Burocracia
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Pronto para colocar sua contabilidade no piloto automático?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Preencha a ficha abaixo para receber uma proposta personalizada em até 2 horas úteis.
            Migração de contador sem custo de adesão e com garantia de conformidade.
          </p>
        </div>

        {/* Form and Info Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct contact info & Benefits */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Por que fechar com a Golden?</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Você conta com contadores consultivos de verdade, atendimento humanizado e uma
                plataforma moderna em nuvem com triagem por IA, calendário fiscal sem multas e
                relatórios em PDF.
              </p>
            </div>

            {/* Direct contact cards */}
            <div className="space-y-3.5 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    E-mail Comercial Direto
                  </p>
                  <p className="font-semibold text-white text-sm">contato@golden.com.br</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Notificações automáticas enviadas para paulinho@golden.com.br
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    WhatsApp & Telefone
                  </p>
                  <p className="font-semibold text-white text-sm">
                    (11) 3456-7890 &bull; (11) 98765-4321
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Atendimento imediato em dias úteis
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Horário de Atendimento
                  </p>
                  <p className="font-semibold text-white text-sm">
                    Segunda a Sexta, das 08h às 18h
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Portal e Assistente IA ativos 24/7
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Sede Operacional
                  </p>
                  <p className="font-semibold text-white text-sm">
                    Av. Paulista, 1000 &bull; São Paulo - SP
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Atendimento presencial com hora marcada ou 100% digital em todo o Brasil
                  </p>
                </div>
              </div>
            </div>

            {/* Security Guarantee badge */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>Privacidade Blindada:</strong> Seus dados são protegidos conforme a LGPD e
                utilizados exclusivamente para formulação da proposta técnica.
              </span>
            </div>
          </div>

          {/* Right Column: Lead Form Card */}
          <div className="lg:col-span-7">
            <Card className="border border-slate-800 bg-slate-900/90 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                {submitted ? (
                  <div className="py-12 text-center space-y-5 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">
                        Solicitação de Proposta Recebida!
                      </h3>
                      <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                        Nossa equipe contábil (liderada pelo Paulinho) já foi notificada e está
                        analisando o enquadramento fiscal do seu negócio. Você receberá a proposta
                        detalhada no e-mail <strong>{formData.email}</strong> e via WhatsApp.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 max-w-sm mx-auto text-left space-y-1 font-mono">
                      <p>
                        <span className="text-slate-500">Regime Selecionado:</span>{' '}
                        <strong className="text-emerald-400 uppercase">{currentRegime}</strong>
                      </p>
                      <p>
                        <span className="text-slate-500">Contato:</span> {formData.name}
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
                        className="bg-slate-800 text-white border-slate-700 text-xs h-10 w-full sm:w-auto"
                      >
                        Enviar outra mensagem
                      </Button>
                      <Link to="/login" className="w-full sm:w-auto">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-10 w-full sm:w-auto gap-2">
                          <Lock className="w-3.5 h-3.5" />
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
                      <p className="text-xs text-slate-400 mt-1">
                        Preencha os dados da sua empresa. Sem taxas de adesão e com resposta rápida.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-300">
                          Nome Completo *
                        </Label>
                        <Input
                          required
                          placeholder="Ex: Carlos Silva"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white h-10 text-sm focus-visible:ring-emerald-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-300">
                          E-mail Corporativo *
                        </Label>
                        <Input
                          type="email"
                          required
                          placeholder="carlos@empresa.com.br"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white h-10 text-sm focus-visible:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-300">
                          WhatsApp / Telefone *
                        </Label>
                        <Input
                          required
                          placeholder="(11) 98765-4321"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white h-10 text-sm focus-visible:ring-emerald-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-300">
                          Nome da Empresa / Razão Social
                        </Label>
                        <Input
                          placeholder="Ex: Koren Soluções LTDA"
                          value={formData.company_name}
                          onChange={(e) =>
                            setFormData({ ...formData, company_name: e.target.value })
                          }
                          className="bg-slate-950 border-slate-800 text-white h-10 text-sm focus-visible:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-300">
                          CNPJ (se já constituído)
                        </Label>
                        <Input
                          placeholder="00.000.000/0001-00"
                          value={formData.cnpj}
                          onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white h-10 text-sm font-mono focus-visible:ring-emerald-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-300">
                          Regime Tributário de Interesse
                        </Label>
                        <Select
                          value={currentRegime}
                          onValueChange={(v) => {
                            setFormData({ ...formData, tax_regime: v })
                            if (onRegimeChange) onRegimeChange(v)
                          }}
                        >
                          <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-10 text-xs focus-visible:ring-emerald-500">
                            <SelectValue placeholder="Selecione o regime" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            <SelectItem value="simples">
                              Simples Nacional (a partir de R$ 149/mês)
                            </SelectItem>
                            <SelectItem value="presumido">
                              Lucro Presumido (a partir de R$ 249/mês)
                            </SelectItem>
                            <SelectItem value="real">
                              Lucro Real / Corporativo (Sob Medida)
                            </SelectItem>
                            <SelectItem value="mei">MEI (Microempreendedor)</SelectItem>
                            <SelectItem value="nao_sei">
                              Não sei ainda / Quero diagnóstico gratuito
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-300">
                          Número de Sócios / Funcionários
                        </Label>
                        <Select
                          value={formData.employees_count}
                          onValueChange={(v) => setFormData({ ...formData, employees_count: v })}
                        >
                          <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-10 text-xs focus-visible:ring-emerald-500">
                            <SelectValue placeholder="Selecione a faixa" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            <SelectItem value="0">Apenas sócios (Sem colaboradores)</SelectItem>
                            <SelectItem value="1-5">1 a 5 colaboradores</SelectItem>
                            <SelectItem value="6-15">6 a 15 colaboradores</SelectItem>
                            <SelectItem value="16-50">16 a 50 colaboradores</SelectItem>
                            <SelectItem value="50+">Mais de 50 colaboradores</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-300">
                          Objetivo Principal
                        </Label>
                        <Select defaultValue="migrar">
                          <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-10 text-xs focus-visible:ring-emerald-500">
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
                      <Label className="text-xs font-semibold text-slate-300">
                        Mensagem ou Particularidades da Empresa
                      </Label>
                      <Textarea
                        rows={3}
                        placeholder="Ex: Faturamento médio mensal, volume de notas fiscais, atividades exercidas ou necessidades de integração..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-slate-950 border-slate-800 text-white text-xs resize-none focus-visible:ring-emerald-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-sm sm:text-base shadow-lg shadow-emerald-600/30 gap-2 mt-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processando e enviando proposta...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Solicitar Proposta & Falar com Contador</span>
                        </>
                      )}
                    </Button>

                    <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
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
