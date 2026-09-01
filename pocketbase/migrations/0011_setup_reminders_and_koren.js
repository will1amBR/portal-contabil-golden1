migrate(
  (app) => {
    // Ensure Koren Ambiental exists for William
    let william
    try {
      william = app.findAuthRecordByEmail('_pb_users_auth_', 'william@korenambiental.com')
    } catch (_) {}

    const companiesCol = app.findCollectionByNameOrId('companies')

    if (william) {
      try {
        app.findFirstRecordByData('companies', 'owner', william.id)
      } catch (_) {
        const koren = new Record(companiesCol)
        koren.set('name', 'Koren Ambiental LTDA')
        koren.set('cnpj', '48.912.340/0001-85')
        koren.set('tax_regime', 'simples')
        koren.set('owner', william.id)
        koren.set('status', 'active')
        app.save(koren)
      }
    }

    // Ensure notification_reminders table exists to prevent duplicate reminder emails
    try {
      app.findCollectionByNameOrId('notification_reminders')
    } catch (_) {
      const remindersCol = new Collection({
        name: 'notification_reminders',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          {
            name: 'company',
            type: 'relation',
            collectionId: companiesCol.id,
            required: false,
            maxSelect: 1,
          },
          { name: 'requirement_name', type: 'text', required: true },
          { name: 'recipient_email', type: 'text', required: true },
          { name: 'due_date', type: 'text', required: true },
          { name: 'reference_key', type: 'text', required: true },
          { name: 'sent_at', type: 'date', required: false },
          { name: 'status', type: 'text', required: false },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      })
      app.save(remindersCol)
    }
  },
  (app) => {
    try {
      const remindersCol = app.findCollectionByNameOrId('notification_reminders')
      app.delete(remindersCol)
    } catch (_) {}
  },
)
