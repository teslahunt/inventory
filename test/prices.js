'use strict'

const euroInventories = require('tesla-inventory/inventories/euro')
const test = require('ava')

const inventoryCodes = Object.entries(require('tesla-inventory/inventories'))
  .map(([inventoryCode, inventory]) => {
    if (euroInventories.test(inventory)) return undefined
    return inventoryCode
  })
  .filter(Boolean)
  .concat('euro')

inventoryCodes.forEach(inventoryCode => {
  test(inventoryCode, t => {
    const filepath = `tesla-inventory/prices/${inventoryCode}`
    t.is(typeof require(filepath), 'object')
  })
})
