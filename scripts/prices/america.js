'use strict'

const path = require('path')

const { ca, us } = require('../../inventories')

require('.')({
  filepath: path.resolve(__dirname, '../../prices/america.json'),
  inventories: { ca, us }
})
