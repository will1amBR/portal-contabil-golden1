migrate(
  (app) => {
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
      memory: [
        {
          type: 'text',
          payload: {
            text: 'O Simples Nacional é um regime tributário facilitado para micro e pequenas empresas, que unifica o pagamento de impostos através da guia DAS, com vencimento padrão no dia 20 de cada mês.',
          },
        },
        {
          type: 'text',
          payload: {
            text: 'O Lucro Presumido é um regime tributário onde o IRPJ e a CSLL são calculados com base em uma margem de lucro pré-fixada pela lei, variando de acordo com a atividade da empresa.',
          },
        },
      ],
    })
  },
  (app) => {
    $ai.agents.delete(app, 'accounting-assistant')
  },
)
