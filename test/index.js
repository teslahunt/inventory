'use strict'

const test = require('ava')

const GOT_OPTS = { retry: 0, headers: { 'user-agent': 'googlebot' } }

const teslaInventory = (inventory, opts) => require('tesla-inventory')(inventory, opts, GOT_OPTS)

test('inventory identifier is mandatory', async t => {
  const error = await t.throwsAsync(() => teslaInventory(), {
    instanceOf: TypeError
  })

  t.is(error.message, 'Tesla inventory `undefined` not found!')
})

test('inventory should be valid', async t => {
  const error = await t.throwsAsync(
    () =>
      teslaInventory('unicorn', {
        condition: 'used',
        model: 's'
      }),
    {
      instanceOf: TypeError
    }
  )

  t.is(error.message, 'Tesla inventory `unicorn` not found!')
})

test('ensure results are consistent', async t => {
  const results = await teslaInventory('ie', {
    condition: 'used',
    model: 'y'
  })

  t.true(results.every(item => item.Model === 'my'))
})

test('Model S', async t => {
  const results = await teslaInventory('fr', {
    condition: 'used',
    model: 's'
  })

  t.true(results.every(item => item.Model === 'ms'))
})

test('Model 3', async t => {
  const results = await teslaInventory('fr', {
    condition: 'used',
    model: '3'
  })

  t.true(results.every(item => item.Model === 'm3'))
})

test('Model X', async t => {
  const results = await teslaInventory('fr', {
    condition: 'used',
    model: 'x'
  })

  t.true(results.every(item => item.Model === 'mx'))
})

test('Model Y', async t => {
  const results = await teslaInventory('us', {
    condition: 'used',
    model: 'y'
  })

  t.true(results.every(item => item.Model === 'my'))
})
