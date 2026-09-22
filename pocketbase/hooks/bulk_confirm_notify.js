routerAdd('POST', '/backend/v1/bulk-confirm-notify', (e) => {
  const authUser = e.auth
  if (!authUser) {
    return e.unauthorizedError('Acesso não autenticado.')
  }

  const role = authUser.getString('role')
  if (role !== 'admin' && role !== 'accountant') {
    return e.forbiddenError(
      'Apenas contadores e administradores podem disparar notificações de aprovação em lote.',
    )
  }

  const body = e.requestInfo().body || {}
  const items = body.items // Array de { id, name, category, companyId }
  const note = body.note || ''

  if (!items || !Array.isArray(items) || items.length === 0) {
    return e.json(400, { message: 'Nenhum documento informado no lote.' })
  }

  // Agrupa os documentos por empresa/cliente para enviar 1 e-mail consolidado por cliente
  const docsByCompany = {}
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    const cId = it.companyId
    if (!cId) continue
    if (!docsByCompany[cId]) {
      docsByCompany[cId] = []
    }
    docsByCompany[cId].push(it)
  }

  const categoryNames = {
    fiscal: 'Fiscal (Notas / Cupons)',
    pessoal: 'Departamento Pessoal (Holerites / Folha)',
    contabil: 'Contábil (Extratos / Balanços)',
    legal: 'Societário / Legal (Contratos / Alvarás)',
    impostos: 'Guias de Impostos / Tributos',
    outros: 'Outros Documentos',
  }

  let sentCount = 0
  const results = []

  const companyIds = Object.keys(docsByCompany)
  for (let c = 0; c < companyIds.length; c++) {
    const companyId = companyIds[c]
    const docList = docsByCompany[companyId]

    let company
    let ownerUser
    try {
      company = $app.findRecordById('companies', companyId)
      const ownerId = company.getString('owner')
      if (ownerId) {
        ownerUser = $app.findRecordById('users', ownerId)
      }
    } catch (findErr) {
      console.warn(`[Bulk Email] Erro ao buscar empresa/usuário ${companyId}: ${findErr}`)
      continue
    }

    if (!ownerUser) {
      continue
    }

    const recipientEmail = ownerUser.getString('email')
    const recipientName = ownerUser.getString('name') || company.getString('name') || 'Cliente'
    const companyName = company.getString('name') || 'Sua Empresa'

    if (!recipientEmail) {
      continue
    }

    const rowsHtml = docList
      .map(
        (d, idx) => `
        <tr style="border-bottom: 1px solid #334155; background-color: ${idx % 2 === 0 ? '#1e293b' : '#0f172a'};">
          <td style="padding: 12px 14px; font-size: 14px; color: #f8fafc; font-weight: 500;">
            📄 ${d.name || 'Documento sem título'}
          </td>
          <td style="padding: 12px 14px; font-size: 13px; color: #10b981; font-weight: 600;">
            ${categoryNames[d.category] || d.category || 'Geral'}
          </td>
          <td style="padding: 12px 14px; font-size: 13px; color: #38bdf8; text-align: right;">
            ✅ Aprovado
          </td>
        </tr>
      `,
      )
      .join('')

    const subject = `[Golden Contabilidade] ${docList.length} documento(s) validados com sucesso — ${companyName}`

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
          .container { max-width: 620px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 24px; text-align: left; }
          .header h1 { margin: 0 0 6px 0; font-size: 20px; color: #ffffff; }
          .header p { margin: 0; font-size: 14px; color: #ecfdf5; }
          .body { padding: 24px; }
          .badge-counter { display: inline-block; padding: 4px 12px; background-color: #047857; color: #ffffff; border-radius: 9999px; font-weight: 600; font-size: 13px; margin-bottom: 16px; }
          .table-container { border-radius: 8px; overflow: hidden; border: 1px solid #334155; margin-top: 16px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { background-color: #0f172a; padding: 12px 14px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; border-bottom: 2px solid #334155; }
          .note-box { background: #0f172a; border-left: 4px solid #38bdf8; padding: 14px 16px; border-radius: 8px; margin: 16px 0; font-size: 14px; color: #cbd5e1; }
          .btn { display: inline-block; background-color: #10b981; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px; }
          .footer { padding: 16px 24px; background: #090d16; border-top: 1px solid #334155; font-size: 13px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Confirmação de Documentos em Lote</h1>
            <p>Golden Contabilidade &bull; Esteira de Validação</p>
          </div>
          <div class="body">
            <p style="margin-top:0; font-size:15px; color:#f1f5f9;">
              Olá, <strong>${recipientName}</strong> (${companyName}),
            </p>
            <p style="font-size:14px; color:#cbd5e1; line-height: 1.5;">
              Nossa equipe contábil acaba de revisar e homologar em lote os documentos enviados para a sua empresa. Todos os itens listados abaixo foram conferidos e integrados à sua escrituração fiscal e contábil.
            </p>

            <span class="badge-counter">${docList.length} documento(s) homologado(s) neste lote</span>

            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Arquivo</th>
                    <th>Categoria Oficial</th>
                    <th style="text-align: right;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </div>

            ${
              note
                ? `
              <div class="note-box">
                <strong style="color: #38bdf8;">Observação do Contador:</strong><br />
                ${note}
              </div>
            `
                : ''
            }

            <p style="font-size:14px; color:#94a3b8; margin-top: 20px;">
              Você pode consultar os comprovantes, relatórios fiscais e guias de recolhimento diretamente no Portal do Cliente.
            </p>

            <div style="text-align:center; margin-top: 20px;">
              <a href="https://portal.golden.com.br/cliente/documentos" class="btn">Acessar Meu Portal do Cliente</a>
            </div>
          </div>
          <div class="footer">
            Golden Contabilidade Inteligente &bull; Este é um e-mail automático consolidado por lote.
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
        to: [{ address: recipientEmail }],
        subject: subject,
        html: html,
      })

      $app.newMailClient().send(emailObj)
      sentCount++
      results.push({
        email: recipientEmail,
        company: companyName,
        count: docList.length,
        status: 'sent',
      })
      console.log(
        `[Bulk Confirmation Email] Enviado com sucesso para ${recipientEmail} (${docList.length} docs)`,
      )
    } catch (sendErr) {
      console.warn(`[Bulk Confirmation Email] Falha ao enviar para ${recipientEmail}: ${sendErr}`)
      results.push({
        email: recipientEmail,
        company: companyName,
        count: docList.length,
        status: 'failed',
        error: sendErr.toString(),
      })
    }
  }

  return e.json(200, {
    success: true,
    sentCount: sentCount,
    details: results,
  })
})
