import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface Company extends RecordModel {
  name: string
  cnpj: string
  tax_regime: 'simples' | 'presumido' | 'real'
  status: 'active' | 'inactive'
  owner: string
}

export interface Document extends RecordModel {
  title: string
  category: 'tax' | 'payroll' | 'accounting' | 'legal'
  payment_status: 'pending' | 'paid' | 'n/a'
  company: string
  due_date?: string
  file?: string
}

export const getCompanies = async () => {
  return pb.collection('companies').getFullList<Company>({ sort: '-created', expand: 'owner' })
}

export const getDocuments = async (companyId?: string) => {
  const filter = companyId ? `company = "${companyId}"` : ''
  return pb
    .collection('documents')
    .getFullList<Document>({ sort: '-created', filter, expand: 'company' })
}

export const createDocument = async (formData: FormData) => {
  return pb.collection('documents').create<Document>(formData)
}

export const updateDocumentStatus = async (
  id: string,
  payment_status: 'pending' | 'paid' | 'n/a',
) => {
  return pb.collection('documents').update<Document>(id, { payment_status })
}

export const getFileUrl = (record: RecordModel, filename: string) => {
  return pb.files.getURL(record, filename)
}
