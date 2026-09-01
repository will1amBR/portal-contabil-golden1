onRecordAfterCreateSuccess((e) => {
  const title = e.record.getString('title') || ''
  if (!title) return e.next()

  let category = 'legal'
  let payment_status = 'n/a'

  try {
    const prompt = `Classifique o seguinte documento contábil/financeiro baseado no seu título. 
    Retorne APENAS um objeto JSON válido (sem markdown, sem crases) com duas propriedades:
    "category": um dos seguintes valores: "tax", "payroll", "accounting", "legal".
    "isPayable": booleano true se for uma guia ou imposto a pagar, false caso contrário.
    Título: "${title}"`

    const reply = $ai.chat({
      model: 'fast',
      messages: [
        {
          role: 'system',
          content: 'Você é um classificador automático estrito. Responda apenas com JSON.',
        },
        { role: 'user', content: prompt },
      ],
    })

    const parsed = JSON.parse(reply.choices[0].message.content)
    if (parsed.category && ['tax', 'payroll', 'accounting', 'legal'].includes(parsed.category)) {
      category = parsed.category
    }
    if (parsed.isPayable) payment_status = 'pending'
  } catch (err) {
    console.log('Classification failed for record ' + e.record.id, err.message)
  }

  try {
    const embedRes = $ai.embed({ input: title })
    const record = $app.findRecordById('documents', e.record.id)
    record.set('suggested_category', category)
    record.set('original_suggested_category', category)
    record.set('validation_status', 'pending_confirmation')
    if (payment_status !== 'n/a' && !record.getString('payment_status')) {
      record.set('payment_status', payment_status)
    }
    record.set('embedding', embedRes.data[0].embedding)
    $app.save(record)
  } catch (err) {
    console.log('Embedding failed for record ' + e.record.id, err.message)
  }

  return e.next()
}, 'documents')
