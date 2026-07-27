migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    let paulinho
    try {
      paulinho = app.findAuthRecordByEmail('_pb_users_auth_', 'paulinho@golden.com.br')
      paulinho.setPassword('contador@2026')
      paulinho.set('role', 'accountant')
      paulinho.set('name', 'Paulinho Golden')
      paulinho.setVerified(true)
      app.save(paulinho)
    } catch (_) {
      paulinho = new Record(users)
      paulinho.setEmail('paulinho@golden.com.br')
      paulinho.setPassword('contador@2026')
      paulinho.setVerified(true)
      paulinho.set('name', 'Paulinho Golden')
      paulinho.set('role', 'accountant')
      app.save(paulinho)
    }

    let william
    try {
      william = app.findAuthRecordByEmail('_pb_users_auth_', 'william@korenambiental.com')
      william.setPassword('teste!18')
      william.set('role', 'client')
      william.setVerified(true)
      app.save(william)
    } catch (_) {
      william = new Record(users)
      william.setEmail('william@korenambiental.com')
      william.setPassword('teste!18')
      william.setVerified(true)
      william.set('name', 'William Koren')
      william.set('role', 'client')
      app.save(william)
    }
  },
  (app) => {},
)
