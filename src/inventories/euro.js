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

module.exports = Object.fromEntries(
  Object.entries(require('.')).filter(([, { country }]) => EURO_COUNTRIES.includes(country))
)
