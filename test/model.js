'use strict'

const test = require('ava')

const teslaInventory = require('..')

test('works with Model S', async t => {
  const results = await teslaInventory('fr', {
    condition: 'used',
    model: 's'
  })

  t.true(results.every(item => item.Model === 'ms'))
})

test('works with Model X', async t => {
  const results = await teslaInventory('fr', {
    condition: 'used',
    model: 'x'
  })

  t.true(results.every(item => item.Model === 'mx'))
})

test('works with Model 3', async t => {
  const results = await teslaInventory('fr', {
    condition: 'used',
    model: '3'
  })

  t.true(results.every(item => item.Model === 'm3'))
})
