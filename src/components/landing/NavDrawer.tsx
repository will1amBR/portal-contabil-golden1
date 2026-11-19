import { Link } from 'react-router-dom'
import {
  Building2,
  Lock,
  ArrowRight,
  ChevronDown,
  ListTree,
  HelpCircle,
  Layers,
  Mail,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

interface NavDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pathname: string
  onSelectPlanCta?: (regime?: string) => void
}

interface DrawerLinkProps {
  to: string
  onClick?: () => void
  active?: boolean
  children: React.ReactNode
  trailing?: React.ReactNode
}

function DrawerLink({ to, onClick, active, children, trailing }: DrawerLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center justify-between gap-3 px-4 min-h-12 rounded-xl text-base ${
        active ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-800 font-semibold'
      } hover:bg-stone-100 active:bg-stone-200 transition-colors focus-visible:outline-2 focus-visible:outline-amber-600`}
    >
      <span className="flex items-center gap-2.5 min-w-0">{children}</span>
      {trailing !== undefined ? (
        trailing
      ) : (
        <ChevronDown className="w-4 h-4 -rotate-90 text-stone-400 shrink-0" />
      )}
    </Link>
  )
}

export function NavDrawer({ open, onOpenChange, pathname, onSelectPlanCta }: NavDrawerProps) {
  const close = () => onOpenChange(false)
  const isActive = (path: string) => pathname === path

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="inset-y-0 right-0 h-full w-full max-w-xs sm:w-[22rem] sm:max-w-[22rem] bg-white border-l border-stone-200 p-0 flex flex-col"
      >
        <SheetHeader className="pl-4 pr-12 pt-5 pb-3 border-b border-stone-200">
          <SheetTitle asChild>
            <Link
              to="/"
              onClick={close}
              className="flex items-center gap-2.5 min-w-0 focus-visible:outline-2 focus-visible:outline-amber-600 rounded-lg"
            >
              <span className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-amber-800" />
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-slate-950 text-base leading-tight">
                  Golden Contabilidade
                </span>
                <span className="block text-[11px] text-amber-800 font-semibold uppercase tracking-wide truncate leading-tight">
                  Portal Contábil Integrado
                </span>
              </span>
            </Link>
          </SheetTitle>
          <SheetDescription className="sr-only">Menu de navegação do portal</SheetDescription>
        </SheetHeader>

        <nav
          aria-label="Menu mobile"
          className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1.5"
        >
          <DrawerLink to="/" onClick={close} active={isActive('/')}>
            Home
          </DrawerLink>
          <DrawerLink to="/institucional" onClick={close} active={isActive('/institucional')}>
            Institucional
          </DrawerLink>
          <DrawerLink
            to="/planos"
            onClick={close}
            active={isActive('/planos')}
            trailing={
              <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-300 shrink-0">
                Tabela
              </span>
            }
          >
            Planos & Preços
          </DrawerLink>
          <DrawerLink to="/institucional#funcionalidades" onClick={close}>
            <ListTree className="w-5 h-5 text-amber-700" />
            Funcionalidades
          </DrawerLink>
          <DrawerLink to="/institucional#faq" onClick={close}>
            <HelpCircle className="w-5 h-5 text-amber-700" />
            Perguntas Frequentes
          </DrawerLink>
          <DrawerLink
            to="/contratar"
            onClick={close}
            active={isActive('/contratar')}
            trailing={<ChevronDown className="w-4 h-4 -rotate-90 text-stone-400 shrink-0" />}
          >
            <span className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-amber-700" />
              Contratar / Proposta
            </span>
          </DrawerLink>
        </nav>

        <div className="border-t border-stone-200 p-4 flex flex-col gap-2.5 bg-[#faf8f5]">
          <Link
            to="/contratar"
            onClick={() => {
              close()
              if (onSelectPlanCta) onSelectPlanCta('simples')
            }}
          >
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 text-base shadow-xs gap-2">
              Solicitar Proposta Agora <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/login" onClick={close}>
            <Button
              variant="outline"
              className="w-full bg-white text-slate-800 border-stone-300 text-sm font-semibold h-12 shadow-2xs gap-2"
            >
              <Lock className="w-4 h-4 text-amber-700" />
              Área do Cliente (Login)
            </Button>
          </Link>
          <div className="pt-2 mt-1 border-t border-stone-200 space-y-1.5">
            <p className="text-xs text-stone-600 flex items-center gap-2 px-1">
              <Mail className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              contato@golden.com.br
            </p>
            <p className="text-xs text-stone-600 flex items-center gap-2 px-1">
              <Phone className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              (11) 3456-7890 • dias úteis, 8h às 18h
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
