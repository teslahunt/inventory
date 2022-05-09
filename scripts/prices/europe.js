'use strict'

const path = require('path')

const NON_EURO_COUNTRIES = ['cz', 'se', 'dk', 'hu', 'is', 'ch', 'gb', 'no']

const inventories = Object.fromEntries(
  Object.entries(require('tesla-inventory')).filter(
    ([code, { region }]) => region === 'Europe' && !NON_EURO_COUNTRIES.includes(code)
  )
)

require('.')({
  filepath: path.resolve(__dirname, '../../src/prices/europe.json'),
  inventories
})
