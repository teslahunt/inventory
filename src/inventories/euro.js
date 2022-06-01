'use strict'

const EURO_COUNTRIES = [
  'Austria',
  'Belgium',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Ireland',
  'Italy',
  'Luxembourg',
  'Netherlands',
  'Portugal',
  'Slovenia',
  'Spain'
]

const test = inventory => EURO_COUNTRIES.includes(inventory.country)

module.exports = Object.fromEntries(
  Object.entries(require('.')).filter(([, inventory]) => test(inventory))
)

Object.defineProperty(module.exports, 'EURO_COUNTRIES', { value: EURO_COUNTRIES })
Object.defineProperty(module.exports, 'test', { value: test })
