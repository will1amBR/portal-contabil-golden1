migrate(
  (app) => {
    try {
      $ai.agents.define(app, {
        slug: 'accounting-assistant',
        name: 'Contador Virtual',
        description: 'Assistente especialista em contabilidade brasileira e gestão de documentos.',
        systemPrompt:
          'Você é um contador virtual experiente no Brasil. Ajude o usuário a entender seus impostos, regimes tributários (como Simples Nacional) e encontrar documentos enviados. Responda em Português do Brasil, de forma clara, educada e profissional. Sempre cite documentos ou fontes quando consultar ferramentas.',
        tier: 'fast',
        tools: [
          { collection: 'documents', perms: { read: true, list: true } },
          { collection: 'companies', perms: { read: true, list: true } },
          { collection: 'tax_regimes_requirements', perms: { read: true, list: true } },
        ],
      })
    } catch (err) {
      console.log('Failed to define accounting-assistant agent: ' + err.message)
    }
  },
  (app) => {
    try {
      $ai.agents.delete(app, 'accounting-assistant')
    } catch (err) {
      console.log('Failed to delete accounting-assistant agent: ' + err.message)
    }
  },
)
