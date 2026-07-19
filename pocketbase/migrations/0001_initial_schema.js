migrate((app) => {
  const users = app.findCollectionByNameOrId('_pb_users_auth_')
  users.fields.add(
    new SelectField({ name: 'role', values: ['admin', 'accountant', 'client'], maxSelect: 1 }),
  )
  app.save(users)

  const companies = new Collection({
    name: 'companies',
    type: 'base',
    listRule:
      "@request.auth.id != '' && (@request.auth.role = 'accountant' || @request.auth.role = 'admin' || owner = @request.auth.id)",
    viewRule:
      "@request.auth.id != '' && (@request.auth.role = 'accountant' || @request.auth.role = 'admin' || owner = @request.auth.id)",
    createRule: "@request.auth.role = 'accountant' || @request.auth.role = 'admin'",
    updateRule: "@request.auth.role = 'accountant' || @request.auth.role = 'admin'",
    deleteRule: "@request.auth.role = 'accountant' || @request.auth.role = 'admin'",
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'cnpj', type: 'text', required: true },
      {
        name: 'tax_regime',
        type: 'select',
        values: ['simples', 'presumido', 'real'],
        maxSelect: 1,
        required: true,
      },
      { name: 'owner', type: 'relation', collectionId: users.id, maxSelect: 1, required: true },
      { name: 'status', type: 'select', values: ['active', 'inactive'], maxSelect: 1 },
      { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ],
  })
  app.save(companies)

  const reqs = new Collection({
    name: 'tax_regimes_requirements',
    type: 'base',
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      {
        name: 'regime_type',
        type: 'select',
        values: ['simples', 'presumido', 'real'],
        maxSelect: 1,
      },
      { name: 'requirement_name', type: 'text' },
      {
        name: 'frequency',
        type: 'select',
        values: ['monthly', 'annually', 'quarterly'],
        maxSelect: 1,
      },
      { name: 'due_day', type: 'number' },
      { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ],
  })
  app.save(reqs)

  const docs = new Collection({
    name: 'documents',
    type: 'base',
    listRule:
      "@request.auth.id != '' && (@request.auth.role = 'accountant' || @request.auth.role = 'admin' || company.owner = @request.auth.id)",
    viewRule:
      "@request.auth.id != '' && (@request.auth.role = 'accountant' || @request.auth.role = 'admin' || company.owner = @request.auth.id)",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
    fields: [
      {
        name: 'company',
        type: 'relation',
        collectionId: companies.id,
        maxSelect: 1,
        required: true,
      },
      { name: 'title', type: 'text', required: true },
      { name: 'file', type: 'file', maxSelect: 1, maxSize: 10485760 },
      {
        name: 'category',
        type: 'select',
        values: ['tax', 'payroll', 'accounting', 'legal'],
        maxSelect: 1,
      },
      { name: 'due_date', type: 'date' },
      { name: 'payment_status', type: 'select', values: ['pending', 'paid', 'n/a'], maxSelect: 1 },
      { name: 'embedding', type: 'vector', dimensions: 1536, distance: 'cosine' },
      { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ],
  })
  app.save(docs)
})
