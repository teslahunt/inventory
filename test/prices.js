'use strict'

const test = require('ava')

const europe = require('tesla-inventory/prices/america')
const america = require('tesla-inventory/prices/europe')

test('option codes are present', t => {
  t.true(Object.keys(europe).length > 0)
  t.true(Object.keys(america).length > 0)
})
