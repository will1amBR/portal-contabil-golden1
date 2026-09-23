import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Navigate, Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import {
  Building2,
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  UserCheck,
  FileCheck,
  BarChart3,
  Loader2,
} from 'lucide-react'

export default function Login() {
  const { signIn, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const { toast } = useToast()

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !pass) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha o e-mail e a senha para acessar.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { error } = await signIn(email.trim(), pass)
    if (error) {
      const errObj = error as any
      const isRateLimited =
        errObj?.status === 429 ||
        errObj?.response?.code === 429 ||
        (typeof errObj?.message === 'string' && errObj?.message.includes('429'))
      if (isRateLimited) {
        toast({
          title: 'Acesso Temporariamente Suspenso',
          description:
            errObj?.response?.message ||
            'Muitas tentativas de login com erro. Por motivos de segurança, aguarde alguns minutos antes de tentar novamente.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Acesso não autorizado',
          description: 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.',
          variant: 'destructive',
        })
      }
    } else {
      toast({
        title: 'Bem-vindo ao Portal!',
        description: 'Sessão autenticada com sucesso.',
      })
    }
    setLoading(false)
  }

  const fillQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPass(demoPass)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) return
    setResetLoading(true)
    // Simula envio seguro de recuperação
    await new Promise((r) => setTimeout(r, 800))
    setResetLoading(false)
    setResetSent(true)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[#faf8f5] font-sans selection:bg-amber-500/30 selection:text-slate-950">
      {/* Left Column: Brand, Pitch & Value Proposition Corporativa */}
      <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-white via-[#faf8f5] to-[#f4efe8] text-slate-900 border-r border-stone-200">
        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shadow-2xs">
              <Building2 className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-slate-950">
                  Golden Contabilidade
                </span>
                <Badge className="bg-white text-amber-900 border-amber-300 text-[10px] font-semibold px-2">
                  Portal Seguro
                </Badge>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                CRC-SP 2SP034891/O &bull; Gestão Integrada
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-stone-300 text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Página Inicial Golden &rarr;</span>
          </Link>
        </div>

        {/* Main Center Message */}
        <div className="relative z-10 max-w-xl space-y-8 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-600/30 text-amber-900 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Ambiente Exclusivo para Clientes e Auditores</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-slate-950 leading-[1.18]">
              Gestão fiscal transparente, ágil e em estrita conformidade.
            </h1>
            <p className="text-slate-700 text-base lg:text-lg leading-relaxed">
              Acompanhe guias tributárias, folhas de pagamento, certidões negativas e o calendário
              fiscal do seu negócio com a supervisão contínua de contadores habilitados.
            </p>
          </div>

          {/* Value props list */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-amber-700 mt-0.5 shadow-2xs">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-950">Triagem Organizada</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Classificação e conferência ágil de notas e guias fiscais.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-amber-700 mt-0.5 shadow-2xs">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-950">Semáforo de Prazos</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Vencimentos e obrigações sob monitoramento constante.
                </p>
              </div>
            </div>
          </div>

          {/* Client Testimonial / Trust badge */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-center gap-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center font-bold text-amber-900 text-xs">
              KA
            </div>
            <div className="text-xs">
              <p className="text-slate-950 font-bold">
                Koren Ambiental LTDA & mais de 120 clientes corporativos
              </p>
              <p className="text-slate-600 mt-0.5">
                Atendimento consultivo, blindagem fiscal e suporte técnico em horário comercial.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-600 pt-6 border-t border-stone-200">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Conexão segura com criptografia TLS de ponta a ponta</span>
          </div>
          <span className="font-semibold text-slate-800">Golden Tech &bull; CRC-SP</span>
        </div>
      </div>

      {/* Right Column: Interactive Login Box */}
      <div className="col-span-12 lg:col-span-5 flex flex-col justify-center p-6 sm:p-10 lg:p-12 bg-[#faf8f5] min-h-screen">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Mobile brand header (shown on smaller screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-xs font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-950 leading-tight">Golden Contabilidade</h2>
              <p className="text-xs text-slate-600 font-medium">Portal Contábil Integrado</p>
            </div>
          </div>

          <Card className="border border-stone-200 shadow-md bg-white rounded-2xl overflow-hidden">
            <CardHeader className="space-y-1.5 pb-6 border-b border-stone-200 bg-[#faf8f5]/80 px-6 pt-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-slate-950">
                  Acesse sua conta
                </CardTitle>
                <div className="w-8 h-8 rounded-lg bg-white text-amber-700 border border-stone-200 flex items-center justify-center shadow-2xs">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
              <CardDescription className="text-sm text-slate-600">
                Informe suas credenciais corporativas para entrar no portal.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email input */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold text-slate-900 uppercase tracking-wider"
                  >
                    E-mail Corporativo
                  </Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="exemplo@golden.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-11 bg-white border-stone-300 focus-visible:ring-1 focus-visible:ring-amber-500 text-slate-900 text-sm shadow-2xs"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-xs font-semibold text-slate-900 uppercase tracking-wider"
                    >
                      Senha de Acesso
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email)
                        setResetSent(false)
                        setForgotPasswordOpen(true)
                      }}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline transition-colors"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      className="pl-9 pr-10 h-11 bg-white border-stone-300 focus-visible:ring-1 focus-visible:ring-amber-500 text-slate-900 text-sm font-sans shadow-2xs"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                      title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm sm:text-base shadow-xs transition-all duration-150 mt-2 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar no Portal</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </Button>
              </form>

              {/* Quick access demo cards */}
              <div className="mt-6 pt-5 border-t border-stone-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Acesso Rápido de Demonstração:</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('paulinho@golden.com.br', '12345678')}
                    className="p-2.5 text-left rounded-xl border border-stone-200 bg-[#faf8f5] hover:bg-white hover:border-amber-400/60 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-950 group-hover:text-amber-800">
                          Contador (Golden Contabilidade)
                        </span>
                        <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[9px] px-1.5 py-0 font-semibold">
                          Escritório
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-600 font-mono truncate">
                        paulinho@golden.com.br
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 group-hover:translate-x-0.5 transition-transform">
                      Preencher &rarr;
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickDemo('william@korenambiental.com', '12345678')}
                    className="p-2.5 text-left rounded-xl border border-stone-200 bg-[#faf8f5] hover:bg-white hover:border-amber-400/60 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-950 group-hover:text-amber-800">
                          Cliente (Koren Ambiental)
                        </span>
                        <Badge className="bg-stone-100 text-slate-800 border-stone-300 text-[9px] px-1.5 py-0 font-medium">
                          Empresa
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-600 font-mono truncate">
                        william@korenambiental.com
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 group-hover:translate-x-0.5 transition-transform">
                      Preencher &rarr;
                    </span>
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 bg-[#faf8f5] border-t border-stone-200 text-center flex flex-col items-center justify-center gap-1">
              <p className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                Precisa de suporte contábil ou fiscal?
              </p>
              <p className="text-xs text-slate-500">
                Entre em contato com o escritório pelo e-mail{' '}
                <span className="font-medium text-slate-800">contato@golden.com.br</span>
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/"
                  className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Conhecer a Golden (Home)
                </Link>
                <span className="text-stone-300">&bull;</span>
                <Link
                  to="/planos"
                  className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline inline-flex items-center gap-1"
                >
                  Ver Planos
                </Link>
                <span className="text-stone-300">&bull;</span>
                <Link
                  to="/contratar"
                  className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline inline-flex items-center gap-1"
                >
                  Contratar
                </Link>
              </div>
            </CardFooter>
          </Card>

          <p className="text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Golden Contabilidade &bull; Todos os direitos
            reservados.
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-stone-200">
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-2">
              <Mail className="w-5 h-5 text-amber-700" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-950">
              Recuperação de Acesso
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-sm">
              Informe seu e-mail cadastrado para receber as orientações de redefinição de senha
              segura.
            </DialogDescription>
          </DialogHeader>

          {resetSent ? (
            <div className="py-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-950">Instruções enviadas!</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto">
                  Enviamos um link de redefinição para <strong>{resetEmail}</strong>. Verifique sua
                  caixa de entrada e spam.
                </p>
              </div>
              <Button
                onClick={() => setForgotPasswordOpen(false)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold mt-4"
              >
                Voltar para o Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="reset-email"
                  className="text-xs sm:text-sm font-semibold text-slate-900"
                >
                  Seu E-mail Cadastrado
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  required
                  placeholder="exemplo@golden.com.br"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="h-10 bg-white border-stone-300 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-stone-300 text-slate-700 hover:bg-stone-50"
                  onClick={() => setForgotPasswordOpen(false)}
                  disabled={resetLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
                  disabled={resetLoading}
                >
                  {resetLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
