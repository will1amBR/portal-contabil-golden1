import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getLeads, updateLeadStatus, deleteLead, type Lead, type LeadStatus } from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  UserPlus,
  Mail,
  Phone,
  Building2,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Trophy,
  Archive,
  Eye,
  Trash2,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Loader2,
  Briefcase,
  Layers,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'

export const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  {
    label: string
    shortLabel: string
    badgeColor: string
    badgeBg: string
    dotColor: string
    icon: any
    description: string
  }
> = {
  new: {
    label: 'Novo Contato',
    shortLabel: 'Novos',
    badgeColor: 'text-blue-700 border-blue-200',
    badgeBg: 'bg-blue-50',
    dotColor: 'bg-blue-500',
    icon: UserPlus,
    description: 'Lead recém-chegado da landing page aguardando primeiro contato.',
  },
  contacted: {
    label: 'Em Contato',
    shortLabel: 'Em Contato',
    badgeColor: 'text-amber-700 border-amber-200',
    badgeBg: 'bg-amber-50',
    dotColor: 'bg-amber-500',
    icon: Clock,
    description: 'Equipe em conversa ativa ou alinhando necessidades da empresa.',
  },
  proposal_sent: {
    label: 'Proposta Enviada',
    shortLabel: 'Proposta',
    badgeColor: 'text-purple-700 border-purple-200',
    badgeBg: 'bg-purple-50',
    dotColor: 'bg-purple-500',
    icon: Send,
    description: 'Proposta comercial de honorários contábeis enviada para avaliação.',
  },
  won: {
    label: 'Fechado (Ganho)',
    shortLabel: 'Fechados',
    badgeColor: 'text-emerald-700 border-emerald-200',
    badgeBg: 'bg-emerald-50',
    dotColor: 'bg-emerald-500',
    icon: Trophy,
    description: 'Contrato firmado! Cliente pronto para onboarding no portal.',
  },
  archived: {
    label: 'Arquivado',
    shortLabel: 'Arquivados',
    badgeColor: 'text-slate-600 border-slate-200',
    badgeBg: 'bg-slate-100',
    dotColor: 'bg-slate-400',
    icon: Archive,
    description: 'Sem interesse no momento ou contato postergado.',
  },
}

