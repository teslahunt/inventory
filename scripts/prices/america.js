'use strict'

const path = require('path')

const { ca, usa } = require('../../inventories')

require('.')({
  filepath: path.resolve(__dirname, '../../prices/america.json'),
  inventories: { ca, usa }
})
