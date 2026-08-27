onRecordAfterUpdateSuccess((e) => {
  const currentRecord = e.record
  const originalRecord = currentRecord.original()

  const currentStatus = currentRecord.getString('validation_status')
  const originalStatus = originalRecord ? originalRecord.getString('validation_status') : ''
  const currentCat = currentRecord.getString('category')
  const originalCat = originalRecord
    ? originalRecord.getString('original_category') || originalRecord.getString('category')
    : ''

  // Verificar se houve mudança relevante: aprovação, rejeição ou confirmação de categoria
  const statusChanged = currentStatus && currentStatus !== originalStatus
  const isApproved = statusChanged && currentStatus === 'approved'
  const isRejected = statusChanged && currentStatus === 'rejected'
  // Confirmação de categoria: quando sai de pending_confirmation para pending (ou quando category muda)
  const isCategoryConfirmed =
    (originalStatus === 'pending_confirmation' && currentStatus === 'pending') ||
    (currentCat &&
      originalCat &&
      currentCat !== originalCat &&
      currentStatus !== 'pending_confirmation')

  if (!isApproved && !isRejected && !isCategoryConfirmed) {
    return e.next()
  }

  try {
    const companyId = currentRecord.getString('company')
    if (!companyId) return e.next()

    const company = $app.findRecordById('companies', companyId)
    const ownerId = company.getString('owner')
    if (!ownerId) return e.next()

    const clientUser = $app.findRecordById('users', ownerId)
    const clientEmail = clientUser.email()
    if (!clientEmail) return e.next()

    const docTitle = currentRecord.getString('title') || 'Documento sem título'
    const siteUrl = $os.getenv('SITE_URL') || 'https://portal-contabil-integrado-89d80.goskip.app'
    const portalUrl = siteUrl + '/cliente/documentos'

    let statusLabel = ''
    let statusDescription = ''
    let badgeColor = '#059669' // emerald

    if (isApproved) {
      statusLabel = 'Aprovado'
      statusDescription = 'Seu documento foi validado e aprovado com sucesso pela contabilidade.'
      badgeColor = '#059669'
    } else if (isRejected) {
      statusLabel = 'Rejeitado'
      const notes = currentRecord.getString('validation_notes') || 'Não especificado'
      statusDescription =
        'Seu documento precisa de atenção ou reenvio. Motivo indicado pelo contador: <strong>' +
        notes +
        '</strong>'
      badgeColor = '#dc2626'
    } else if (isCategoryConfirmed) {
      const catMap = {
        tax: 'Impostos / Guias',
        payroll: 'RH & Holerites',
        accounting: 'Contábil',
        legal: 'Legal / Contratos',
      }
      const catFriendly = catMap[currentCat] || currentCat || 'Geral'
      statusLabel = 'Categoria Confirmada (' + catFriendly + ')'
      statusDescription =
        'A categoria do seu documento foi confirmada pela contabilidade como <strong>' +
        catFriendly +
        '</strong> e já está disponível para consulta.'
      badgeColor = '#2563eb'
    }

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 12px;">
        <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 700;">Portal Contábil Integrado</h2>
            <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Atualização de status de documento</p>
          </div>

          <p style="color: #334155; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Olá, <strong>${clientUser.getString('name') || 'Cliente'}</strong>!
          </p>

          <p style="color: #334155; font-size: 15px; line-height: 1.5;">
            Houve uma atualização recente no documento referente à empresa <strong>${company.getString('name')}</strong>:
          </p>

          <div style="background-color: #f1f5f9; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #475569; font-size: 14px;"><strong>Documento:</strong> ${docTitle}</p>
            <p style="margin: 0 0 8px 0; color: #475569; font-size: 14px;">
              <strong>Novo Status:</strong> 
              <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background-color: ${badgeColor}; color: #ffffff; font-weight: 600; font-size: 12px;">
                ${statusLabel}
              </span>
            </p>
            <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.4;">
              ${statusDescription}
            </p>
          </div>

          <div style="text-align: center; margin: 32px 0 20px 0;">
            <a href="${portalUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: 600; font-size: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(16,185,129,0.2);">
              Acessar Portal Contábil
            </a>
          </div>

          <p style="color: #94a3b8; font-size: 12px; line-height: 1.4; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center;">
            Este é um e-mail automático gerado pelo Portal Contábil. Por favor, não responda diretamente a esta mensagem.
          </p>
        </div>
      </div>
    `

    const senderEmail =
      ($app.settings() && $app.settings().meta && $app.settings().meta.senderAddress) ||
      'suporte@portalcontabil.com'
    const senderName =
      ($app.settings() && $app.settings().meta && $app.settings().meta.senderName) ||
      'Portal Contábil'

    const message = new MailerMessage({
      from: {
        address: senderEmail,
        name: senderName,
      },
      to: [{ address: clientEmail }],
      subject: `[Portal Contábil] Atualização no documento: ${docTitle} (${statusLabel})`,
      html: htmlBody,
    })

    $app.newMailClient().send(message)
    console.log(
      `[Email Sent] Notification sent to ${clientEmail} for document ${docTitle} (status: ${statusLabel})`,
    )
  } catch (err) {
    console.log('[Email Error] Failed to send notification email:', err ? err.message : err)
  }

  return e.next()
}, 'documents')
