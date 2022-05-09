'use strict'

const path = require('path')

const inventories = Object.fromEntries(
  Object.entries(require('tesla-inventory')).filter(([, { region }]) => region === 'North America')
)

require('.')({
  filepath: path.resolve(__dirname, '../../src/prices/america.json'),
  inventories
})
