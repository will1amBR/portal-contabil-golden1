import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
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

export function RequiredDocsModal() {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const [missingReqs, setMissingReqs] = useState<TaxRegimeRequirement[]>([])
  const [dismissed, setDismissed] = useState<string | null>(null)

  useEffect(() => {
    setDismissed(null)
  }, [location.pathname])

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'client') return

    const checkMissingDocs = async () => {
      try {
        const companies = await getCompaniesByOwner(user.id)
        if (companies.length === 0) return

        const company = companies[0]
        const requirements = await getTaxRegimesRequirements(company.tax_regime)
        const documents = await getDocuments({ companyId: company.id })

        const missing = requirements.filter((req) => {
          const reqName = req.requirement_name.toLowerCase()
          return !documents.some((doc) => doc.title?.toLowerCase().includes(reqName))
        })

        setMissingReqs(missing)
      } catch {
        setMissingReqs([])
      }
    }

    checkMissingDocs()
  }, [isAuthenticated, user, location.pathname])

  const shouldShow = missingReqs.length > 0 && dismissed !== location.pathname

  return (
    <Dialog
      open={shouldShow}
      onOpenChange={(v) => {
        if (!v) setDismissed(location.pathname)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle>Documentos pendentes</DialogTitle>
              <DialogDescription>
                Identificamos que sua empresa ainda não enviou alguns documentos obrigatórios.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {missingReqs.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-slate-50"
            >
              <div>
                <p className="font-medium text-slate-900">{req.requirement_name}</p>
                <p className="text-xs text-slate-500 mt-0.5">Dia {req.due_day} de vencimento</p>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {FREQ_LABELS[req.frequency] || req.frequency}
              </Badge>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
