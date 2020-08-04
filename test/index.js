'use strict'

const test = require('ava')

const teslaInventory = require('..')

test('inventory identifier is mandatory', async t => {
  const error = await t.throwsAsync(() => teslaInventory(), {
    instanceOf: TypeError
  })

  t.is(error.message, 'Tesla inventory `undefined` not found!')
})
