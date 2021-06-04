'use strict'

const path = require('path')

// only countries with EURO currency
const {
  cz, // Croatia coin is not Euro
  se, // Sweden coin is not Euro
  dk, // Denmark coin is not Euro
  hu, // Hungary coin is not not EU
  is, // Island is not EU
  ch, // Switzerland is not EU
  gb, // United Kingdom is not EU
  no, // Norgway is not EU
  usa, // United States is not EU
  ca, // Canada is not EU
  ...inventories
} = require('../../inventories')

require('.')({
  filepath: path.resolve(__dirname, '../../prices/europe.json'),
  inventories
})
