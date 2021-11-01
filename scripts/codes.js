'use strict'

const jsonFuture = require('json-future')
const { chain } = require('lodash')
const cheerio = require('cheerio')
const got = require('got')

const sortObjectByKey = obj =>
  chain(obj)
    .toPairs()
    .sortBy(0)
    .fromPairs()
    .value()

const main = async () => {
  const body = await got('https://tesla-api.timdorr.com/vehicle/optioncodes', {
    resolveBodyOnly: true
  })

  const $ = cheerio.load(body)

  const codes = $(
    '#root > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div'
  )

  const optionCodes = codes
    .map(function (index) {
      if (index === 0) return null
      const el = $(this)
      const code = el.children('div:nth-child(1)').text()
      const title = el.children('div:nth-child(2)').text()
      return { code, title }
    })
    .get()
    .reduce((acc, { code, title }) => ({ ...acc, [code]: title }), {})

  if (Object.keys(optionCodes).length === 0) {
    throw new Error(
      'The target website has changed, selectors need to be rework.'
    )
  }

  jsonFuture.save('codes.json', sortObjectByKey(optionCodes))
}

main()
  .catch(err => console.error(err) && process.exit(1))
  .then(process.exit)
