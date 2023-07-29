'use strict'

const test = require('ava')

const inventories = require('tesla-inventory/inventories')

const teslaInventory = (inventory, opts) => require('..')(inventory, opts)

Object.keys(inventories).forEach(inventoryCode => {
  test(inventoryCode, async t => {
    t.plan(1)
    await teslaInventory(inventoryCode, { condition: 'used', model: 's' })
    t.pass()
  })
})

test('euro', t => {
  t.true(!!require('tesla-inventory/inventories/euro').EURO_COUNTRIES)
  t.true(!!require('tesla-inventory/inventories/euro').test)
  t.snapshot(require('tesla-inventory/inventories/euro').EURO_COUNTRIES)
})
