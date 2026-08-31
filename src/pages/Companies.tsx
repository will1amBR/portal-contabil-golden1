import { useEffect, useState } from 'react'
import { getCompanies, type Company } from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Search, Users, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'

const REGIME_NAMES: Record<string, string> = {
  simples: 'Simples Nacional',
  presumido: 'Lucro Presumido',
  real: 'Lucro Real',
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [search, setSearch] = useState('')

  const load = () => getCompanies().then(setCompanies)
  useEffect(() => {
    load()
  }, [])
  useRealtime('companies', () => {
    load()
  })

  const filtered = companies.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.cnpj.includes(search),
  )

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Empresas & Clientes
            </h1>
            <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
              {companies.length} cadastradas
            </Badge>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Diretório de empresas sob gestão contábil da Golden e seus regimes tributários.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <Input
          placeholder="Buscar por razão social ou CNPJ..."
          className="pl-9 h-10 bg-white border-slate-200 shadow-xs text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((company) => (
          <Card
            key={company.id}
            className="border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all bg-white rounded-xl overflow-hidden"
          >
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-base text-slate-900 truncate leading-snug">
                    {company.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">CNPJ: {company.cnpj}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  {REGIME_NAMES[company.tax_regime] || company.tax_regime}
                </Badge>

                {company.status === 'active' ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 shadow-none text-xs gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ativa
                  </Badge>
                ) : (
                  <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-xs gap-1">
                    <XCircle className="w-3 h-3" /> Inativa
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
            Nenhuma empresa encontrada com os termos buscados.
          </div>
        )}
      </div>
    </div>
  )
}
