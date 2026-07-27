migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('documents')

    if (!col.fields.getByName('suggested_category')) {
      col.fields.add(
        new SelectField({
          name: 'suggested_category',
          values: ['tax', 'payroll', 'accounting', 'legal'],
          maxSelect: 1,
        }),
      )
    }

    const savedStatuses = {}
    try {
      const records = app.findRecordsByFilter('documents', '', '-created', 500, 0)
      for (const r of records) {
        savedStatuses[r.id] = r.getString('validation_status')
      }
    } catch (_) {}

    col.fields.removeByName('validation_status')
    col.fields.add(
      new SelectField({
        name: 'validation_status',
        values: ['pending', 'approved', 'rejected', 'pending_confirmation'],
        maxSelect: 1,
      }),
    )

    app.save(col)

    for (const id in savedStatuses) {
      const val = savedStatuses[id]
      if (val) {
        app
          .db()
          .newQuery('UPDATE documents SET validation_status = {:val} WHERE id = {:id}')
          .bind({ val: val, id: id })
          .execute()
      }
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('documents')

    if (col.fields.getByName('suggested_category')) {
      col.fields.removeByName('suggested_category')
    }

    col.fields.removeByName('validation_status')
    col.fields.add(
      new SelectField({
        name: 'validation_status',
        values: ['pending', 'approved', 'rejected'],
        maxSelect: 1,
      }),
    )

    app.save(col)
  },
)
