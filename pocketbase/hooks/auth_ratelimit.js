onRecordAuthWithPasswordRequest((e) => {
  const clientIp = e.requestInfo().remoteIp || 'unknown_ip'
  const body = e.requestInfo().body || {}
  const identity = (body.identity || body.email || '').toLowerCase().trim()
  const key = `auth_${clientIp}_${identity}`

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
        message: `Muitas tentativas de login com dados incorretos. Por segurança, sua conta/IP está temporariamente bloqueada por mais ${remainingMinutes} minuto(s).`,
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
          message: `Limite de tentativas excedido (5 tentativas em 10 min). Acesso temporariamente suspenso por ${remainingMinutes} minutos.`,
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

  return e.next()
}, 'users')
