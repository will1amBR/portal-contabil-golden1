import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, XCircle, AlertCircle, Sparkles } from 'lucide-react'

interface ValidationBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'pending_confirmation' | string
  className?: string
  size?: 'sm' | 'md'
}

export function ValidationBadge({ status, className = '', size = 'sm' }: ValidationBadgeProps) {
  switch (status) {
    case 'approved':
      return (
        <Badge
          className={`bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-medium inline-flex items-center gap-1.5 shadow-none ${
            size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
          } ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Aprovado</span>
        </Badge>
      )
    case 'rejected':
      return (
        <Badge
          className={`bg-red-50 text-red-700 border-red-200 hover:bg-red-50 font-medium inline-flex items-center gap-1.5 shadow-none ${
            size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
          } ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 text-red-600" />
          <span>Rejeitado</span>
        </Badge>
      )
    case 'pending_confirmation':
      return (
        <Badge
          className={`bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 font-medium inline-flex items-center gap-1.5 shadow-none ${
            size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
          } ${className}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span>Aguardando Confirmação</span>
        </Badge>
      )
    case 'pending':
    default:
      return (
        <Badge
          className={`bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-medium inline-flex items-center gap-1.5 shadow-none ${
            size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
          } ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Em Validação</span>
        </Badge>
      )
  }
}
