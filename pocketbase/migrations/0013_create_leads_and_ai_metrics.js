migrate(
  (app) => {
    // 1. Create leads collection for landing page contact / contract requests
    if (!app.hasTable('leads')) {
      const leadsCollection = new Collection({
        name: 'leads',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: '', // Public can submit interest form
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'name', type: 'text', required: true },
          { name: 'email', type: 'email', required: true },
          { name: 'phone', type: 'text' },
          { name: 'company_name', type: 'text' },
          { name: 'cnpj', type: 'text' },
          {
            name: 'tax_regime',
            type: 'select',
            values: ['simples', 'presumido', 'real', 'mei', 'nao_sei'],
            maxSelect: 1,
          },
          { name: 'employees_count', type: 'text' },
          { name: 'message', type: 'text' },
          {
            name: 'status',
            type: 'select',
            values: ['new', 'contacted', 'proposal_sent', 'won', 'archived'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      })
      app.save(leadsCollection)
    }

    // 2. Add ai_classification_accepted flag to documents table if not present (to track whether accountant accepted IA suggestion or modified it)
    const docsCol = app.findCollectionByNameOrId('documents')
    if (!docsCol.fields.getByName('ai_adjusted')) {
      docsCol.fields.add(
        new BoolField({
          name: 'ai_adjusted',
          required: false,
        }),
      )
    }
    if (!docsCol.fields.getByName('original_suggested_category')) {
      docsCol.fields.add(
        new SelectField({
          name: 'original_suggested_category',
          values: ['tax', 'payroll', 'accounting', 'legal'],
          maxSelect: 1,
          required: false,
        }),
      )
    }
    app.save(docsCol)

    // 3. Seed some initial sample leads and enrich existing confirmed docs with AI accuracy tracking
    try {
      const leadsCol = app.findCollectionByNameOrId('leads')
      if (app.countRecords('leads') === 0) {
        const sample1 = new Record(leadsCol)
        sample1.set('name', 'Marcos Oliveira')
        sample1.set('email', 'marcos@ecotrans.ind.br')
        sample1.set('phone', '(11) 98765-4321')
        sample1.set('company_name', 'EcoTrans Logística Sustentável')
        sample1.set('cnpj', '33.123.456/0001-99')
        sample1.set('tax_regime', 'presumido')
        sample1.set('employees_count', '10-50')
        sample1.set(
          'message',
          'Gostaria de migrar nossa contabilidade para a Golden e ter acesso ao portal de obrigações fiscais.',
        )
        sample1.set('status', 'new')
        app.save(sample1)

        const sample2 = new Record(leadsCol)
        sample2.set('name', 'Fernanda Albuquerque')
        sample2.set('email', 'fernanda@startclean.com')
        sample2.set('phone', '(11) 97123-9988')
        sample2.set('company_name', 'Start Clean Serviços Ambientais')
        sample2.set('cnpj', '45.987.654/0001-12')
        sample2.set('tax_regime', 'simples')
        sample2.set('employees_count', '1-10')
        sample2.set(
          'message',
          'Buscamos atendimento consultivo e automação na entrega das guias DAS e holerites.',
        )
        sample2.set('status', 'contacted')
        app.save(sample2)
      }
    } catch (e) {
      console.log('Seed leads error:', e.message)
    }

    // Populate original_suggested_category and ai_adjusted for existing approved/validated docs so the accuracy chart has rich data right away
    try {
      const allDocs = app.findRecordsByFilter('documents', '', '-created', 100, 0)
      allDocs.forEach((doc) => {
        let changed = false
        const cat = doc.getString('category') || 'legal'
        const sug = doc.getString('suggested_category') || cat
        if (!doc.getString('original_suggested_category')) {
          doc.set('original_suggested_category', sug)
          changed = true
        }
        if (!doc.getString('suggested_category')) {
          doc.set('suggested_category', cat)
          changed = true
        }
        if (changed) {
          app.save(doc)
        }
      })
    } catch (e) {
      console.log('Backfill docs AI metrics error:', e.message)
    }
  },
  (app) => {
    try {
      const leads = app.findCollectionByNameOrId('leads')
      app.delete(leads)
    } catch (_) {}
  },
)
