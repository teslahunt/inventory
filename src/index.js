'use strict'

const inventories = require('./inventories')

const got = require('got').extend({
  url: 'https://www.tesla.com/inventory/api/v1/inventory-results',
  responseType: 'json',
  resolveBodyOnly: true
})

const toLowerCase = ({ results: items, total_matches_found: totalMatchesFound }) => ({
  items,
  total: Number(totalMatchesFound)
})

const ITEMS_PER_PAGE = 50

module.exports = async (inventory, opts, { headers, ...gotOpts } = {}) => {
  if (!inventories[inventory]) {
    throw new TypeError(`Tesla inventory \`${inventory}\` not found!`)
  }

  const inventoryProps = inventories[inventory]

  if (opts.model && !opts.model.startsWith('m')) {
    opts.model = `m${opts.model}`
  }

  const paginate = (outsideOffset = 0) =>
    got({
      searchParams: {
        query: JSON.stringify({
          outsideOffset,
          count: 0,
          query: {
            ...inventoryProps,
            ...opts
          }
        })
      },
      ...gotOpts,
      headers: { 'user-agent': undefined, ...headers }
    }).then(toLowerCase)

  const page = await paginate()
  if (page.total < ITEMS_PER_PAGE) return page.items

  const nRequests = Math.ceil(page.total / ITEMS_PER_PAGE) - 1
  const offsets = [...Array(nRequests).keys()].map(n => (n + 1) * page.items.length)
  const pages = await Promise.all(offsets.map(paginate))
  return pages.reduce((acc, { items }) => acc.concat(items), page.items)
}