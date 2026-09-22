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
    <div className="min-h-screen grid lg:grid-cols-12 bg-slate-950 font-sans selection:bg-amber-700 selection:text-white">
      {/* Left Column: Brand, Pitch & Value Proposition Corporativa */}
      <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 relative overflow-hidden bg-slate-950 text-white border-r border-slate-800">
        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-md shadow-amber-950/40 ring-1 ring-amber-400/40">
              <Building2 className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white">
                  Golden Contabilidade
                </span>
                <Badge className="bg-slate-900 text-amber-300 border-amber-500/30 text-[10px] font-semibold px-2">
                  Portal Seguro
                </Badge>
              </div>
              <p className="text-xs text-slate-300">CRC-SP 2SP034891/O &bull; Gestão Integrada</p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-medium text-amber-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Página Inicial Golden &rarr;</span>
          </Link>
        </div>

        {/* Main Center Message */}
        <div className="relative z-10 max-w-xl space-y-8 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-slate-900 border border-amber-500/30 text-amber-200 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ambiente Exclusivo para Clientes e Auditores</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-[1.18]">
              Gestão fiscal transparente, ágil e em estrita conformidade.
            </h1>
            <p className="text-slate-200 text-base lg:text-lg leading-relaxed">
              Acompanhe guias tributárias, folhas de pagamento, certidões negativas e o calendário
              fiscal do seu negócio com a supervisão contínua de contadores habilitados.
            </p>
          </div>

          {/* Value props list */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 mt-0.5">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Triagem Organizada</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Classificação e conferência ágil de notas e guias fiscais.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 mt-0.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Semáforo de Prazos</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Vencimentos e obrigações sob monitoramento constante.
                </p>
              </div>
            </div>
          </div>

          {/* Client Testimonial / Trust badge */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-amber-300 text-xs">
              KA
            </div>
            <div className="text-xs">
              <p className="text-slate-100 font-bold">
                Koren Ambiental LTDA & mais de 120 clientes corporativos
              </p>
              <p className="text-slate-300 mt-0.5">
                Atendimento consultivo, blindagem fiscal e suporte técnico em horário comercial.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Conexão segura com criptografia TLS de ponta a ponta</span>
          </div>
          <span>Golden Tech &bull; CRC-SP</span>
        </div>
      </div>

      {/* Right Column: Interactive Login Box */}
      <div className="col-span-12 lg:col-span-5 flex flex-col justify-center p-6 sm:p-10 lg:p-12 bg-slate-950 min-h-screen">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Mobile brand header (shown on smaller screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center text-slate-950 shadow-md font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white leading-tight">Golden Contabilidade</h2>
              <p className="text-xs text-slate-300">Portal Contábil Integrado</p>
            </div>
          </div>

          <Card className="border border-slate-800 shadow-2xl bg-slate-900 rounded-xl overflow-hidden">
            <CardHeader className="space-y-1.5 pb-6 border-b border-slate-800 bg-slate-950/60 px-6 pt-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-white">Acesse sua conta</CardTitle>
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
              <CardDescription className="text-sm text-slate-300">
                Informe suas credenciais corporativas para entrar no portal.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email input */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold text-slate-200 uppercase tracking-wider"
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
                      className="pl-9 h-11 bg-slate-950 border-slate-800 focus-visible:ring-1 focus-visible:ring-amber-500 text-white text-sm"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-xs font-semibold text-slate-200 uppercase tracking-wider"
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
                      className="text-xs font-medium text-amber-300 hover:text-amber-200 hover:underline transition-colors"
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
                      className="pl-9 pr-10 h-11 bg-slate-950 border-slate-800 focus-visible:ring-1 focus-visible:ring-amber-500 text-white text-sm font-sans"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-md shadow-amber-950/40 transition-all duration-150 mt-2 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar no Portal</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </Button>
              </form>

              {/* Quick access demo cards */}
              <div className="mt-6 pt-5 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Acesso Rápido de Demonstração:</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('paulinho@golden.com.br', '12345678')}
                    className="p-2.5 text-left rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-850 hover:border-slate-700 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white group-hover:text-amber-200">
                          Contador (Golden Contabilidade)
                        </span>
                        <Badge className="bg-slate-900 text-amber-300 border-amber-500/30 text-[9px] px-1.5 py-0">
                          Escritório
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        paulinho@golden.com.br
                      </p>
                    </div>
                    <span className="text-[11px] font-medium text-amber-300 group-hover:translate-x-0.5 transition-transform">
                      Preencher &rarr;
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickDemo('william@korenambiental.com', '12345678')}
                    className="p-2.5 text-left rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-850 hover:border-slate-700 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white group-hover:text-amber-200">
                          Cliente (Koren Ambiental)
                        </span>
                        <Badge className="bg-slate-900 text-slate-200 border-slate-700 text-[9px] px-1.5 py-0">
                          Empresa
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        william@korenambiental.com
                      </p>
                    </div>
                    <span className="text-[11px] font-medium text-amber-300 group-hover:translate-x-0.5 transition-transform">
                      Preencher &rarr;
                    </span>
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 bg-slate-950/80 border-t border-slate-800 text-center flex flex-col items-center justify-center gap-1">
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                Precisa de suporte contábil ou fiscal?
              </p>
              <p className="text-xs text-slate-400">
                Entre em contato com o escritório pelo e-mail{' '}
                <span className="font-medium text-slate-200">contato@golden.com.br</span>
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/"
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Conhecer a Golden (Home)
                </Link>
                <span className="text-slate-600">&bull;</span>
                <Link
                  to="/planos"
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 hover:underline inline-flex items-center gap-1"
                >
                  Ver Planos
                </Link>
                <span className="text-slate-600">&bull;</span>
                <Link
                  to="/contratar"
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 hover:underline inline-flex items-center gap-1"
                >
                  Contratar
                </Link>
              </div>
            </CardFooter>
          </Card>

          <p className="text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Golden Contabilidade &bull; Todos os direitos
            reservados.
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center mb-2">
              <Mail className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              Recuperação de Acesso
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-sm">
              Informe seu e-mail cadastrado para receber as orientações de redefinição de senha
              segura.
            </DialogDescription>
          </DialogHeader>

          {resetSent ? (
            <div className="py-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white">Instruções enviadas!</h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto">
                  Enviamos um link de redefinição para <strong>{resetEmail}</strong>. Verifique sua
                  caixa de entrada e spam.
                </p>
              </div>
              <Button
                onClick={() => setForgotPasswordOpen(false)}
                className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold mt-4"
              >
                Voltar para o Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="reset-email"
                  className="text-xs sm:text-sm font-semibold text-slate-200"
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
                  className="h-10 bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-700 text-slate-200 hover:bg-slate-850"
                  onClick={() => setForgotPasswordOpen(false)}
                  disabled={resetLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold"
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
