migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('documents')

    if (!col.fields.getByName('validation_status')) {
      col.fields.add(
        new SelectField({
          name: 'validation_status',
          values: ['pending', 'approved', 'rejected'],
          maxSelect: 1,
        }),
      )
    }

    if (!col.fields.getByName('validation_notes')) {
      col.fields.add(new TextField({ name: 'validation_notes' }))
    }

    if (!col.fields.getByName('validated_by')) {
      col.fields.add(
        new RelationField({
          name: 'validated_by',
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        }),
      )
    }

    if (!col.fields.getByName('validated_at')) {
      col.fields.add(new DateField({ name: 'validated_at' }))
    }

    col.listRule =
      "@request.auth.id != '' && (company.owner = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'accountant')"
    col.viewRule =
      "@request.auth.id != '' && (company.owner = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'accountant')"
    col.createRule = "@request.auth.id != '' && company.owner = @request.auth.id"
    col.updateRule = "@request.auth.role = 'admin' || @request.auth.role = 'accountant'"
    col.deleteRule = "@request.auth.role = 'admin'"

    col.addIndex('idx_documents_validation_status', false, 'validation_status', '')
    col.addIndex('idx_documents_company', false, 'company', '')

    app.save(col)

    try {
      const records = app.findRecordsByFilter('documents', '', '-created', 500, 0)
      for (const record of records) {
        if (!record.getString('validation_status')) {
          record.set('validation_status', 'pending')
          app.save(record)
        }
      }
    } catch (_) {}
  },
  (app) => {
    const col = app.findCollectionByNameOrId('documents')
    col.removeIndex('idx_documents_validation_status')
    col.removeIndex('idx_documents_company')
    app.save(col)
  },
)
