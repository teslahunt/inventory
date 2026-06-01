'use strict'

const { decodeHTML } = require('entities')
const jsonFuture = require('json-future')

const { sortObjectByKey } = require('./util')

const parseCells = line =>
  line
    .replace(/^\||\|$/g, '')
    .split('|')
    .map(s => s.trim())

const parseMarkdownTable = markdown => {
  const lines = markdown.split('\n').filter(line => line.includes('|'))
  const [headerLine, , ...dataLines] = lines
  const headers = parseCells(headerLine)
  const result = {}
  for (const line of dataLines) {
    const cells = parseCells(line)
    const key = cells[0]
    if (key) {
      result[key] = {}
      for (let i = 1; i < headers.length; i++) {
        result[key][headers[i]] = cells[i] || ''
      }
    }
  }
  return result
}

const main = async () => {
  const res = await fetch(
    'https://raw.githubusercontent.com/timdorr/tesla-api/master/docs/vehicle/optioncodes.md'
  )
  const markdown = await res.text()
  const json = parseMarkdownTable(markdown)

  const optionCodes = Object.keys(json).reduce((acc, code) => {
    const { Title: title, Description: description } = json[code]
    return { ...acc, [code]: decodeHTML(title || description) }
  }, {})

  jsonFuture.save('src/codes.json', sortObjectByKey(optionCodes))
}

main().catch(error => console.error(error) || process.exit(1))
