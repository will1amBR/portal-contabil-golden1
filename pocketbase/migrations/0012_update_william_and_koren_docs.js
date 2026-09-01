migrate(
  (app) => {
    // 1. Update William user name to 'William Koren' or 'William'
    let william
    try {
      william = app.findAuthRecordByEmail('_pb_users_auth_', 'william@korenambiental.com')
      if (william) {
        william.set('name', 'William')
        william.set('role', 'client')
        william.setVerified(true)
        app.save(william)
      }
    } catch (_) {}

    // 2. Ensure Koren Ambiental exists and has owner
    const companiesCol = app.findCollectionByNameOrId('companies')
    let koren
    try {
      koren = app.findFirstRecordByData('companies', 'name', 'Koren Ambiental LTDA')
    } catch (_) {
      try {
        if (william) {
          koren = app.findFirstRecordByData('companies', 'owner', william.id)
        }
      } catch (_) {}
    }

    if (!koren && william) {
      koren = new Record(companiesCol)
      koren.set('name', 'Koren Ambiental LTDA')
      koren.set('cnpj', '48.912.340/0001-85')
      koren.set('tax_regime', 'simples')
      koren.set('owner', william.id)
      koren.set('status', 'active')
      app.save(koren)
    }

    // 3. Seed some sample documents for Koren Ambiental if none exist
    if (koren) {
      const docsCol = app.findCollectionByNameOrId('documents')
      try {
        const existingDocs = app.findRecordsByFilter(
          'documents',
          `company = "${koren.id}"`,
          '-created',
          10,
          0,
        )

        if (existingDocs.length === 0) {
          // Document 1: Waiting IA category confirmation
          const doc1 = new Record(docsCol)
          doc1.set('title', 'Comprovante DAS Simples - Março 2026')
          doc1.set('category', 'tax')
          doc1.set('suggested_category', 'tax')
          doc1.set('company', koren.id)
          doc1.set('validation_status', 'pending_confirmation')
          doc1.set('payment_status', 'pending')
          app.save(doc1)

          // Document 2: Pending Accountant validation
          const doc2 = new Record(docsCol)
          doc2.set('title', 'Folha de Pagamento Funcionários - Março 2026')
          doc2.set('category', 'payroll')
          doc2.set('suggested_category', 'payroll')
          doc2.set('company', koren.id)
          doc2.set('validation_status', 'pending')
          doc2.set('payment_status', 'n/a')
          app.save(doc2)

          // Document 3: Approved contract
          const doc3 = new Record(docsCol)
          doc3.set('title', 'Contrato de Prestação de Serviços Ambientais')
          doc3.set('category', 'legal')
          doc3.set('company', koren.id)
          doc3.set('validation_status', 'approved')
          doc3.set('payment_status', 'n/a')
          app.save(doc3)
        }
      } catch (_) {}
    }
  },
  (app) => {
    // revert is no-op for seed data
  },
)
