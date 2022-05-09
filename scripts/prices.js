'use strict'

const teslaInventory = require('tesla-inventory')
const jsonFuture = require('json-future')
const { chain } = require('lodash')
const path = require('path')

const { flags } = require('meow')()

const { inventory, currency } = flags

if (!inventory) {
  throw new TypeError('Expected `--inventory` flag.')
}

if (!currency) {
  throw new TypeError('Expected `--currency` flag.')
}

const inventories =
  inventory === 'euro'
    ? require('tesla-inventory/inventories/euro')
    : { [inventory]: require('tesla-inventory/inventories')[inventory] }

const filepath = path.resolve(__dirname, `../src/prices/${currency}.json`)

const debug = require('debug-logfmt')(`tesla-inventory:price:${currency}`)

const GOT_OPTS = {
  headers: {
    'user-agent': 'googlebot'
  }
}

const MODEL_LETTER = ['s', '3', 'x', 'y']

const MODEL_CONDITION = ['used', 'new']

const sortObjectByKey = obj =>
  chain(obj)
    .toPairs()
    .sortBy(0)
    .fromPairs()
    .value()

const main = async ({ pricesByCode, inventories }) => {
  const addItem = item => {
    if (item.price) {
      const trimCode = item.code.replace('$', '')
      if (!trimCode.startsWith('MDL')) {
        if (!pricesByCode[trimCode] || pricesByCode[trimCode] > item.price) {
          debug('adding', { code: trimCode, price: item.price })
          pricesByCode[trimCode] = item.price
          debug(item)
        }
      }
    }
  }

  for (const inventoryCode in inventories) {
    for (const model of MODEL_LETTER) {
      for (const condition of MODEL_CONDITION) {
        try {
          const results = await teslaInventory(
            inventoryCode,
            {
              model,
              condition
            },
            GOT_OPTS
          )

          debug({ inventoryCode, model, condition })

          results.forEach(result => {
            result.FlexibleOptionsData.forEach(addItem)
            result.OptionCodeData.forEach(addItem)
          })
        } catch (err) {
          debug.error(err.message || err, { inventoryCode, model, condition })
        }
      }
    }
  }

  return pricesByCode
}

main({ pricesByCode: require(filepath), inventories }).then(data => {
  jsonFuture.save(filepath, sortObjectByKey(data))
  process.exit()
})
