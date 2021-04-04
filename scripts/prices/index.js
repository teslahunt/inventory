'use strict'

const debug = require('debug-logfmt')('price')
const jsonFuture = require('json-future')
const { chain } = require('lodash')

const teslaInventory = require('../..')

const GOT_OPTS = {
  headers: {
    'user-agent': 'googlebot'
  }
}

const MODEL_LETTER = ['x', 's', '3']

const MODEL_CONDITION = ['used', 'new']

const sortObjectByKey = obj =>
  chain(obj)
    .toPairs()
    .sortBy(0)
    .fromPairs()
    .value()

const run = async ({ pricesByCode, inventories }) => {
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

  for (const inventoryName in inventories) {
    for (const model of MODEL_LETTER) {
      for (const condition of MODEL_CONDITION) {
        const results = await teslaInventory(
          inventoryName,
          {
            model,
            condition
          },
          GOT_OPTS
        )

        debug({ inventoryName, model, condition })

        results.forEach(result => {
          result.FlexibleOptionsData.forEach(addItem)
          result.OptionCodeData.forEach(addItem)
        })
      }
    }
  }

  return pricesByCode
}

module.exports = ({ inventories, filepath }) => {
  const pricesByCode = require(filepath)

  run({ pricesByCode, inventories }).then(data => {
    jsonFuture.save(filepath, sortObjectByKey(data))
    process.exit()
  })
}
