'use strict'

const { chain } = require('lodash')

const sortObjectByKey = obj =>
  chain(obj)
    .toPairs()
    .sortBy(0)
    .fromPairs()
    .value()

module.exports = { sortObjectByKey }
