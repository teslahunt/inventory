'use strict'

const debug = require('debug-logfmt')('tesla-inventory')
const inventories = require('./inventories')

const timestamp = (start = process.hrtime.bigint()) => () =>
  Math.round(Number(process.hrtime.bigint() - start) / 1e6) + 'ms'

const got = require('got').extend({
  url: 'https://www.tesla.com/inventory/api/v1/inventory-results',
  responseType: 'json',
  resolveBodyOnly: true
})

const toLowerCase = ({ results: items, total_matches_found: totalMatchesFound, ...rest }) => {
  return {
    items,
    total: Number(totalMatchesFound)
  }
}

const uniqBy = (arr, prop) =>
  arr.filter((x, i, self) => i === self.findIndex(y => x[prop] === y[prop]))

const ITEMS_PER_PAGE = 50

module.exports = async (inventory, opts, { headers, ...gotOpts } = {}) => {
  if (!inventories[inventory]) {
    throw new TypeError(`Tesla inventory \`${inventory}\` not found!`)
  }

  const { country, ...query } = { ...inventories[inventory], ...opts }

  if (opts.model && !opts.model.startsWith('m')) {
    opts.model = `m${opts.model}`
  }

  const duration = timestamp()

  const paginate = async (offset = 0) =>
    got({
      searchParams: {
        query: JSON.stringify({
          query,
          count: ITEMS_PER_PAGE,
          offset,
          outsideOffset: offset
        })
      },
      ...gotOpts,
      headers: { 'user-agent': undefined, ...headers }
    }).then(toLowerCase)

  let offset = 0
  let items = []
  let page

  do {
    page = await paginate(offset)
    items = uniqBy(items.concat(page.items), 'VIN')
    offset = items.length
    debug({ items: items.length, duration: duration() })
  } while (page.items.length >= ITEMS_PER_PAGE)

  return items.filter(item => item.Model === opts.model)
}
