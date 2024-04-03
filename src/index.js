'use strict'

const timeSpan = require('@kikobeats/time-span')({ format: n => `${Math.round(n)}ms` })
const debug = require('debug-logfmt')('tesla-inventory')
const pRetry = require('p-retry')

const inventories = require('./inventories')

const ITEMS_PER_PAGE = 50

const uniqBy = (arr, prop) =>
  arr.filter((x, i, self) => i === self.findIndex(y => x[prop] === y[prop]))

const onFailedAttemptDefault = (error, debug) => debug.error(error)

module.exports =
  fetcher =>
    async (
      inventory,
      opts,
      { retries = 2, onFailedAttempt = onFailedAttemptDefault, ...fetcherOpts } = {}
    ) => {
      if (!inventories[inventory]) {
        throw new TypeError(`Tesla inventory \`${inventory}\` not found!`)
      }

      if (opts.model && !opts.model.startsWith('m')) {
        opts.model = `m${opts.model}`
      }

      const { country, ...query } = { ...inventories[inventory], ...opts }
      const domain = inventory === 'cn' ? 'cn' : 'com'
      const duration = timeSpan()

      const paginate = async (offset = 0) => {
        const url = new URL(
        `https://www.tesla.${domain}/inventory/api/v4/inventory-results?${new URLSearchParams({
          query: JSON.stringify({
            query,
            count: ITEMS_PER_PAGE,
            offset,
            outsideOffset: offset,
            outsideSearch: true
          })
        }).toString()}`
        ).toString()

        debug({ url, offset, ...query })

        const result = await pRetry(
          () =>
            fetcher(url, fetcherOpts).then(async body => {
              try {
                const data = JSON.parse(body)
                return { items: data.results ?? [] }
              } catch (error) {
                error.body = body
                throw error
              }
            }),
          {
            onFailedAttempt: error => onFailedAttempt(error, debug),
            retries
          }
        )

        return result
      }

      let offset = 0
      let items = []
      let page
      let pageIndex = -1

      do {
        page = await paginate(offset)
        ++pageIndex
        items = uniqBy(items.concat(page.items), 'VIN')
        offset = items.length
      } while ((pageIndex !== 0 || page.items.length >= ITEMS_PER_PAGE) && page.items.length > 0)

      debug.info({ inventory, ...opts, items: items.length, duration: duration() })

      return items.filter(item => item.Model === opts.model)
    }