const REGIME_LABELS: Record<string, string> = {
  simples: 'Simples Nacional',
  presumido: 'Lucro Presumido',
  real: 'Lucro Real',
  mei: 'MEI',
  nao_sei: 'A Definir / Consultoria',
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { toast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getLeads()
      setLeads(data)
    } catch {
      toast({
        title: 'Erro ao carregar leads',
        description: 'Não foi possível carregar a lista de contatos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('leads', () => {
    loadData()
  })

  // Status counts for top metric badges
  const statusCounts = useMemo(() => {
    const counts = {
      all: leads.length,
      new: 0,
      contacted: 0,
      proposal_sent: 0,
      won: 0,
      archived: 0,
    }
    leads.forEach((l) => {
      const st = l.status as LeadStatus
      if (counts[st] !== undefined) {
        counts[st]++
      }
    })
    return counts
  }, [leads])

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
      const term = searchTerm.toLowerCase().trim()
      if (!term) return matchesStatus

      const matchesSearch =
        lead.name.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        (lead.company_name && lead.company_name.toLowerCase().includes(term)) ||
        (lead.cnpj && lead.cnpj.toLowerCase().includes(term)) ||
        (lead.phone && lead.phone.toLowerCase().includes(term))

      return matchesStatus && matchesSearch
    })
  }, [leads, statusFilter, searchTerm])

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setUpdatingId(leadId)
    try {
      await updateLeadStatus(leadId, newStatus)
      // Update local state immediately for snappy UI
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)))
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
      toast({
        title: 'Status atualizado',
        description: `Lead alterado para "${LEAD_STATUS_CONFIG[newStatus].label}".`,
      })
    } catch {
      toast({
        title: 'Erro ao atualizar status',
        description: 'Não foi possível salvar o novo status do lead.',
        variant: 'destructive',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (lead: Lead) => {
    if (!confirm(`Deseja realmente remover o lead "${lead.name}"?`)) return
    setUpdatingId(lead.id)
    try {
      await deleteLead(lead.id)
      setLeads((prev) => prev.filter((l) => l.id !== lead.id))
      if (selectedLead?.id === lead.id) {
        setIsDetailOpen(false)
        setSelectedLead(null)
      }
      toast({
        title: 'Lead removido',
        description: 'O contato foi excluído da base com sucesso.',
      })
    } catch {
      toast({
        title: 'Erro ao remover lead',
        description: 'Não foi possível excluir o contato.',
        variant: 'destructive',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const handleOpenDetail = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Funil de Novos Clientes &bull; Landing Page Golden</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Gestão de Contatos & Leads
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Acompanhe empresas e interessados que solicitaram proposta através da página
              institucional. Gerencie cada etapa do contato até o fechamento.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/admin/leads/conversao">
              <Button
                variant="outline"
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40 text-xs h-10 font-semibold gap-2 shadow-sm"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Relatório de Conversão</span>
              </Button>
            </Link>

            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 px-3.5 rounded-xl text-xs">
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Total no Funil</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">
                  {leads.length} Leads
                </span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Novos</span>
                <span className="text-xl font-bold text-amber-400 font-mono">
                  {statusCounts.new}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric / Status Tabs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* All tab */}
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
            statusFilter === 'all'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Todos</span>
            <Layers className="w-4 h-4 opacity-70" />
          </div>
          <span className="text-2xl font-extrabold mt-2 font-mono">{statusCounts.all}</span>
        </button>

        {/* New */}
        <button
          onClick={() => setStatusFilter('new')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
            statusFilter === 'new'
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-950/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Novos</span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                statusCounts.new > 0 ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
          </div>
          <span className="text-2xl font-extrabold mt-2 font-mono text-blue-600 group-hover:text-blue-700">
            {statusFilter === 'new' ? (
              statusCounts.new
            ) : (
              <span className="text-blue-600">{statusCounts.new}</span>
            )}
          </span>
        </button>

        {/* Contacted */}
        <button
          onClick={() => setStatusFilter('contacted')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
            statusFilter === 'contacted'
              ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-950/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Em Contato</span>
            <Clock className="w-4 h-4 opacity-70 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold mt-2 font-mono">
            {statusFilter === 'contacted' ? (
              statusCounts.contacted
            ) : (
              <span className="text-amber-600">{statusCounts.contacted}</span>
            )}
          </span>
        </button>

        {/* Proposal Sent */}
        <button
          onClick={() => setStatusFilter('proposal_sent')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
            statusFilter === 'proposal_sent'
              ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-950/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Proposta</span>
            <Send className="w-4 h-4 opacity-70 text-purple-500" />
          </div>
          <span className="text-2xl font-extrabold mt-2 font-mono">
            {statusFilter === 'proposal_sent' ? (
              statusCounts.proposal_sent
            ) : (
              <span className="text-purple-600">{statusCounts.proposal_sent}</span>
            )}
          </span>
        </button>

        {/* Won / Fechado */}
        <button
          onClick={() => setStatusFilter('won')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
            statusFilter === 'won'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Fechados</span>
            <Trophy className="w-4 h-4 opacity-70 text-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold mt-2 font-mono">
            {statusFilter === 'won' ? (
              statusCounts.won
            ) : (
              <span className="text-emerald-600">{statusCounts.won}</span>
            )}
          </span>
        </button>

        {/* Archived */}
        <button
          onClick={() => setStatusFilter('archived')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
            statusFilter === 'archived'
              ? 'bg-slate-800 text-white border-slate-700 shadow-md shadow-slate-950/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Arquivados</span>
            <Archive className="w-4 h-4 opacity-70 text-slate-400" />
          </div>
          <span className="text-2xl font-extrabold mt-2 font-mono">
            {statusFilter === 'archived' ? (
              statusCounts.archived
            ) : (
              <span className="text-slate-600">{statusCounts.archived}</span>
            )}
          </span>
        </button>
      </div>

      {/* Search and Filters Controls */}
      <Card className="border border-slate-200 bg-white shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Buscar por nome, e-mail, empresa ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500">Filtrar status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status ({leads.length})</SelectItem>
                <SelectItem value="new">Novos ({statusCounts.new})</SelectItem>
                <SelectItem value="contacted">Em Contato ({statusCounts.contacted})</SelectItem>
                <SelectItem value="proposal_sent">
                  Proposta Enviada ({statusCounts.proposal_sent})
                </SelectItem>
                <SelectItem value="won">Fechados / Ganhos ({statusCounts.won})</SelectItem>
                <SelectItem value="archived">Arquivados ({statusCounts.archived})</SelectItem>
              </SelectContent>
            </Select>

            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="h-9 text-xs text-slate-500"
              >
                Limpar busca
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Leads Table */}
      {filteredLeads.length === 0 ? (
        <Card className="border border-slate-200 bg-white shadow-xs">
          <CardContent className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Nenhum lead encontrado</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'Nenhum contato corresponde aos filtros de busca selecionados.'
                : 'Ainda não há solicitações de contratação registradas.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b border-slate-200">
                  <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Contato / Lead
                  </TableHead>
                  <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Empresa & CNPJ
                  </TableHead>
                  <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Regime & Porte
                  </TableHead>
                  <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Data do Contato
                  </TableHead>
                  <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Status Atual
                  </TableHead>
                  <TableHead className="py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const statusConf =
                    LEAD_STATUS_CONFIG[lead.status as LeadStatus] || LEAD_STATUS_CONFIG.new
                  const isUpdating = updatingId === lead.id

                  return (
                    <TableRow key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Contact */}
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <a
                                href={`mailto:${lead.email}`}
                                className="hover:text-emerald-600 underline"
                              >
                                {lead.email}
                              </a>
                            </span>
                            {lead.phone && (
                              <>
                                <span>&bull;</span>
                                <span className="flex items-center gap-1 font-mono text-[11px]">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <a
                                    href={`tel:${lead.phone.replace(/\D/g, '')}`}
                                    className="hover:text-emerald-600"
                                  >
                                    {lead.phone}
                                  </a>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Company & CNPJ */}
                      <TableCell className="py-4 text-xs">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lead.company_name || 'Não informada'}</span>
                        </div>
                        {lead.cnpj && (
                          <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                            CNPJ: {lead.cnpj}
                          </span>
                        )}
                      </TableCell>

                      {/* Regime & Employees */}
                      <TableCell className="py-4 text-xs">
                        <div className="space-y-1">
                          <Badge className="bg-slate-100 text-slate-800 border-slate-200 text-[10px] font-medium">
                            {REGIME_LABELS[lead.tax_regime || 'simples'] || lead.tax_regime}
                          </Badge>
                          {lead.employees_count && (
                            <span className="text-[11px] text-slate-500 block">
                              {lead.employees_count} funcionários
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Created Date */}
                      <TableCell className="py-4 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{format(parseISO(lead.created), 'dd/MM/yyyy HH:mm')}</span>
                        </div>
                      </TableCell>

                      {/* Status Dropdown */}
                      <TableCell className="py-4">
                        <div className="w-44">
                          <Select
                            value={lead.status}
                            onValueChange={(val) => handleStatusChange(lead.id, val as LeadStatus)}
                            disabled={isUpdating}
                          >
                            <SelectTrigger
                              className={`h-8 text-xs font-semibold border ${statusConf.badgeBg} ${statusConf.badgeColor}`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${statusConf.dotColor}`} />
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="new" className="text-xs">
                                🔵 Novo Contato
                              </SelectItem>
                              <SelectItem value="contacted" className="text-xs">
                                🟡 Em Contato
                              </SelectItem>
                              <SelectItem value="proposal_sent" className="text-xs">
                                🟣 Proposta Enviada
                              </SelectItem>
                              <SelectItem value="won" className="text-xs">
                                🟢 Fechado (Ganho)
                              </SelectItem>
                              <SelectItem value="archived" className="text-xs">
                                ⚪ Arquivado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDetail(lead)}
                            className="h-8 text-xs text-slate-700 hover:text-emerald-700 hover:border-emerald-300"
                            title="Ver ficha completa do lead"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            <span>Ver Dados</span>
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(lead)}
                            disabled={isUpdating}
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Excluir contato"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Lead Details Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-xl bg-white p-6">
          {selectedLead && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ficha Cadastral do Lead</span>
                  </div>
                  <Badge
                    className={`text-xs ${
                      LEAD_STATUS_CONFIG[selectedLead.status as LeadStatus]?.badgeBg
                    } ${LEAD_STATUS_CONFIG[selectedLead.status as LeadStatus]?.badgeColor}`}
                  >
                    {LEAD_STATUS_CONFIG[selectedLead.status as LeadStatus]?.label}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-extrabold text-slate-900 mt-2">
                  {selectedLead.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Cadastrado via formulário de contratação em{' '}
                  {format(parseISO(selectedLead.created), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </DialogDescription>
              </DialogHeader>

              {/* Status Quick Changer inside modal */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Atualizar Estágio do Lead:</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {LEAD_STATUS_CONFIG[selectedLead.status as LeadStatus]?.description}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['new', 'contacted', 'proposal_sent', 'won', 'archived'] as LeadStatus[]).map(
                    (st) => {
                      const active = selectedLead.status === st
                      const conf = LEAD_STATUS_CONFIG[st]
                      return (
                        <Button
                          key={st}
                          size="sm"
                          variant={active ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(selectedLead.id, st)}
                          className={`text-xs h-8 ${
                            active
                              ? 'bg-slate-900 text-white hover:bg-slate-800'
                              : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-1.5 ${conf.dotColor}`} />
                          {conf.shortLabel}
                        </Button>
                      )
                    },
                  )}
                </div>
              </div>

              {/* Grid of contact and company info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-medium">E-mail Corporativo</span>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="font-bold text-slate-900 hover:text-emerald-600 underline flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {selectedLead.email}
                  </a>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-medium">Telefone / WhatsApp</span>
                  <span className="font-bold text-slate-900 font-mono flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {selectedLead.phone || 'Não informado'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-medium">Empresa</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {selectedLead.company_name || 'Não informada'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-medium">CNPJ</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {selectedLead.cnpj || 'Não informado'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-medium">Regime Tributário</span>
                  <span className="font-bold text-slate-900">
                    {REGIME_LABELS[selectedLead.tax_regime || 'simples'] || selectedLead.tax_regime}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-medium">Faixa de Funcionários</span>
                  <span className="font-bold text-slate-900">
                    {selectedLead.employees_count || 'Não informado'}
                  </span>
                </div>
              </div>

              {/* Message from Lead */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  Mensagem / Demanda Informada:
                </span>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed min-h-[70px]">
                  {selectedLead.message || (
                    <span className="text-slate-400 italic">
                      Nenhuma observação ou mensagem enviada no formulário.
                    </span>
                  )}
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(selectedLead)}
                  className="text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Excluir Lead
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDetailOpen(false)}
                    className="text-xs"
                  >
                    Fechar
                  </Button>
                  {selectedLead.email && (
                    <a href={`mailto:${selectedLead.email}`}>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" /> Enviar E-mail
                      </Button>
                    </a>
                  )}
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
