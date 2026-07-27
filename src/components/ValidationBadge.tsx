import { Badge } from '@/components/ui/badge'

const CONFIG: Record<string, { label: string; className: string }> = {
  pending_confirmation: {
    label: 'Aguardando confirmação da contabilidade',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  pending: {
    label: 'Em validação',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  approved: {
    label: 'Aprovado',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  },
  rejected: { label: 'Rejeitado', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
}

export function ValidationBadge({ status }: { status: string }) {
  const config = CONFIG[status] || CONFIG.pending
  return <Badge className={config.className}>{config.label}</Badge>
}
