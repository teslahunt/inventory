'use strict'

const test = require('ava')
const { fetcher } = require('./util')

const teslaInventory = (inventory, opts) => require('tesla-inventory')(fetcher)(inventory, opts)

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
  {
    const results = await teslaInventory('us', { condition: 'used', model: '3' })
    t.true(results.every(item => item.Model === 'm3'))
    const vins = results.map(item => item.VIN)
    t.is(vins.length, [...new Set(vins)].length)
  }
  {
    const results = await teslaInventory('pr', { condition: 'new', model: 's' })
    t.true(results.every(item => item.Model === 'ms'))
    const vins = results.map(item => item.VIN)
    t.is(vins.length, [...new Set(vins)].length)
  }
})

test('Model S used', async t => {
  const results = await teslaInventory('us', {
    condition: 'used',
    model: 's'
  })

  t.true(results.every(item => item.Model === 'ms'))
})

test('Model S new', async t => {
  const results = await teslaInventory('us', {
    condition: 'new',
    model: 's'
  })

  t.true(results.every(item => item.Model === 'ms'))
})

test('Model 3 used', async t => {
  const results = await teslaInventory('us', {
    condition: 'used',
    model: '3'
  })

  t.true(results.every(item => item.Model === 'm3'))
})

test('Model 3 new', async t => {
  const results = await teslaInventory('us', {
    condition: 'new',
    model: '3'
  })

  t.true(results.every(item => item.Model === 'm3'))
})

test('Model X used', async t => {
  const results = await teslaInventory('us', {
    condition: 'used',
    model: 'x'
  })

  t.true(results.every(item => item.Model === 'mx'))
})

test('Model X new', async t => {
  const results = await teslaInventory('us', {
    condition: 'new',
    model: 'x'
  })

  t.true(results.every(item => item.Model === 'mx'))
})

test('Model Y used', async t => {
  const results = await teslaInventory('us', {
    condition: 'used',
    model: 'y'
  })

  t.true(results.every(item => item.Model === 'my'))
})

test('Model Y used (China)', async t => {
  const results = await teslaInventory('cn', {
    condition: 'used',
    model: 'y'
  })

  t.true(results.every(item => item.Model === 'my'))
})

test('Model Y new', async t => {
  const results = await teslaInventory('us', {
    condition: 'new',
    model: 'y'
  })

  t.true(results.every(item => item.Model === 'my'))
})

test('Model Y new (Puerto Rico)', async t => {
  const results = await teslaInventory('pr', {
    condition: 'new',
    model: 'y'
  })

  t.true(results.every(item => item.Model === 'my'))
})
