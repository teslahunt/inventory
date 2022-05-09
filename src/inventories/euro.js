'use strict'

const EURO_COUNTRIES = [
  'Österreich',
  'Belgium',
  'Deutschland',
  'Spain',
  'Finland',
  'France',
  'Ireland',
  'Italy',
  'Luxembourg',
  'Netherlands',
  'Portugal',
  'România'
]

module.exports = Object.fromEntries(
  Object.entries(require('.')).filter(([, { country }]) => EURO_COUNTRIES.includes(country))
)
