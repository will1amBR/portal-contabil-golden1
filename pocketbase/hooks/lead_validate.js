onRecordCreateRequest((e) => {
  const clientIp = e.requestInfo().remoteIp || 'unknown_ip'
  const key = `lead_create_${clientIp}`

  const now = Date.now()
  const maxAttempts = 5
  const windowMs = 10 * 60 * 1000 // 10 minutos
  const blockDurationMs = 15 * 60 * 1000 // 15 minutos

  let record
  try {
    record = $app.findFirstRecordByData('rate_limits', 'key', key)
  } catch (_) {
    record = null
  }

  if (record) {
    const blockedUntil = record.getInt('blocked_until') || 0
    if (blockedUntil > now) {
      const remainingMinutes = Math.ceil((blockedUntil - now) / 60000)
      return e.json(429, {
        code: 429,
        message: `Muitas solicitações enviadas em curto intervalo. Por segurança anti-spam, aguarde ${remainingMinutes} minuto(s) antes de enviar novamente.`,
      })
    }

    const resetAt = record.getInt('reset_at') || 0
    if (resetAt < now) {
      record.set('count', 1)
      record.set('reset_at', now + windowMs)
      record.set('blocked_until', 0)
      $app.save(record)
    } else {
      const count = (record.getInt('count') || 0) + 1
      if (count > maxAttempts) {
        record.set('count', count)
        record.set('blocked_until', now + blockDurationMs)
        $app.save(record)
        const remainingMinutes = Math.ceil(blockDurationMs / 60000)
        return e.json(429, {
          code: 429,
          message: `Limite de envios excedido. Por favor, aguarde ${remainingMinutes} minutos ou entre em contato pelo telefone/WhatsApp.`,
        })
      } else {
        record.set('count', count)
        $app.save(record)
      }
    }
  } else {
    try {
      const col = $app.findCollectionByNameOrId('rate_limits')
      const newRec = new Record(col)
      newRec.set('key', key)
      newRec.set('count', 1)
      newRec.set('reset_at', now + windowMs)
      newRec.set('blocked_until', 0)
      $app.save(newRec)
    } catch (_) {}
  }

  // Validação e sanitização server-side
  const lead = e.record
  const name = (lead.getString('name') || '').trim()
  const email = (lead.getString('email') || '').trim().toLowerCase()
  const phone = (lead.getString('phone') || '').trim()
  const cnpj = (lead.getString('cnpj') || '').trim()

  if (!name || name.length < 2) {
    return e.json(400, {
      message: 'Nome obrigatório (ao menos 2 caracteres).',
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return e.json(400, {
      message: 'E-mail corporativo inválido. Verifique o formato digitado.',
    })
  }

  if (cnpj) {
    const rawCnpj = cnpj.replace(/\D/g, '')
    if (rawCnpj.length > 0 && rawCnpj.length !== 14) {
      return e.json(400, {
        message: 'CNPJ deve conter exatamente 14 dígitos numéricos.',
      })
    }
  }

  if (phone) {
    const rawPhone = phone.replace(/\D/g, '')
    if (rawPhone.length > 0 && (rawPhone.length < 10 || rawPhone.length > 11)) {
      return e.json(400, {
        message: 'Telefone/WhatsApp deve conter DDD e número válido (10 ou 11 dígitos).',
      })
    }
  }

  lead.set('name', name)
  lead.set('email', email)
  lead.set('phone', phone)
  lead.set('cnpj', cnpj)

  return e.next()
}, 'leads')
