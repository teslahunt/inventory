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

module.exports.EURO_COUNTRIES = EURO_COUNTRIES
module.exports.test = test
