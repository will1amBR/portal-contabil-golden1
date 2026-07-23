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
  validation_status: 'pending' | 'approved' | 'rejected'
  validation_notes?: string
  validated_by?: string
  validated_at?: string
  company: string
  due_date?: string
  file?: string
  expand?: {
    company?: Company
    validated_by?: { id: string; name: string }
  }
}

export const getCompanies = async () => {
  return pb.collection('companies').getFullList<Company>({ sort: '-created', expand: 'owner' })
}

export const getDocuments = async (params?: {
  companyId?: string
  category?: string
  validationStatus?: string
}) => {
  const filters: string[] = []
  if (params?.companyId) filters.push(`company = "${params.companyId}"`)
  if (params?.category) filters.push(`category = "${params.category}"`)
  if (params?.validationStatus) filters.push(`validation_status = "${params.validationStatus}"`)
  const filter = filters.join(' && ')
  return pb
    .collection('documents')
    .getFullList<Document>({ sort: '-created', filter, expand: 'company,validated_by' })
}

export const getPendingDocuments = async () => {
  return pb.collection('documents').getFullList<Document>({
    filter: "validation_status = 'pending'",
    sort: '-created',
    expand: 'company,validated_by',
  })
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

export const approveDocument = async (id: string) => {
  return pb.collection('documents').update<Document>(id, {
    validation_status: 'approved',
    validated_by: pb.authStore.record?.id,
    validated_at: new Date().toISOString(),
  })
}

export const rejectDocument = async (id: string, validation_notes: string) => {
  return pb.collection('documents').update<Document>(id, {
    validation_status: 'rejected',
    validation_notes,
    validated_by: pb.authStore.record?.id,
    validated_at: new Date().toISOString(),
  })
}

export const getFileUrl = (record: RecordModel, filename: string) => {
  return pb.files.getURL(record, filename)
}
