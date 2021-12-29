'use strict'

const jsonFuture = require('json-future')
const { chain } = require('lodash')
const cheerio = require('cheerio')
const got = require('got')

const REGEX_ZERO_WIDTH_SPACE = /[\u200B-\u200D\uFEFF]/g

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
    '.gitbook-root > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div'
  )

  const text = el => el.text().replace(REGEX_ZERO_WIDTH_SPACE, '')

  const optionCodes = codes
    .map(function (index) {
      if (index === 0) return null
      const el = $(this)
      const code = text(el.children('div:nth-child(1)'))
      const title = text(el.children('div:nth-child(2)'))
      const description = text(el.children('div:nth-child(3)'))
      return { code, title, description }
    })
    .get()
    .reduce(
      (acc, { code, title, description }) => ({
        ...acc,
        [code]: title || description
      }),
      {}
    )

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
