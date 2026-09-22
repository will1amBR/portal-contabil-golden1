migrate(
  (app) => {
    if (!app.hasTable('rate_limits')) {
      const rateLimits = new Collection({
        name: 'rate_limits',
        type: 'base',
        listRule: null, // superuser/backend only
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: 'key', type: 'text', required: true },
          { name: 'count', type: 'number', required: false },
          { name: 'reset_at', type: 'number', required: false },
          { name: 'blocked_until', type: 'number', required: false },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE UNIQUE INDEX idx_rate_limits_key ON rate_limits (key)'],
      })
      app.save(rateLimits)
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('rate_limits')
      app.delete(col)
    } catch (_) {}
  },
)
