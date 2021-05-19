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

  const table = $('tbody')

  const [, ...codes] = table
    .find('tr td:nth-child(1)')
    .map(function () {
      return $(this).text()
    })
    .get()

  const [, ...titles] = table
    .find('tr td:nth-child(2)')
    .map(function () {
      return $(this).text()
    })
    .get()

  const optionCodes = codes.reduce(
    (acc, code, index) => ({ ...acc, [code]: titles[index] }),
    {}
  )

  jsonFuture.save('codes.json', sortObjectByKey(optionCodes))
}

main()
  .catch(err => console.error(err) && process.exit(1))
  .then(process.exit)
