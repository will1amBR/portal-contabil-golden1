import { useEffect, useState } from 'react'
import { getCompanies, type Company } from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

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
    <div className="max-w-5xl mx-auto pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Empresas</h1>
        <p className="text-slate-500 mt-1">Diretório de clientes e seus regimes tributários.</p>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <Input
          placeholder="Buscar por nome ou CNPJ..."
          className="pl-9 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((company) => (
          <Card
            key={company.id}
            className="border-0 shadow-subtle hover:shadow-elevation transition-shadow"
          >
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-slate-900">{company.name}</h3>
                <p className="text-sm text-slate-500 font-mono mt-1">CNPJ: {company.cnpj}</p>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="outline" className="bg-slate-50 uppercase text-[10px]">
                    {company.tax_regime.replace('_', ' ')}
                  </Badge>
                  {company.status === 'active' ? (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none text-[10px]">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      Inativo
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">
            Nenhuma empresa encontrada.
          </div>
        )}
      </div>
    </div>
  )
}
