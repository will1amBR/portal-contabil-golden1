onRecordAfterCreateSuccess((e) => {
  const lead = e.record
  const name = lead.getString('name') || 'Não informado'
  const email = lead.getString('email') || 'Não informado'
  const phone = lead.getString('phone') || 'Não informado'
  const companyName = lead.getString('company_name') || 'Não informado'
  const cnpj = lead.getString('cnpj') || 'Não informado'
  const taxRegime = lead.getString('tax_regime') || 'Não definido'
  const employeesCount = lead.getString('employees_count') || 'Não informado'
  const message = lead.getString('message') || 'Nenhuma observação enviada.'
  const leadId = lead.id

  const destinationEmail = 'paulinho@golden.com.br'

  const subject = `[Novo Lead Golden] ${companyName || name} solicitou contratação/proposta`

  const regimeLabel =
    {
      simples: 'Simples Nacional',
      presumido: 'Lucro Presumido',
      real: 'Lucro Real',
      mei: 'MEI',
      nao_sei: 'Não definido / Precisa de auxílio',
    }[taxRegime] || taxRegime

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
        .container { max-width: 620px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; text-align: left; }
        .header h1 { margin: 0 0 6px 0; font-size: 20px; color: #ffffff; }
        .header p { margin: 0; font-size: 14px; color: #d1fae5; }
        .body { padding: 24px; }
        .grid { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 16px; margin-bottom: 20px; }
        .field { background: #0f172a; padding: 12px 16px; border-radius: 8px; border: 1px solid #334155; }
        .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 4px; }
        .value { font-size: 15px; font-weight: 500; color: #f8fafc; word-break: break-all; }
        .badge { display: inline-block; padding: 4px 10px; background-color: #f59e0b; color: #1e293b; border-radius: 9999px; font-weight: 600; font-size: 12px; }
        .msg-box { background: #0f172a; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981; margin-top: 12px; color: #cbd5e1; font-size: 14px; white-space: pre-wrap; }
        .footer { padding: 16px 24px; background: #090d16; border-top: 1px solid #334155; font-size: 13px; color: #64748b; text-align: center; }
        .btn { display: inline-block; background-color: #10b981; color: #ffffff !important; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⭐ Novo Lead Recebido no Portal Golden</h1>
          <p>Um potencial cliente preencheu a ficha de contratação online.</p>
        </div>
        <div class="body">
          <p style="margin-top:0; font-size:14px; color:#cbd5e1;">Olá equipe da <strong>Golden Contabilidade</strong>, você recebeu uma nova oportunidade de negócio através do formulário de planos/contratação.</p>
          
          <div class="grid">
            <div class="field">
              <div class="label">Nome do Contato</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Empresa / Razão Social</div>
              <div class="value">${companyName}</div>
            </div>
            <div class="field">
              <div class="label">E-mail Corporativo</div>
              <div class="value"><a href="mailto:${email}" style="color:#38bdf8; text-decoration:none;">${email}</a></div>
            </div>
            <div class="field">
              <div class="label">Telefone / WhatsApp</div>
              <div class="value">${phone}</div>
            </div>
            <div class="field">
              <div class="label">CNPJ</div>
              <div class="value">${cnpj}</div>
            </div>
            <div class="field">
              <div class="label">Regime Tributário</div>
              <div class="value"><span class="badge">${regimeLabel}</span></div>
            </div>
            <div class="field">
              <div class="label">Faixa de Funcionários</div>
              <div class="value">${employeesCount}</div>
            </div>
          </div>

          <div class="label" style="margin-top:16px;">Mensagem / Necessidade do Cliente</div>
          <div class="msg-box">${message}</div>

          <div style="text-align:center; margin-top: 24px;">
            <a href="https://portal.golden.com.br/admin/leads" class="btn">Abrir Funil de Leads no Painel Golden</a>
          </div>
        </div>
        <div class="footer">
          Golden Contabilidade Inteligente &bull; Sistema de Notificação Instantânea de Leads (ID: ${leadId})
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const emailObj = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress || 'nao-responder@golden.com.br',
        name: $app.settings().meta.senderName || 'Golden Contabilidade',
      },
      to: [{ address: destinationEmail }],
      subject: subject,
      html: html,
    })

    $app.newMailClient().send(emailObj)
    console.log(
      `[Lead Notification] E-mail enviado com sucesso para ${destinationEmail} sobre o lead ${leadId}`,
    )
  } catch (err) {
    // Trata a falha sem interromper ou cancelar a criação do lead
    console.warn(
      `[Lead Notification] Não foi possível enviar e-mail para ${destinationEmail}: ${err.message || err}`,
    )
  }
}, 'leads')
