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
      toast({
        title: 'Acesso não autorizado',
        description: 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      })
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
    <div className="min-h-screen grid lg:grid-cols-12 bg-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Left Column: Brand, Pitch & Value Proposition */}
      <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white border-r border-slate-800/80">
        {/* Background decorative glows */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-300/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white">
                  Golden Contabilidade
                </span>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] font-medium px-2">
                  Portal Corporativo
                </Badge>
              </div>
              <p className="text-xs text-slate-400">Inteligência Contábil & Gestão Integrada</p>
            </div>
          </div>

          <Link
            to="/institucional"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-emerald-300 hover:text-emerald-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Conhecer a Golden & Contratar &rarr;</span>
          </Link>
        </div>

        {/* Main Center Message */}
        <div className="relative z-10 max-w-xl space-y-8 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Classificação e triagem com Inteligência Artificial</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Gestão fiscal transparente entre escritório e sua empresa.
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              Centralize envio de guias fiscais, folhas de pagamento, relatórios mensais e
              calendário de obrigações em uma plataforma segura e em tempo real.
            </p>
          </div>

          {/* Value props list */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-emerald-400 mt-0.5">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Triagem Automática</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Classificação instantânea de notas, DAS e DARFs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-emerald-400 mt-0.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Calendário Fiscal</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Prazos de Simples, Lucro Presumido e Real sob controle.
                </p>
              </div>
            </div>
          </div>

          {/* Client Testimonial / Trust badge */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
              KA
            </div>
            <div className="text-xs">
              <p className="text-slate-200 font-medium">
                Koren Ambiental LTDA & mais de 120 clientes
              </p>
              <p className="text-slate-400">
                Atendimento ágil, conformidade e integração direta com contadores parceiros.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Conexão criptografada de ponta a ponta</span>
          </div>
          <span>v2.4 &bull; Golden Tech</span>
        </div>
      </div>

      {/* Right Column: Interactive Login Box */}
      <div className="col-span-12 lg:col-span-5 flex flex-col justify-center p-6 sm:p-10 lg:p-12 bg-slate-50 min-h-screen">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Mobile brand header (shown on smaller screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 leading-tight">Golden Contabilidade</h2>
              <p className="text-xs text-slate-500">Portal Contábil Integrado</p>
            </div>
          </div>

          <Card className="border border-slate-200/80 shadow-xl bg-white rounded-2xl overflow-hidden">
            <CardHeader className="space-y-1.5 pb-6 border-b border-slate-100 bg-slate-50/50 px-6 pt-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Acesse sua conta
                </CardTitle>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
              <CardDescription className="text-sm text-slate-500">
                Informe suas credenciais corporativas para entrar no portal.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email input */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
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
                      className="pl-9 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:border-transparent text-slate-900 text-sm"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
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
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
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
                      className="pl-9 pr-10 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:border-transparent text-slate-900 text-sm font-sans"
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
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all duration-150 mt-2 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar no Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Quick access demo cards */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Acesso Rápido de Demonstração:</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('paulinho@golden.com.br', '12345678')}
                    className="p-2.5 text-left rounded-lg border border-slate-200/90 bg-slate-50/70 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 group-hover:text-emerald-900">
                          Contador (Golden Contabilidade)
                        </span>
                        <Badge className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0">
                          Escritório
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate">
                        paulinho@golden.com.br
                      </p>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                      Preencher &rarr;
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickDemo('william@korenambiental.com', '12345678')}
                    className="p-2.5 text-left rounded-lg border border-slate-200/90 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-300 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-900">
                          Cliente (Koren Ambiental)
                        </span>
                        <Badge className="bg-blue-100 text-blue-800 text-[9px] px-1.5 py-0">
                          Empresa
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate">
                        william@korenambiental.com
                      </p>
                    </div>
                    <span className="text-[11px] font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      Preencher &rarr;
                    </span>
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 bg-slate-50/80 border-t border-slate-100 text-center flex flex-col items-center justify-center gap-1">
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                Precisa de suporte contábil ou fiscal?
              </p>
              <p className="text-[11px] text-slate-400">
                Entre em contato com o escritório pelo e-mail{' '}
                <span className="font-medium text-slate-600">contato@golden.com.br</span>
              </p>
              <div className="pt-2">
                <Link
                  to="/institucional"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Conheça nossos planos e contrate a Golden
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
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
              <Mail className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Recuperação de Acesso
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Informe seu e-mail cadastrado para receber as orientações de redefinição de senha
              segura.
            </DialogDescription>
          </DialogHeader>

          {resetSent ? (
            <div className="py-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-900">Instruções enviadas!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Enviamos um link de redefinição para <strong>{resetEmail}</strong>. Verifique sua
                  caixa de entrada e spam.
                </p>
              </div>
              <Button
                onClick={() => setForgotPasswordOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-4"
              >
                Voltar para o Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="reset-email" className="text-xs font-semibold text-slate-700">
                  Seu E-mail Cadastrado
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  required
                  placeholder="exemplo@golden.com.br"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotPasswordOpen(false)}
                  disabled={resetLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
