migrate(
  (app) => {
    const reqs = app.findCollectionByNameOrId('tax_regimes_requirements')

    const requirements = [
      // Simples Nacional
      {
        regime: 'simples',
        name: 'DAS - Documento de Arrecadação do Simples Nacional',
        freq: 'monthly',
        day: 20,
      },
      {
        regime: 'simples',
        name: 'DEFIS - Declaração de Informações Socioeconômicas e Fiscais',
        freq: 'annually',
        day: 31,
      },
      {
        regime: 'simples',
        name: 'DESTDA - Declaração de Substituição Tributária e Diferencial de Alíquota',
        freq: 'monthly',
        day: 28,
      },
      {
        regime: 'simples',
        name: 'eSocial / DCTFWeb - Folha de Pagamento e Encargos',
        freq: 'monthly',
        day: 15,
      },
      {
        regime: 'simples',
        name: 'FGTS Digital - Guia de Recolhimento do FGTS',
        freq: 'monthly',
        day: 20,
      },

      // Lucro Presumido
      {
        regime: 'presumido',
        name: 'PIS / COFINS - Contribuições Federais',
        freq: 'monthly',
        day: 25,
      },
      {
        regime: 'presumido',
        name: 'IRPJ e CSLL - Apuração Trimestral Lucro Presumido',
        freq: 'quarterly',
        day: 30,
      },
      {
        regime: 'presumido',
        name: 'EFD-Contribuições - Escrituração Fiscal Digital',
        freq: 'monthly',
        day: 15,
      },
      {
        regime: 'presumido',
        name: 'EFD-Reinf - Escrituração Fiscal Digital de Retenções',
        freq: 'monthly',
        day: 15,
      },
      {
        regime: 'presumido',
        name: 'DCTF Mensal - Declaração de Débitos e Créditos Tributários Federais',
        freq: 'monthly',
        day: 22,
      },
      {
        regime: 'presumido',
        name: 'SPED Fiscal (ICMS/IPI) / EFD ICMS IPI',
        freq: 'monthly',
        day: 20,
      },
      {
        regime: 'presumido',
        name: 'eSocial / DCTFWeb - Previdenciário e FGTS',
        freq: 'monthly',
        day: 15,
      },
      {
        regime: 'presumido',
        name: 'ECF - Escrituração Contábil Fiscal',
        freq: 'annually',
        day: 31,
      },
      {
        regime: 'presumido',
        name: 'ECD - Escrituração Contábil Digital',
        freq: 'annually',
        day: 28,
      },

      // Lucro Real
      {
        regime: 'real',
        name: 'PIS / COFINS (Não Cumulativo) - Regime Real',
        freq: 'monthly',
        day: 25,
      },
      {
        regime: 'real',
        name: 'IRPJ e CSLL - Estimativa Mensal / Balancete de Suspensão',
        freq: 'monthly',
        day: 30,
      },
      { regime: 'real', name: 'EFD-Contribuições e EFD-Reinf', freq: 'monthly', day: 15 },
      { regime: 'real', name: 'DCTF Mensal e DCTFWeb Previdenciária', freq: 'monthly', day: 15 },
      {
        regime: 'real',
        name: 'SPED Fiscal (ICMS/IPI) e SPED Contábil (ECD)',
        freq: 'monthly',
        day: 20,
      },
      {
        regime: 'real',
        name: 'LALUR / LACS - Livro de Apuração do Lucro Real',
        freq: 'monthly',
        day: 30,
      },
      {
        regime: 'real',
        name: 'ECF - Escrituração Contábil Fiscal Lucro Real',
        freq: 'annually',
        day: 31,
      },
    ]

    for (const item of requirements) {
      try {
        app.findFirstRecordByData('tax_regimes_requirements', 'requirement_name', item.name)
      } catch (_) {
        const rec = new Record(reqs)
        rec.set('regime_type', item.regime)
        rec.set('requirement_name', item.name)
        rec.set('frequency', item.freq)
        rec.set('due_day', item.day)
        app.save(rec)
      }
    }
  },
  (app) => {},
)
