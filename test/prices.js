'use strict'

const test = require('ava')

;['cad', 'eur', 'usd'].forEach(currency => {
  test(currency, t => {
    t.true(Object.keys(require(`tesla-inventory/prices/${currency}`)).length > 0)
  })
})
