'use strict'

const teslaInventory = require('tesla-inventory')(require('../test/util').fetcher)
const euroInventories = require('tesla-inventory/inventories/euro')
const inventories = require('tesla-inventory/inventories')
const jsonFuture = require('json-future')
const path = require('path')

const { sortObjectByKey } = require('./util')

const MODEL_LETTER = ['s', '3', 'x', 'y']

const MODEL_CONDITION = ['used', 'new']

const main = async inventories => {
  for (const [inventoryCode, inventory] of Object.entries(inventories)) {
    const isEuroInventory = euroInventories.test(inventory)
    const filename = isEuroInventory ? 'euro' : inventoryCode
    const filepath = path.resolve(__dirname, `../src/prices/${filename}.json`)
    const debug = require('debug-logfmt')(`tesla-inventory:price:${filename}`)
    const pricesByCode = require(filepath)

    const addItem = item => {
      if (item.price) {
        const trimCode = item.code.replace('$', '')
        if (!trimCode.startsWith('MDL')) {
          if (!pricesByCode[trimCode] || pricesByCode[trimCode] > item.price) {
            debug.info('adding', { inventory: filename, code: trimCode, price: item.price })
            pricesByCode[trimCode] = item.price
          }
        }
      }
    }
    for (const model of MODEL_LETTER) {
      for (const condition of MODEL_CONDITION) {
        try {
          const results = await teslaInventory(inventoryCode, { model, condition })
          debug({ inventory: filename, model, condition })
          results.forEach(result => result.OptionCodePricing.forEach(addItem))
        } catch (err) {
          debug.error(err.message || err, { inventoryCode, model, condition })
        }
      }
    }
    jsonFuture.save(filepath, sortObjectByKey(pricesByCode))
  }
}

main(inventories).then(process.exit)
