import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { LayoutDashboard } from 'lucide-react'

export default function Login() {
  const { signIn, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, pass)
    if (error) {
      toast({
        title: 'Erro de Autenticação',
        description: 'Credenciais inválidas.',
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md animate-fade-in-up shadow-elevation border-0">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center mb-4">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Portal Contábil</CardTitle>
          <CardDescription>Acesse sua conta para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="focus-visible:ring-emerald-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-6"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
