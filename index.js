'use strict'

const got = require('got')

const inventories = require('./inventories')

const TESLA_INVENTORY_API =
  'https://www.tesla.com/inventory/api/v1/inventory-results'

module.exports = async (inventory, opts, { headers, ...gotOpts } = {}) => {
  const inventoryProps = inventories[inventory]

  if (!inventoryProps) {
    throw new TypeError(`Tesla inventory \`${inventory}\` not found!`)
  }

  if (opts.model && !opts.model.startsWith('m')) {
    opts.model = `m${opts.model}`
  }

  const { body } = await got(TESLA_INVENTORY_API, {
    responseType: 'json',
    searchParams: {
      query: JSON.stringify({
        count: 0,
        query: {
          ...inventoryProps,
          ...opts
        }
      })
    },
    ...gotOpts,
    headers: { 'user-agent': undefined, ...headers }
  })

  return body.results.filter(result => result.Model === opts.model)
}
