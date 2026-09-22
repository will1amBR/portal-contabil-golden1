onRecordCreateRequest((e) => {
  const authUser = e.auth
  if (!authUser) {
    return e.unauthorizedError('Acesso restrito a usuários autenticados.')
  }

  const userId = authUser.id
  const userRole = authUser.getString('role') || 'client'
  const clientIp = e.requestInfo().remoteIp || 'unknown_ip'
  const key = `upload_${userId}_${clientIp}`

  // Rate limit: 40 uploads a cada 2 minutos por usuário
  const now = Date.now()
  const maxAttempts = 40
  const windowMs = 2 * 60 * 1000
  const blockDurationMs = 5 * 60 * 1000

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
        message: `Muitos uploads enviados simultaneamente. Aguarde ${remainingMinutes} minuto(s) para continuar.`,
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
        return e.json(429, {
          code: 429,
          message:
            'Limite de upload de documentos atingido temporariamente. Aguarde alguns minutos.',
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

  const doc = e.record
  const companyId = doc.getString('company')

  // Se o usuário for cliente comum, garantir que a empresa é dele
  if (userRole === 'client' && companyId) {
    try {
      const company = $app.findRecordById('companies', companyId)
      if (company.getString('owner') !== userId) {
        return e.forbiddenError('Você não tem permissão para anexar documentos a esta empresa.')
      }
    } catch (_) {
      return e.notFoundError('Empresa vinculada não foi encontrada.')
    }
  }

  return e.next()
}, 'documents')
