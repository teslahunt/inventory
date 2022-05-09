'use strict'

const test = require('ava')

const inventories = require('tesla-inventory/inventories')

const GOT_OPTS = { retry: 0, headers: { 'user-agent': 'googlebot' } }

const teslaInventory = (inventory, opts) => require('..')(inventory, opts, GOT_OPTS)

Object.keys(inventories).forEach(inventoryCode => {
  test(inventoryCode, async t => {
    t.plan(1)
    await teslaInventory(inventoryCode, { condition: 'used', model: 's' })
    t.pass()
  })
})
