import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  getCompanies,
  getTaxRegimesRequirements,
  getDocuments,
  type Company,
  type TaxRegimeRequirement,
  type Document,
} from '@/services/api'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { format, isSameMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface PortalNotificationItem {
  id: string
  title: string
  subtitle: string
  companyName: string
  dueDate: Date
  dueFormatted: string
  urgency: 'overdue' | 'warning' | 'ontime' // red, yellow, green
  daysLeft: number
  link: string
  type: 'tax_deadline' | 'pending_doc' | 'confirmation_needed'
}

export function NotificationBell() {
  const { user, isAccountant } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [requirements, setRequirements] = useState<TaxRegimeRequirement[]>([])
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [c, r, d] = await Promise.all([
        getCompanies(),
        getTaxRegimesRequirements(),
        getDocuments(),
      ])
      setCompanies(c.filter((comp) => comp.status !== 'inactive'))
      setRequirements(r)
      setDocs(d)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('documents', () => {
    loadData()
  })

  useRealtime('companies', () => {
    loadData()
  })

  // Build real notifications based on user role and calendar
  const notifications = useMemo(() => {
    const list: PortalNotificationItem[] = []
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    // Filter relevant companies
    let targetComps = companies
    if (!isAccountant && user) {
      targetComps = companies.filter((c) => c.owner === user.id)
    }

    // 1. Tax calendar obligations due in current month (or next 15 days)
    targetComps.forEach((comp) => {
      const regimeReqs = requirements.filter((r) => r.regime_type === comp.tax_regime)

      regimeReqs.forEach((req) => {
        let applies = false
        if (req.frequency === 'monthly') applies = true
        else if (req.frequency === 'quarterly')
          applies = [0, 2, 3, 5, 6, 8, 9, 11].includes(currentMonth)
        else if (req.frequency === 'annually') applies = [2, 4, 5, 6, 11].includes(currentMonth)

        if (!applies) return

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
        const day = Math.min(req.due_day || 20, daysInMonth)
        const dueDate = new Date(currentYear, currentMonth, day, 0, 0, 0)

        const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        let urgency: 'overdue' | 'warning' | 'ontime' = 'ontime'
        if (diffDays < 0) {
          urgency = 'overdue'
        } else if (diffDays <= 5) {
          urgency = 'warning'
        } else {
          urgency = 'ontime'
        }

        list.push({
          id: `tax-${comp.id}-${req.id}-${currentYear}-${currentMonth}`,
          title: req.requirement_name,
          subtitle:
            diffDays < 0
              ? `Venceu há ${Math.abs(diffDays)} dia(s)`
              : diffDays === 0
                ? 'Vence hoje!'
                : diffDays === 1
                  ? 'Vence amanhã'
                  : `Vence em ${diffDays} dias`,
          companyName: comp.name,
          dueDate,
          dueFormatted: format(dueDate, 'dd/MM/yyyy'),
          urgency,
          daysLeft: diffDays,
          link: isAccountant ? '/relatorios' : '/cliente/dashboard',
          type: 'tax_deadline',
        })
      })
    })

    // 2. Pending confirmations for accountant
    if (isAccountant) {
      const confDocs = docs.filter((d) => d.validation_status === 'pending_confirmation')
      if (confDocs.length > 0) {
        list.push({
          id: 'triagem-ia-docs',
          title: `${confDocs.length} documento(s) aguardando confirmação`,
          subtitle: 'A IA realizou a pré-classificação e aguarda validação do contador',
          companyName: 'Todas as Empresas',
          dueDate: today,
          dueFormatted: 'Hoje',
          urgency: 'warning',
          daysLeft: 0,
          link: '/admin/documentos/confirmacao',
          type: 'confirmation_needed',
        })
      }
    }

    // Sort by urgency: overdue first (negative daysLeft), then warning (<=5), then ontime
    return list.sort((a, b) => {
      const score = (item: PortalNotificationItem) => {
        if (item.urgency === 'overdue') return 1000 - item.daysLeft
        if (item.urgency === 'warning') return 500 - item.daysLeft
        return 100 - item.daysLeft
      }
      return score(b) - score(a)
    })
  }, [companies, requirements, docs, isAccountant, user])

  const overdueItems = notifications.filter((n) => n.urgency === 'overdue')
  const warningItems = notifications.filter((n) => n.urgency === 'warning')
  const urgentCount = overdueItems.length + warningItems.length
  const totalCount = notifications.length

  const getUrgencyIcon = (urgency: 'overdue' | 'warning' | 'ontime') => {
    switch (urgency) {
      case 'overdue':
        return (
          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        )
      case 'warning':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        )
      case 'ontime':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )
    }
  }

  const getUrgencyBadge = (urgency: 'overdue' | 'warning' | 'ontime', daysLeft: number) => {
    switch (urgency) {
      case 'overdue':
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5">
            Vencida
          </Badge>
        )
      case 'warning':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-semibold px-2 py-0.5">
            ≤ 5 dias
          </Badge>
        )
      case 'ontime':
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold px-2 py-0.5">
            Em dia
          </Badge>
        )
    }
  }

  const handleItemClick = (link: string) => {
    setOpen(false)
    navigate(link)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors focus:outline-none"
          title="Notificações e Prazos Fiscais"
        >
          <Bell className="w-5 h-5" />
          {urgentCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-pulse">
              {urgentCount > 9 ? '9+' : urgentCount}
            </span>
          ) : totalCount > 0 ? (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          ) : null}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[380px] sm:w-[420px] p-0 bg-white rounded-2xl shadow-2xl border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Central de Alertas & Prazos</h3>
              <p className="text-[11px] text-slate-300">
                {isAccountant ? 'Visão global das empresas clientes' : 'Obrigações e pendências'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            {overdueItems.length > 0 && (
              <Badge className="bg-red-500/30 text-red-300 border-red-500/40 text-[10px] px-1.5">
                {overdueItems.length} vencida(s)
              </Badge>
            )}
            {warningItems.length > 0 && (
              <Badge className="bg-amber-500/30 text-amber-300 border-amber-500/40 text-[10px] px-1.5">
                {warningItems.length} próx.
              </Badge>
            )}
          </div>
        </div>

        {/* Legend strip */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Vencido
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Até 5 dias
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> Em dia
            </span>
          </div>
          <span className="text-slate-400 font-medium">{notifications.length} itens</span>
        </div>

        {/* Scrollable list */}
        <ScrollArea className="max-h-[360px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Tudo em dia!</p>
              <p className="text-[11px]">Nenhuma obrigação pendente ou próxima do vencimento.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.link)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50/80 cursor-pointer transition-colors ${
                    item.urgency === 'overdue'
                      ? 'bg-red-50/20'
                      : item.urgency === 'warning'
                        ? 'bg-amber-50/20'
                        : ''
                  }`}
                >
                  {getUrgencyIcon(item.urgency)}

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 leading-tight">{item.title}</p>
                      {getUrgencyBadge(item.urgency, item.daysLeft)}
                    </div>

                    <p className="text-[11px] font-medium text-slate-600">{item.subtitle}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1 truncate max-w-[200px]">
                        <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{item.companyName}</span>
                      </span>
                      <span className="font-mono text-slate-500 font-semibold">
                        {item.dueFormatted}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link
            to={isAccountant ? '/relatorios' : '/cliente/dashboard'}
            onClick={() => setOpen(false)}
            className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" /> Abrir Calendário Completo
          </Link>
          <span className="text-[10px] text-slate-400">Portal Golden</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
