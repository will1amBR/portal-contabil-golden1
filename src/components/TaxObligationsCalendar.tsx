import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react'
import type { Company, TaxRegimeRequirement } from '@/services/api'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  isToday,
  addDays,
  setYear,
  setMonth,
  setDate,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TaxObligationsCalendarProps {
  companies: Company[]
  requirements: TaxRegimeRequirement[]
}

export interface ObligationEvent {
  id: string
  title: string
  dueDate: Date
  regime: 'simples' | 'presumido' | 'real'
  frequency: 'monthly' | 'annually' | 'quarterly'
  companyName: string
  companyCnpj: string
  status: 'overdue' | 'warning' | 'ontime'
  description?: string
  dueDay: number
}

const REGIME_NAMES: Record<string, string> = {
  simples: 'Simples Nacional',
  presumido: 'Lucro Presumido',
  real: 'Lucro Real',
}

const FREQUENCY_NAMES: Record<string, string> = {
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  annually: 'Anual',
}

export default function TaxObligationsCalendar({
  companies,
  requirements,
}: TaxObligationsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all')
  const [selectedEvent, setSelectedEvent] = useState<ObligationEvent | null>(null)

  const activeCompanies = useMemo(() => {
    return companies.filter((c) => c.status !== 'inactive')
  }, [companies])

  const targetCompanies = useMemo(() => {
    if (selectedCompanyId === 'all') return activeCompanies
    return activeCompanies.filter((c) => c.id === selectedCompanyId)
  }, [activeCompanies, selectedCompanyId])

  // Calculate obligations for the current visible month
  const obligations = useMemo(() => {
    const events: ObligationEvent[] = []
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    targetCompanies.forEach((comp) => {
      const regimeReqs = requirements.filter((r) => r.regime_type === comp.tax_regime)

      regimeReqs.forEach((req) => {
        // Determine whether this requirement applies in the current month
        let appliesThisMonth = false
        if (req.frequency === 'monthly') {
          appliesThisMonth = true
        } else if (req.frequency === 'quarterly') {
          // Typically due in months following quarter end: Jan(0), Apr(3), Jul(6), Oct(9) or Mar/Jun/Sep/Dec
          // Let's include quarterly deadlines in Mar, Jun, Sep, Dec and Apr, Jul, Oct, Jan
          appliesThisMonth = [0, 2, 3, 5, 6, 8, 9, 11].includes(month)
        } else if (req.frequency === 'annually') {
          // Annual deadlines usually in March, May, June or December
          appliesThisMonth = [2, 4, 5, 6, 11].includes(month)
        }

        if (appliesThisMonth) {
          // Ensure day does not exceed days in month
          const daysInMonth = new Date(year, month + 1, 0).getDate()
          const day = Math.min(req.due_day || 20, daysInMonth)
          const dueDate = new Date(year, month, day, 0, 0, 0)

          // Status calculation
          // overdue: dueDate < today
          // warning: today <= dueDate <= today + 5 days
          // ontime: dueDate > today + 5 days
          let status: 'overdue' | 'warning' | 'ontime' = 'ontime'
          const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

          if (diffDays < 0) {
            status = 'overdue'
          } else if (diffDays <= 5) {
            status = 'warning'
          } else {
            status = 'ontime'
          }

          events.push({
            id: `${comp.id}-${req.id}-${year}-${month}`,
            title: req.requirement_name,
            dueDate,
            regime: comp.tax_regime,
            frequency: req.frequency,
            companyName: comp.name,
            companyCnpj: comp.cnpj,
            status,
            dueDay: day,
          })
        }
      })
    })

    return events.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  }, [currentDate, targetCompanies, requirements])

  // Calendar grid days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = monthStart.getDay() // 0 = Sunday

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  // Summary counts
  const overdueCount = obligations.filter((o) => o.status === 'overdue').length
  const warningCount = obligations.filter((o) => o.status === 'warning').length
  const ontimeCount = obligations.filter((o) => o.status === 'ontime').length

  const getStatusBadge = (status: 'overdue' | 'warning' | 'ontime') => {
    switch (status) {
      case 'overdue':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 text-xs gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> Vencida
          </Badge>
        )
      case 'warning':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 text-xs gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Próxima do vencimento
          </Badge>
        )
      case 'ontime':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 text-xs gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Em dia
          </Badge>
        )
    }
  }

  const getStatusColor = (status: 'overdue' | 'warning' | 'ontime') => {
    switch (status) {
      case 'overdue':
        return 'bg-red-500 text-white hover:bg-red-600'
      case 'warning':
        return 'bg-amber-500 text-white hover:bg-amber-600'
      case 'ontime':
        return 'bg-emerald-600 text-white hover:bg-emerald-700'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-900 text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-emerald-400" />
                <CardTitle className="text-xl font-bold text-white">
                  Calendário de Obrigações Fiscais
                </CardTitle>
              </div>
              <CardDescription className="text-slate-300 mt-1">
                Acompanhe os prazos de entrega baseados no regime tributário das suas empresas.
              </CardDescription>
            </div>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-xs font-semibold text-slate-200">
                  {overdueCount} Vencidas
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold text-slate-200">
                  {warningCount} Próximas
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-200">{ontimeCount} Em dia</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Header controls: month navigation and company filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth} className="h-9 w-9">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-bold text-slate-800 capitalize min-w-[170px] text-center">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </h2>
              <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="text-xs text-emerald-600 hover:text-emerald-700 ml-1"
              >
                Mês Atual
              </Button>
            </div>

            {/* Company filter if multiple */}
            {activeCompanies.length > 1 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 whitespace-nowrap">Empresa:</span>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="text-xs border rounded-md px-3 py-1.5 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-auto"
                >
                  <option value="all">Todas as empresas ({activeCompanies.length})</option>
                  {activeCompanies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({REGIME_NAMES[c.tax_regime] || c.tax_regime})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Calendar Grid */}
          <div className="mt-6">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
                <div
                  key={day}
                  className={`text-xs font-bold py-1.5 rounded uppercase tracking-wider ${
                    i === 0 || i === 6 ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty padding cells for days before start of month */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="min-h-[85px] sm:min-h-[105px] p-1.5 bg-slate-50/50 rounded-lg border border-dashed border-slate-200/60"
                />
              ))}

              {/* Day cells */}
              {daysInMonth.map((day) => {
                const dayObligations = obligations.filter((o) => isSameDay(o.dueDate, day))
                const isCurrentDay = isToday(day)

                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[85px] sm:min-h-[105px] p-1.5 rounded-lg border transition-all flex flex-col justify-between ${
                      isCurrentDay
                        ? 'bg-emerald-50/40 border-emerald-400 ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                          isCurrentDay ? 'bg-emerald-600 text-white font-bold' : 'text-slate-700'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                      {dayObligations.length > 0 && (
                        <span className="text-[10px] text-slate-400 hidden sm:inline">
                          {dayObligations.length}{' '}
                          {dayObligations.length === 1 ? 'obrig.' : 'obrigs.'}
                        </span>
                      )}
                    </div>

                    {/* Events list in day cell */}
                    <div className="space-y-1 overflow-hidden">
                      {dayObligations.slice(0, 2).map((ob) => (
                        <button
                          key={ob.id}
                          onClick={() => setSelectedEvent(ob)}
                          className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center gap-1 shadow-2xs transition-all ${getStatusColor(
                            ob.status,
                          )}`}
                          title={`${ob.title} - ${ob.companyName}`}
                        >
                          <span className="truncate">{ob.title}</span>
                        </button>
                      ))}

                      {dayObligations.length > 2 && (
                        <button
                          onClick={() => setSelectedEvent(dayObligations[2])}
                          className="w-full text-center text-[9px] text-slate-500 font-medium hover:text-slate-700 py-0.5"
                        >
                          +{dayObligations.length - 2} mais
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-700">Legenda:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-500" />
                <span>Vencida (prazo expirado)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>Próxima (≤ 5 dias)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600" />
                <span>Em dia</span>
              </div>
            </div>
            <div className="text-slate-400 italic">
              Clique em qualquer obrigação para ver todos os detalhes e orientações.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List of obligations for this month */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Lista de Obrigações do Mês ({obligations.length})</span>
            <span className="text-xs font-normal text-slate-500 capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          {obligations.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              Nenhuma obrigação fiscal prevista para este mês ou empresa selecionada.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {obligations.map((ob) => (
                <div
                  key={ob.id}
                  onClick={() => setSelectedEvent(ob)}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {ob.status === 'overdue' && (
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                      {ob.status === 'warning' && (
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                      {ob.status === 'ontime' && (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        {ob.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {ob.companyName} &bull; Regime: {REGIME_NAMES[ob.regime] || ob.regime}{' '}
                        &bull; Frequência: {FREQUENCY_NAMES[ob.frequency] || ob.frequency}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center w-full sm:w-auto">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800">
                        Vencimento: {format(ob.dueDate, 'dd/MM/yyyy')}
                      </p>
                      <p className="text-[11px] text-slate-500">Dia {ob.dueDay}</p>
                    </div>
                    {getStatusBadge(ob.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Details */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Detalhes da Obrigação
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-500">
              Informações detalhadas sobre o cumprimento desta entrega fiscal.
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4 text-sm mt-2">
              <div className="bg-slate-50 p-4 rounded-lg border space-y-2.5">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Obrigação:</span>
                  <p className="font-semibold text-slate-900 text-base">{selectedEvent.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Empresa:</span>
                    <p className="font-medium text-slate-800">{selectedEvent.companyName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium">CNPJ:</span>
                    <p className="font-medium text-slate-800">{selectedEvent.companyCnpj || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Regime Tributário:</span>
                    <p className="font-medium text-slate-800">
                      {REGIME_NAMES[selectedEvent.regime] || selectedEvent.regime}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Periodicidade:</span>
                    <p className="font-medium text-slate-800">
                      {FREQUENCY_NAMES[selectedEvent.frequency] || selectedEvent.frequency}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Data Limite:</span>
                    <p className="font-bold text-slate-900 text-base">
                      {format(selectedEvent.dueDate, 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Status Atual:</span>
                    <div className="mt-1">{getStatusBadge(selectedEvent.status)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/70 p-3.5 rounded-lg border border-blue-100 text-blue-900 text-xs leading-relaxed">
                <p className="font-semibold mb-1">Dica Contábil:</p>
                As guias e comprovantes vinculados a esta obrigação são processados e
                disponibilizados na aba <strong>Guias Fiscais</strong> e <strong>Documentos</strong>{' '}
                pela contabilidade. Caso tenha dúvidas, consulte seu contador pelo chat do portal.
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-slate-900 hover:bg-slate-800"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
