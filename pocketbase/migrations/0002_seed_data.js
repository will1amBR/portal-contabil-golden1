migrate((app) => {
  const users = app.findCollectionByNameOrId('_pb_users_auth_')

  // Seed Accountant
  let accountant
  try {
    accountant = app.findAuthRecordByEmail('_pb_users_auth_', 'william@korenambiental.com')
    accountant.set('role', 'accountant')
    app.save(accountant)
  } catch (_) {
    accountant = new Record(users)
    accountant.setEmail('william@korenambiental.com')
    accountant.setPassword('Skip@Pass')
    accountant.setVerified(true)
    accountant.set('name', 'Admin Contábil')
    accountant.set('role', 'accountant')
    app.save(accountant)
  }

  // Seed Client
  let client
  try {
    client = app.findAuthRecordByEmail('_pb_users_auth_', 'cliente@empresa.com')
  } catch (_) {
    client = new Record(users)
    client.setEmail('cliente@empresa.com')
    client.setPassword('Skip@Pass')
    client.setVerified(true)
    client.set('name', 'João Cliente')
    client.set('role', 'client')
    app.save(client)
  }

  const companies = app.findCollectionByNameOrId('companies')
  let company
  try {
    company = app.findFirstRecordByData('companies', 'cnpj', '12345678000199')
  } catch (_) {
    company = new Record(companies)
    company.set('name', 'Tech Solutions LTDA')
    company.set('cnpj', '12345678000199')
    company.set('tax_regime', 'simples')
    company.set('owner', client.id)
    company.set('status', 'active')
    app.save(company)
  }

  const reqs = app.findCollectionByNameOrId('tax_regimes_requirements')
  try {
    app.findFirstRecordByData('tax_regimes_requirements', 'requirement_name', 'DAS')
  } catch (_) {
    const r1 = new Record(reqs)
    r1.set('regime_type', 'simples')
    r1.set('requirement_name', 'DAS')
    r1.set('frequency', 'monthly')
    r1.set('due_day', 20)
    app.save(r1)

    const r2 = new Record(reqs)
    r2.set('regime_type', 'simples')
    r2.set('requirement_name', 'DEFIS')
    r2.set('frequency', 'annually')
    r2.set('due_day', 31)
    app.save(r2)
  }
})
