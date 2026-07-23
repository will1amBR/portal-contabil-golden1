migrate(
  (app) => {
    let company
    try {
      company = app.findFirstRecordByData('companies', 'cnpj', '12345678000199')
    } catch (_) {
      return
    }

    let accountant
    try {
      accountant = app.findAuthRecordByEmail('_pb_users_auth_', 'william@korenambiental.com')
    } catch (_) {}

    const docsCol = app.findCollectionByNameOrId('documents')

    const seedDocs = [
      { title: 'DAS Janeiro 2026', category: 'tax', vs: 'pending', ps: 'pending' },
      { title: 'DAS Fevereiro 2026', category: 'tax', vs: 'approved', ps: 'paid' },
      { title: 'Holerite Joao - Janeiro 2026', category: 'payroll', vs: 'approved', ps: 'n/a' },
      { title: 'Holerite Maria - Janeiro 2026', category: 'payroll', vs: 'pending', ps: 'n/a' },
      {
        title: 'Balanco Patrimonial 2025',
        category: 'accounting',
        vs: 'rejected',
        ps: 'n/a',
        notes: 'Documentos faltantes: nota fiscal de servicos.',
      },
      { title: 'Contrato Social Atualizado', category: 'legal', vs: 'approved', ps: 'n/a' },
      {
        title: 'DAS Marco 2026',
        category: 'tax',
        vs: 'rejected',
        ps: 'pending',
        notes: 'Valor incorreto, favor verificar calculo.',
      },
      { title: 'Holerite Carlos - Fevereiro 2026', category: 'payroll', vs: 'pending', ps: 'n/a' },
      { title: 'Razao Contabil Q1 2026', category: 'accounting', vs: 'pending', ps: 'n/a' },
      { title: 'Procuracao Juridica', category: 'legal', vs: 'pending', ps: 'n/a' },
    ]

    for (const doc of seedDocs) {
      try {
        app.findFirstRecordByData('documents', 'title', doc.title)
      } catch (_) {
        const record = new Record(docsCol)
        record.set('title', doc.title)
        record.set('company', company.id)
        record.set('category', doc.category)
        record.set('validation_status', doc.vs)
        record.set('payment_status', doc.ps)
        if (doc.notes) record.set('validation_notes', doc.notes)
        if (doc.vs !== 'pending' && accountant) {
          record.set('validated_by', accountant.id)
          record.set('validated_at', new Date().toISOString())
        }
        app.save(record)
      }
    }
  },
  (app) => {
    const titles = [
      'DAS Janeiro 2026',
      'DAS Fevereiro 2026',
      'Holerite Joao - Janeiro 2026',
      'Holerite Maria - Janeiro 2026',
      'Balanco Patrimonial 2025',
      'Contrato Social Atualizado',
      'DAS Marco 2026',
      'Holerite Carlos - Fevereiro 2026',
      'Razao Contabil Q1 2026',
      'Procuracao Juridica',
    ]
    for (const title of titles) {
      try {
        const r = app.findFirstRecordByData('documents', 'title', title)
        app.delete(r)
      } catch (_) {}
    }
  },
)
