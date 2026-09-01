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
  suggested_category?: 'tax' | 'payroll' | 'accounting' | 'legal'
  original_suggested_category?: 'tax' | 'payroll' | 'accounting' | 'legal'
  ai_adjusted?: boolean
  payment_status: 'pending' | 'paid' | 'n/a'
  validation_status: 'pending' | 'approved' | 'rejected' | 'pending_confirmation'
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

export interface Lead extends RecordModel {
  name: string
  email: string
  phone?: string
  company_name?: string
  cnpj?: string
  tax_regime?: 'simples' | 'presumido' | 'real' | 'mei' | 'nao_sei'
  employees_count?: string
  message?: string
  status: 'new' | 'contacted' | 'proposal_sent' | 'won' | 'archived'
}

export interface TaxRegimeRequirement extends RecordModel {
  regime_type: 'simples' | 'presumido' | 'real'
  requirement_name: string
  frequency: 'monthly' | 'annually' | 'quarterly'
  due_day: number
}

export interface NotificationReminder extends RecordModel {
  company: string
  requirement_name: string
  recipient_email: string
  due_date: string
  reference_key: string
  sent_at?: string
  status: string
  expand?: {
    company?: Company
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

export const getConfirmationDocuments = async () => {
  return pb.collection('documents').getFullList<Document>({
    filter: "validation_status = 'pending_confirmation'",
    sort: '-created',
    expand: 'company,validated_by',
  })
}

export const confirmDocument = async (
  id: string,
  category: string,
  wasAdjusted: boolean = false,
  originalSuggestion?: string,
) => {
  const payload: Record<string, any> = {
    category,
    validation_status: 'pending',
    validated_by: pb.authStore.record?.id,
    ai_adjusted: wasAdjusted,
  }
  if (originalSuggestion) {
    payload.original_suggested_category = originalSuggestion
  }
  return pb.collection('documents').update<Document>(id, payload)
}

export const createLead = async (leadData: {
  name: string
  email: string
  phone?: string
  company_name?: string
  cnpj?: string
  tax_regime?: string
  employees_count?: string
  message?: string
}) => {
  return pb.collection('leads').create<Lead>({
    ...leadData,
    status: 'new',
  })
}

export const getLeads = async () => {
  return pb.collection('leads').getFullList<Lead>({ sort: '-created' })
}

export const getTaxRegimesRequirements = async (regimeType?: string) => {
  const filter = regimeType ? `regime_type = "${regimeType}"` : ''
  return pb.collection('tax_regimes_requirements').getFullList<TaxRegimeRequirement>({ filter })
}

export const getCompaniesByOwner = async (ownerId: string) => {
  return pb.collection('companies').getFullList<Company>({
    filter: `owner = "${ownerId}"`,
    sort: '-created',
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

export const getNotificationReminders = async (limit = 50) => {
  try {
    return await pb.collection('notification_reminders').getFullList<NotificationReminder>({
      sort: '-created',
      batch: limit,
      expand: 'company',
    })
  } catch {
    return []
  }
}

export const triggerRemindersCheck = async () => {
  try {
    const res = await pb.send('/api/reminders/trigger-check', {
      method: 'POST',
    })
    return res
  } catch (error) {
    console.error('Trigger reminder error:', error)
    throw error
  }
}
