'use strict'

const debug = require('debug-logfmt')('tesla-inventory')
const pRetry = require('p-retry')

const inventories = require('./inventories')

const timestamp =
  (start = process.hrtime.bigint()) =>
    () =>
      Math.round(Number(process.hrtime.bigint() - start) / 1e6) + 'ms'

const uniqBy = (arr, prop) =>
  arr.filter((x, i, self) => i === self.findIndex(y => x[prop] === y[prop]))

const ITEMS_PER_PAGE = 50

module.exports =
  fetcher =>
    async (inventory, opts, { retries = 2, ...fetcherOpts } = {}) => {
      if (!inventories[inventory]) {
        throw new TypeError(`Tesla inventory \`${inventory}\` not found!`)
      }

      if (opts.model && !opts.model.startsWith('m')) {
        opts.model = `m${opts.model}`
      }

      const { country, ...query } = { ...inventories[inventory], ...opts }

      const duration = timestamp()

      const paginate = async (offset = 0) => {
        const url = new URL(
        `https://www.tesla.com/inventory/api/v1/inventory-results?${new URLSearchParams({
          query: JSON.stringify({
            query,
            count: ITEMS_PER_PAGE,
            offset,
            outsideOffset: 0,
            outsideSearch: false
          })
        }).toString()}`
        ).toString()

        debug({ url, ...query })

        const result = await pRetry(
          () =>
            fetcher(url, fetcherOpts).then(async text => {
              const body = JSON.parse(text)
              return { items: body.results ?? [] }
            }),
          {
            onFailedAttempt: debug.error,
            retries
          }
        )

        return result
      }

      let offset = 0
      let items = []
      let page

      do {
        page = await paginate(offset)
        items = uniqBy(items.concat(page.items), 'VIN')
        offset = items.length
        debug.info({ ...opts, items: items.length, duration: duration() })
      } while (page.items.length >= ITEMS_PER_PAGE)

      return items.filter(item => item.Model === opts.model)
    }
