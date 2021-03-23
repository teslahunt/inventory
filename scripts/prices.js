'use strict'

const jsonFuture = require('json-future')
const { chain } = require('lodash')

const teslaInventory = require('..')

// only countries with EURO currency
const {
  cz, // Croatia  coin is not Euro
  se, // Sweden coin is not Euro
  dk, // Denmark coin is not Euro
  is, // Island is not EU
  ch, // Switzerland is not EU
  gb, // United Kingdom is not EU
  no, // Norgway is not EU
  us, // United States is not EU
  ...teslaInventories
} = require('../inventories')

const MODEL_LETTER = ['x', 's', '3']

const MODEL_CONDITION = ['used', 'new']

const pricesByCode = require('../prices')

const sortObjectByKey = obj =>
  chain(obj)
    .toPairs()
    .sortBy(0)
    .fromPairs()
    .value()

const addItem = item => {
  if (item.price) {
    const trimCode = item.code.replace('$', '')
    if (!trimCode.startsWith('MDL')) {
      if (!pricesByCode[trimCode] || pricesByCode[trimCode] > item.price) {
        console.log('adding', trimCode, item.price)
        pricesByCode[trimCode] = item.price
        console.log(JSON.stringify(item, null, 2))
        console.log('---')
      }
    }
  }
}

const main = async () => {
  for (const inventoryName in teslaInventories) {
    for (const model of MODEL_LETTER) {
      for (const condition of MODEL_CONDITION) {
        const results = await teslaInventory(inventoryName, {
          model,
          condition
        })

        console.log({ inventoryName, model, condition })

        results.forEach(result => {
          result.FlexibleOptionsData.forEach(addItem)
          result.OptionCodeData.forEach(addItem)
        })
      }
    }
  }

  return pricesByCode
}

main().then(data => {
  jsonFuture.save('prices.json', sortObjectByKey(data))
  process.exit()
})
