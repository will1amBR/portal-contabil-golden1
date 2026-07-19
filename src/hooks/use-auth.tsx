import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

export interface UserData {
  id: string
  email: string
  name: string
  role: 'admin' | 'accountant' | 'client'
  avatar?: string
}

interface AuthContextType {
  user: UserData | null
  isAuthenticated: boolean
  isAccountant: boolean
  signIn: (email: string, pass: string) => Promise<{ error: any }>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(
    pb.authStore.isValid ? (pb.authStore.record as unknown as UserData) : null,
  )
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(pb.authStore.isValid ? (record as unknown as UserData) : null)
      setIsAuthenticated(pb.authStore.isValid)
    })

    if (pb.authStore.isValid) {
      pb.collection('users')
        .authRefresh()
        .catch(() => pb.authStore.clear())
        .finally(() => setLoading(false))
    } else {
      if (pb.authStore.record) pb.authStore.clear()
      setLoading(false)
    }
    return () => {
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, pass: string) => {
    try {
      await pb.collection('users').authWithPassword(email, pass)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = () => {
    pb.authStore.clear()
  }

  const isAccountant = user?.role === 'accountant' || user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAccountant, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
