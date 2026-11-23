migrate(
  (app) => {
    // Redefine as senhas dos usuários de demonstração para os valores
    // especificados pelo usuário. Idempotente: no-op se o usuário não existir.
    // Nomes, e-mails, roles e demais dados NÃO são alterados.
    const targets = [
      { email: 'paulinho@golden.com.br', password: 'contador@2026' },
      { email: 'william@korenambiental.com', password: 'teste!18' },
    ]

    for (const t of targets) {
      try {
        const user = app.findAuthRecordByEmail('_pb_users_auth_', t.email)
        user.setPassword(t.password)
        app.save(user)
        console.log(`[0016] senha redefinida para ${t.email}`)
      } catch (_) {
        console.log(`[0016] usuário ${t.email} não encontrado — pulado`)
      }
    }
  },
  (app) => {},
)
