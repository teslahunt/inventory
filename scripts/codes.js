'use strict'

const { Extractor } = require('markdown-tables-to-json')
const { decodeHTML } = require('entities')

const jsonFuture = require('json-future')
const { chain } = require('lodash')
const got = require('got')

const sortObjectByKey = obj =>
  chain(obj)
    .toPairs()
    .sortBy(0)
    .fromPairs()
    .value()

const main = async () => {
  const markdown = await got(
    'https://raw.githubusercontent.com/timdorr/tesla-api/master/docs/vehicle/optioncodes.md',
    { resolveBodyOnly: true }
  )

  const json = Extractor.extractObject(markdown, 'rows', false)

  const optionCodes = Object.keys(json).reduce((acc, code) => {
    const { Title: title, Description: description } = json[code]
    return { ...acc, [code]: decodeHTML(title || description) }
  }, {})

  jsonFuture.save('codes.json', sortObjectByKey(optionCodes))
}

main()
  .catch(err => console.error(err) && process.exit(1))
  .then(process.exit)
