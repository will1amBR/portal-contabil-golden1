import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, X, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getCompaniesByOwner,
  getDocuments,
  getTaxRegimesRequirements,
  type TaxRegimeRequirement,
} from '@/services/api'

const FREQ_LABELS: Record<string, string> = {
  monthly: 'Mensal',
  annually: 'Anual',
  quarterly: 'Trimestral',
}

/**
 * Banner (NÃO-modal) de documentos obrigatórios pendentes do cliente.
 *
 * Renderizado APENAS no dashboard do cliente (ClientDashboard) — nunca em
 * guard/layout global, portanto não reaparece a cada troca de rota.
 *
 * Regras de dispensa (persistidas em sessionStorage, por usuário):
 * - Ao dispensar, guarda a lista de ids das pendências dispensadas.
 * - Enquanto as pendências atuais forem subconjunto das dispensadas (ou seja,
 *   nada de novo apareceu), o aviso NÃO volta — nem navegando, nem reabrindo
 *   a aba, nem após o contador validar um documento.
 * - Volta a aparecer somente se surgir uma pendência genuinamente nova ou em
 *   um novo login/sessão (sessionStorage é limpo ao fechar a sessão).
 */
export function RequiredDocsBanner() {
  const { user, isAuthenticated } = useAuth()
  const [missingReqs, setMissingReqs] = useState<TaxRegimeRequirement[]>([])
  const [dismissedIds, setDismissedIds] = useState<string[] | null>(null)
  const [ready, setReady] = useState(false)

  const storageKey = user ? `pending_docs_dismissed_${user.id}` : null
  const isClient = isAuthenticated && user?.role === 'client'

  const checkMissingDocs = useCallback(async () => {
    if (!user) return []
    const companies = await getCompaniesByOwner(user.id)
    if (companies.length === 0) return []
    const company = companies[0]
    const [requirements, documents] = await Promise.all([
      getTaxRegimesRequirements(company.tax_regime),
      getDocuments({ companyId: company.id }),
    ])
    const reqNameOf = (req: TaxRegimeRequirement) => req.requirement_name.toLowerCase()
    return requirements.filter(
      (req) => !documents.some((doc) => doc.title?.toLowerCase().includes(reqNameOf(req))),
    )
  }, [user])

  // Checagem inicial (uma vez por login — NÃO depende da rota).
  useEffect(() => {
    setReady(false)
    setMissingReqs([])
    setDismissedIds(null)
    if (!isClient || !storageKey) return

    let cancelled = false
    checkMissingDocs()
      .then((missing) => {
        if (cancelled) return
        setMissingReqs(missing)
        try {
          const stored = sessionStorage.getItem(storageKey)
          setDismissedIds(stored ? (JSON.parse(stored) as string[]) : null)
        } catch {
          setDismissedIds(null)
        }
      })
      .catch(() => {
        if (!cancelled) setMissingReqs([])
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [isClient, storageKey, checkMissingDocs])

  // Atualização em tempo real: quando um documento é enviado/validado ou um
  // requisito do regime muda, recalcula as pendências.
  const refreshMissing = useCallback(async () => {
    if (!isClient || !storageKey) return
    try {
      const missing = await checkMissingDocs()
      setMissingReqs(missing)
      // Se o novo conjunto de pendências é subconjunto do que já foi
      // dispensado, a dispensa permanece válida (atualiza os ids salvos).
      setDismissedIds((prev) => {
        if (!prev || missing.length === 0) return prev
        const prevSet = new Set(prev)
        const isSubset = missing.every((req) => prevSet.has(req.id))
        if (!isSubset) return prev
        const nextIds = missing.map((req) => req.id)
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(nextIds))
        } catch {
          // sem storage: dispensa vale só para esta renderização
        }
        return nextIds
      })
    } catch {
      // silencioso
    }
  }, [isClient, storageKey, checkMissingDocs])

  useRealtime('documents', () => {
    refreshMissing()
  })
  useRealtime('tax_regimes_requirements', () => {
    refreshMissing()
  })

  const handleDismiss = useCallback(() => {
    if (!storageKey) return
    const ids = missingReqs.map((req) => req.id)
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(ids))
    } catch {
      // sem storage: dispensa vale só para esta renderização
    }
    setDismissedIds(ids)
  }, [storageKey, missingReqs])

  if (!ready || missingReqs.length === 0) return null
  // Só considera a dispensa válida se ela cobre TODAS as pendências atuais;
  // pendência nova (id fora da lista dispensada) reexibe o aviso.
  const dismissedSet = new Set(dismissedIds || [])
  const fullyDismissed = missingReqs.every((req) => dismissedSet.has(req.id))
  if (fullyDismissed) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 shadow-xs"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-amber-900 text-sm">Documentos pendentes</h3>
            <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700">
              {missingReqs.length}{' '}
              {missingReqs.length === 1 ? 'obrigação faltante' : 'obrigações faltantes'}
            </Badge>
          </div>
          <p className="text-xs text-amber-800 mt-0.5">
            Identificamos que sua empresa ainda não enviou alguns documentos obrigatórios. Envie
            pelos botões acima ou veja a lista completa em{' '}
            <Link to="/cliente/documentos" className="underline font-semibold hover:text-amber-900">
              Todos Documentos
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {missingReqs.map((req) => (
              <div
                key={req.id}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-amber-200 bg-white text-xs"
              >
                <span className="font-medium text-slate-800">{req.requirement_name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">Dia {req.due_day}</span>
                <Badge variant="outline" className="text-[10px]">
                  {FREQ_LABELS[req.frequency] || req.frequency}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/cliente/documentos"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900 underline underline-offset-2 whitespace-nowrap"
          >
            Enviar agora <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleDismiss}
            aria-label="Dispensar aviso de documentos pendentes"
            title="Dispensar aviso"
            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-100 hover:text-amber-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
