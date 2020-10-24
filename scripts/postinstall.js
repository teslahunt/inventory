'use strict'

const writeJsonFile = require('write-json-file')
const cheerio = require('cheerio')
const got = require('got')

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

  const optionCodes = codes.reduce((acc, code, index) => {
    return { ...acc, [code]: titles[index] }
  }, {})

  await writeJsonFile('codes.json', optionCodes)
}

main()
  .catch(err => console.error(err) && process.exit(1))
  .then(process.exit)
