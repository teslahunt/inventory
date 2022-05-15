'use strict'

const EURO_COUNTRIES = [
  'Austria',
  'Belgium',
  'Germany',
  'Spain',
  'Finland',
  'France',
  'Ireland',
  'Italy',
  'Luxembourg',
  'Netherlands',
  'Portugal',
  'Romania'
]

const test = inventory => EURO_COUNTRIES.includes(inventory.country)

module.exports = Object.fromEntries(
  Object.entries(require('.')).filter(([, inventory]) => test(inventory))
)

Object.defineProperty(module.exports, 'EURO_COUNTRIES', { value: EURO_COUNTRIES })
Object.defineProperty(module.exports, 'test', { value: test })
