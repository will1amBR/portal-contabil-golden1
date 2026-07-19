import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import Login from '@/pages/Login'
import Companies from '@/pages/Companies'
import Documents from '@/pages/Documents'
import Chat from '@/pages/Chat'
import NotFound from '@/pages/NotFound'

const ProtectedRoute = ({
  children,
  requireAccountant = false,
}: {
  children: React.ReactNode
  requireAccountant?: boolean
}) => {
  const { isAuthenticated, loading, isAccountant } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requireAccountant && !isAccountant) return <Navigate to="/" replace />
  return <>{children}</>
}

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route path="/" element={<Index />} />
      <Route
        path="/companies"
        element={
          <ProtectedRoute requireAccountant>
            <Companies />
          </ProtectedRoute>
        }
      />
      <Route path="/documents" element={<Documents />} />
      <Route path="/chat" element={<Chat />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
)

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
