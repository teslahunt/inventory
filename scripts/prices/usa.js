'use strict'

const path = require('path')

const { usa } = require('../../inventories')

require('.')({
  filepath: path.resolve(__dirname, '../../prices/usa.json'),
  inventories: { usa }
})
