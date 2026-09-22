// Cron scheduled job to run every day at 08:00 AM UTC
// Dispatches reminder emails to clients whose tax obligations expire in 3 days (or are overdue/warning)
cronAdd('tax_obligation_reminders', '0 8 * * *', () => {
  try {
    const companies = $app.findRecordsByFilter('companies', "status = 'active'", 'name', 500, 0)
    const requirements = $app.findRecordsByFilter('tax_regimes_requirements', '', 'id', 500, 0)

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() // 0-indexed
    const currentDay = now.getDate()

    let emailsSent = 0
    const remindersCol = $app.findCollectionByNameOrId('notification_reminders')

    const siteUrl = $os.getenv('SITE_URL') || 'https://portal-contabil-integrado-89d80.goskip.app'
    const portalUrl = siteUrl + '/cliente/dashboard'

    const senderEmail =
      ($app.settings() && $app.settings().meta && $app.settings().meta.senderAddress) ||
      'suporte@portalcontabil.com'
    const senderName =
      ($app.settings() && $app.settings().meta && $app.settings().meta.senderName) ||
      'Golden Contabilidade'

    for (let i = 0; i < companies.length; i++) {
      const comp = companies[i]
      const ownerId = comp.getString('owner')
      if (!ownerId) continue

      let clientUser
      try {
        clientUser = $app.findRecordById('users', ownerId)
      } catch (_) {
        continue
      }

      const clientEmail = clientUser.email()
      if (!clientEmail) continue

      const clientName = clientUser.getString('name') || 'Cliente'
      const compName = comp.getString('name')
      const compRegime = comp.getString('tax_regime')

      // Filter requirements for this company regime
      const matchingReqs = requirements.filter((req) => req.getString('regime_type') === compRegime)

      for (let j = 0; j < matchingReqs.length; j++) {
        const req = matchingReqs[j]
        const reqName = req.getString('requirement_name')
        const freq = req.getString('frequency')
        const dueDay = req.getInt('due_day') || 20

        let appliesThisMonth = false
        if (freq === 'monthly') appliesThisMonth = true
        else if (freq === 'quarterly')
          appliesThisMonth = [0, 2, 3, 5, 6, 8, 9, 11].includes(currentMonth)
        else if (freq === 'annually') appliesThisMonth = [2, 4, 5, 6, 11].includes(currentMonth)

        if (!appliesThisMonth) continue

        // Check if due_day is exactly 3 days away (or within window 1 to 3 days)
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
        const actualDueDay = Math.min(dueDay, daysInMonth)
        const daysDiff = actualDueDay - currentDay

        // Trigger condition: obligation due in 3 days (e.g. daysDiff === 3, or daysDiff > 0 && daysDiff <= 3)
        if (daysDiff >= 1 && daysDiff <= 3) {
          // Check if reminder was already recorded for this company, requirement, year and month
          const refKey = `${comp.id}_${req.id}_${currentYear}_${currentMonth + 1}`

          let alreadySent = false
          try {
            const existing = $app.findFirstRecordByData(
              'notification_reminders',
              'reference_key',
              refKey,
            )
            if (existing) {
              alreadySent = true
            }
          } catch (_) {}

          if (alreadySent) continue

          const dueDateFormatted = `${String(actualDueDay).padStart(2, '0')}/${String(
            currentMonth + 1,
          ).padStart(2, '0')}/${currentYear}`

          const htmlBody = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 12px;">
              <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 24px;">
                  <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 700;">Golden Contabilidade &bull; Lembrete Fiscal</h2>
                  <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Aviso de vencimento de obrigação tributária</p>
                </div>

                <p style="color: #334155; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Olá, <strong>${clientName}</strong>!
                </p>

                <p style="color: #334155; font-size: 15px; line-height: 1.5;">
                  Este é um lembrete automático de que a obrigação fiscal da empresa <strong>${compName}</strong> vencerá em <strong>${daysDiff} dia(s)</strong>:
                </p>

                <div style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="color: #92400e; font-size: 16px;">${reqName}</strong>
                    <span style="background-color: #fef08a; color: #854d0e; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;">Vence em ${daysDiff} dias</span>
                  </div>
                  <p style="margin: 4px 0; color: #78350f; font-size: 14px;"><strong>Data de Vencimento:</strong> ${dueDateFormatted}</p>
                  <p style="margin: 4px 0; color: #78350f; font-size: 14px;"><strong>Empresa:</strong> ${compName}</p>
                  <p style="margin: 4px 0; color: #78350f; font-size: 14px;"><strong>Regime:</strong> ${compRegime === 'simples' ? 'Simples Nacional' : compRegime}</p>
                </div>

                <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                  Acesse o portal contábil para conferir a emissão da guia, efetuar o pagamento e anexar o comprovante para conferência do escritório.
                </p>

                <div style="text-align: center; margin: 32px 0 20px 0;">
                  <a href="${portalUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: 600; font-size: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(5,150,105,0.25);">
                    Acessar Calendário & Documentos
                  </a>
                </div>

                <p style="color: #94a3b8; font-size: 12px; line-height: 1.4; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center;">
                  E-mail automático enviado pelo Portal Contábil Integrado &bull; Golden Contabilidade.
                </p>
              </div>
            </div>
          `

          const message = new MailerMessage({
            from: { address: senderEmail, name: senderName },
            to: [{ address: clientEmail }],
            subject: `[Lembrete Fiscal] Vencimento de ${reqName} em ${dueDateFormatted} - ${compName}`,
            html: htmlBody,
          })

          try {
            $app.newMailClient().send(message)
            emailsSent++

            // Save record in notification_reminders
            const newReminder = new Record(remindersCol)
            newReminder.set('company', comp.id)
            newReminder.set('requirement_name', reqName)
            newReminder.set('recipient_email', clientEmail)
            newReminder.set('due_date', dueDateFormatted)
            newReminder.set('reference_key', refKey)
            newReminder.set('sent_at', new Date().toISOString())
            newReminder.set('status', 'sent')
            $app.save(newReminder)

            console.log(
              `[Reminder Sent] ${reqName} email sent to ${clientEmail} for company ${compName}`,
            )
          } catch (sendErr) {
            console.log(
              `[Reminder Mail Error] Failed for ${clientEmail}:`,
              sendErr ? sendErr.message : sendErr,
            )
          }
        }
      }
    }

    console.log(`[Cron Finished] Sent ${emailsSent} tax obligation reminder emails.`)
  } catch (err) {
    console.log('[Cron Error] tax_obligation_reminders failed:', err ? err.message : err)
  }
})

// HTTP Endpoint to trigger manual dispatch / test check from UI (accountant or client)
routerAdd(
  'POST',
  '/backend/v1/reminders/trigger-check',
  (e) => {
    try {
      const companies = $app.findRecordsByFilter('companies', "status = 'active'", 'name', 500, 0)
      const requirements = $app.findRecordsByFilter('tax_regimes_requirements', '', 'id', 500, 0)

      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth()
      const currentDay = now.getDate()

      let sentCount = 0
      const remindersCol = $app.findCollectionByNameOrId('notification_reminders')

      const siteUrl = $os.getenv('SITE_URL') || 'https://portal-contabil-integrado-89d80.goskip.app'
      const portalUrl = siteUrl + '/cliente/dashboard'

      const senderEmail =
        ($app.settings() && $app.settings().meta && $app.settings().meta.senderAddress) ||
        'suporte@portalcontabil.com'
      const senderName =
        ($app.settings() && $app.settings().meta && $app.settings().meta.senderName) ||
        'Golden Contabilidade'

      const processedItems = []

      for (let i = 0; i < companies.length; i++) {
        const comp = companies[i]
        const ownerId = comp.getString('owner')
        if (!ownerId) continue

        let clientUser
        try {
          clientUser = $app.findRecordById('users', ownerId)
        } catch (_) {
          continue
        }

        const clientEmail = clientUser.email()
        if (!clientEmail) continue

        const clientName = clientUser.getString('name') || 'Cliente'
        const compName = comp.getString('name')
        const compRegime = comp.getString('tax_regime')

        const matchingReqs = requirements.filter(
          (req) => req.getString('regime_type') === compRegime,
        )

        for (let j = 0; j < matchingReqs.length; j++) {
          const req = matchingReqs[j]
          const reqName = req.getString('requirement_name')
          const freq = req.getString('frequency')
          const dueDay = req.getInt('due_day') || 20

          let appliesThisMonth = false
          if (freq === 'monthly') appliesThisMonth = true
          else if (freq === 'quarterly')
            appliesThisMonth = [0, 2, 3, 5, 6, 8, 9, 11].includes(currentMonth)
          else if (freq === 'annually') appliesThisMonth = [2, 4, 5, 6, 11].includes(currentMonth)

          if (!appliesThisMonth) continue

          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
          const actualDueDay = Math.min(dueDay, daysInMonth)
          const daysDiff = actualDueDay - currentDay

          // When manually checking, trigger for upcoming obligations within next 5 days
          const dueDateFormatted = `${String(actualDueDay).padStart(2, '0')}/${String(
            currentMonth + 1,
          ).padStart(2, '0')}/${currentYear}`

          const refKey = `${comp.id}_${req.id}_${currentYear}_${currentMonth + 1}`

          let alreadySent = false
          try {
            const existing = $app.findFirstRecordByData(
              'notification_reminders',
              'reference_key',
              refKey,
            )
            if (existing) alreadySent = true
          } catch (_) {}

          processedItems.push({
            company: compName,
            requirement: reqName,
            dueDate: dueDateFormatted,
            daysLeft: daysDiff,
            alreadySent,
          })

          if (!alreadySent && daysDiff >= -1 && daysDiff <= 5) {
            const htmlBody = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 12px;">
                <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                  <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 24px;">
                    <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 700;">Golden Contabilidade &bull; Lembrete Fiscal</h2>
                    <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Aviso de vencimento de obrigação tributária</p>
                  </div>

                  <p style="color: #334155; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    Olá, <strong>${clientName}</strong>!
                  </p>

                  <p style="color: #334155; font-size: 15px; line-height: 1.5;">
                    Este é um lembrete de que a obrigação fiscal da empresa <strong>${compName}</strong> está prevista para <strong>${dueDateFormatted}</strong>:
                  </p>

                  <div style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <strong style="color: #92400e; font-size: 16px;">${reqName}</strong>
                      <span style="background-color: #fef08a; color: #854d0e; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;">Vencimento Próximo</span>
                    </div>
                    <p style="margin: 4px 0; color: #78350f; font-size: 14px;"><strong>Data Limite:</strong> ${dueDateFormatted}</p>
                    <p style="margin: 4px 0; color: #78350f; font-size: 14px;"><strong>Empresa:</strong> ${compName}</p>
                    <p style="margin: 4px 0; color: #78350f; font-size: 14px;"><strong>Regime:</strong> ${compRegime === 'simples' ? 'Simples Nacional' : compRegime}</p>
                  </div>

                  <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                    Acesse o portal contábil para conferir a guia e anexar o comprovante de pagamento.
                  </p>

                  <div style="text-align: center; margin: 32px 0 20px 0;">
                    <a href="${portalUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: 600; font-size: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(5,150,105,0.25);">
                      Acessar Portal Contábil
                    </a>
                  </div>

                  <p style="color: #94a3b8; font-size: 12px; line-height: 1.4; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center;">
                    E-mail automático gerado pelo Portal Contábil Integrado &bull; Golden Contabilidade.
                  </p>
                </div>
              </div>
            `

            const message = new MailerMessage({
              from: { address: senderEmail, name: senderName },
              to: [{ address: clientEmail }],
              subject: `[Lembrete Fiscal] Vencimento de ${reqName} em ${dueDateFormatted} - ${compName}`,
              html: htmlBody,
            })

            try {
              $app.newMailClient().send(message)
              sentCount++

              const newReminder = new Record(remindersCol)
              newReminder.set('company', comp.id)
              newReminder.set('requirement_name', reqName)
              newReminder.set('recipient_email', clientEmail)
              newReminder.set('due_date', dueDateFormatted)
              newReminder.set('reference_key', refKey)
              newReminder.set('sent_at', new Date().toISOString())
              newReminder.set('status', 'sent')
              $app.save(newReminder)
            } catch (errSend) {
              console.log('Send error:', errSend)
            }
          }
        }
      }

      return e.json(200, {
        success: true,
        sentCount,
        checkedObligations: processedItems.length,
        items: processedItems,
      })
    } catch (err) {
      return e.json(500, { error: err ? err.message : String(err) })
    }
  },
  $apis.requireAuth(),
)
