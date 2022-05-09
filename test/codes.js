'use strict'

const test = require('ava')

const codes = require('tesla-inventory/codes')

test('option codes are present', t => {
  t.true(Object.keys(codes).length > 0)
})
