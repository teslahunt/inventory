'use strict'

const path = require('path')

const inventories = Object.fromEntries(
  Object.entries(require('../../inventories')).filter(
    ([, { region }]) => region === 'North America'
  )
)

require('.')({
  filepath: path.resolve(__dirname, '../../prices/america.json'),
  inventories
})
