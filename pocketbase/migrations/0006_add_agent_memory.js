migrate(
  (app) => {
    try {
      $ai.agents.putMemories(app, 'accounting-assistant', [
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
      ])
    } catch (err) {
      console.log('Failed to add agent memory: ' + err.message)
    }
  },
  (app) => {
    try {
      $ai.agents.deleteMemories(app, 'accounting-assistant', [
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
      ])
    } catch (err) {
      console.log('Failed to remove agent memory: ' + err.message)
    }
  },
)
