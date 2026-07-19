routerAdd(
  'POST',
  '/backend/v1/ask-stream',
  (e) => {
    try {
      const body = e.requestInfo().body || {}
      const userId = e.auth?.id
      if (!userId) return e.unauthorizedError('auth required')

      const conv = $ai.agent('accounting-assistant').getOrCreateConversation({
        user_id: userId,
        id: body.conversation_id || null,
      })
      const iter = $ai.agent('accounting-assistant').chat({
        user_id: userId,
        conversation_id: conv.id,
        message: body.message,
        stream: true,
      })
      e.response.header().set('Content-Type', 'text/event-stream')
      e.response.header().set('Cache-Control', 'no-cache')
      e.response.header().set('X-Conversation-Id', conv.id)
      $response.stream(e, iter)
    } catch (err) {
      if (err.name === 'SkipAiConfigError')
        return e.json(503, { error: 'AI temporarily unavailable' })
      if (err.name === 'SkipAiAgentsError') {
        const status = err.status || 500
        return e.json(status, { error: status >= 500 ? 'agent request failed' : err.message })
      }
      throw err
    }
  },
  $apis.requireAuth(),
)

routerAdd(
  'GET',
  '/backend/v1/chats',
  (e) => {
    const userId = e.auth?.id
    if (!userId) return e.unauthorizedError('auth required')
    const limit = parseInt(e.requestInfo().query?.limit || '20', 10) || 20
    return e.json(
      200,
      $ai.agent('accounting-assistant').listConversations({ user_id: userId, limit }),
    )
  },
  $apis.requireAuth(),
)

routerAdd(
  'GET',
  '/backend/v1/chats/{conversationId}/messages',
  (e) => {
    try {
      const userId = e.auth?.id
      if (!userId) return e.unauthorizedError('auth required')
      return e.json(
        200,
        $ai.agent('accounting-assistant').listMessages({
          conversation_id: e.request.pathValue('conversationId'),
          user_id: userId,
        }),
      )
    } catch (err) {
      if (err.name === 'SkipAiAgentsError') {
        const status = err.status || 500
        return e.json(status, { error: status >= 500 ? 'conversation lookup failed' : err.message })
      }
      throw err
    }
  },
  $apis.requireAuth(),
)
