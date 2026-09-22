migrate(
  (app) => {
    // Enrich leads with diverse statuses and created dates for conversion reporting
    const leadsCol = app.findCollectionByNameOrId('leads')
    const sampleLeads = [
      {
        name: 'Rafael Mendes',
        email: 'rafael@techlog.com.br',
        phone: '(11) 98877-1122',
        company_name: 'TechLog Soluções em Transporte',
        cnpj: '12.345.678/0001-90',
        tax_regime: 'presumido',
        employees_count: '10-50',
        message: 'Queremos fechar com a Golden para o fechamento fiscal mensal.',
        status: 'won',
      },
      {
        name: 'Camila Rocha',
        email: 'camila@bioquimica.med.br',
        phone: '(11) 97766-3344',
        company_name: 'BioQuímica Diagnósticos',
        cnpj: '23.456.789/0001-01',
        tax_regime: 'real',
        employees_count: '50+',
        message: 'Apresentação de proposta enviada para a diretoria financeira.',
        status: 'proposal_sent',
      },
      {
        name: 'Bruno Silveira',
        email: 'bruno@inovasolar.com.br',
        phone: '(19) 99123-4567',
        company_name: 'Inova Solar Energia',
        cnpj: '34.567.890/0001-12',
        tax_regime: 'simples',
        employees_count: '1-10',
        message: 'Aguardando agendamento de reunião online com contador.',
        status: 'contacted',
      },
      {
        name: 'Juliana Pires',
        email: 'juliana@piresarquitetura.com',
        phone: '(11) 96543-2109',
        company_name: 'Pires Arquitetura e Engenharia',
        cnpj: '45.678.901/0001-23',
        tax_regime: 'simples',
        employees_count: '1-10',
        message: 'Contrato assinado em Setembro!',
        status: 'won',
      },
      {
        name: 'Luciano Ribeiro',
        email: 'luciano@convenienciabrasil.com',
        phone: '(11) 98111-2233',
        company_name: 'Rede Conveniência Brasil',
        cnpj: '56.789.012/0001-34',
        tax_regime: 'presumido',
        employees_count: '10-50',
        message: 'Proposta comercial de honorários enviada em análise.',
        status: 'proposal_sent',
      },
      {
        name: 'Renata Castro',
        email: 'renata@castroconsult.com',
        phone: '(11) 99234-5678',
        company_name: 'Castro Consultoria Estratégica',
        cnpj: '67.890.123/0001-45',
        tax_regime: 'mei',
        employees_count: '1-10',
        message: 'Novo contato via landing page.',
        status: 'new',
      },
      {
        name: 'Thiago Faria',
        email: 'thiago@fariaeletro.com.br',
        phone: '(11) 98345-6789',
        company_name: 'Faria Comércio Eletrônico',
        cnpj: '78.901.234/0001-56',
        tax_regime: 'simples',
        employees_count: '1-10',
        message: 'Empresa postergou decisão para o próximo trimestre.',
        status: 'archived',
      },
    ]

    for (let i = 0; i < sampleLeads.length; i++) {
      const item = sampleLeads[i]
      try {
        app.findFirstRecordByData('leads', 'email', item.email)
      } catch (_) {
        const record = new Record(leadsCol)
        record.set('name', item.name)
        record.set('email', item.email)
        record.set('phone', item.phone)
        record.set('company_name', item.company_name)
        record.set('cnpj', item.cnpj)
        record.set('tax_regime', item.tax_regime)
        record.set('employees_count', item.employees_count)
        record.set('message', item.message)
        record.set('status', item.status)
        app.save(record)
      }
    }
  },
  () => {},
)
