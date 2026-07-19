import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createDocument, type Company } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import { UploadCloud } from 'lucide-react'

export function DocumentUpload({
  companies,
  onSuccess,
}: {
  companies: Company[]
  onSuccess: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title || !companyId) return

    setLoading(true)
    const fd = new FormData()
    fd.append('title', title)
    fd.append('company', companyId)
    fd.append('file', file)

    try {
      await createDocument(fd)
      toast({ title: 'Sucesso', description: 'Documento enviado e classificado com IA.' })
      setOpen(false)
      onSuccess()
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha ao enviar documento.', variant: 'destructive' })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <UploadCloud className="w-4 h-4" /> Novo Documento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Documento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: DAS Janeiro 2026"
            />
          </div>
          <div className="space-y-2">
            <Label>Empresa</Label>
            <Select required value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Arquivo (PDF, Imagem)</Label>
            <Input
              type="file"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.png,.jpg,.jpeg"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={loading}
          >
            {loading ? 'Enviando e Classificando...' : 'Fazer Upload'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
