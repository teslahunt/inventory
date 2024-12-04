'use strict'

const { HeaderGenerator, PRESETS } = require('header-generator')
const createBrowser = require('browserless')
const tlsHook = require('https-tls/hook')
const { onExit } = require('signal-exit')
const got = require('got')

const headerGenerator = new HeaderGenerator(PRESETS.MODERN_WINDOWS_CHROME)

const browser = () =>
  Promise.resolve(
    this.instance ||
      (this.instance = (() => {
        const browser = createBrowser({ puppeteer: require('puppeteer') })
        onExit(browser.close)
        return browser
      })())
  ).then(browser => browser.createContext())

const fetcherBrowser = async url => {
  const browserless = await browser()

  const fn = browserless.evaluate(
    async (_, response, error) => {
      if (error) throw error
      const status = response.status()
      if (response.status() !== 200) throw new TypeError(`Response status: ${status}`)
      return response.text()
    },
    {
      abortTypes: ['image', 'stylesheet', 'font', 'other'],
      adblock: false,
      waitUntil: 'networkidle0',
      animations: true
    }
  )

  const result = await fn(url)
  await browserless.destroyContext()
  return result
}

const fetcher = url =>
  got(url, {
    headers: headerGenerator.getHeaders(),
    resolveBodyOnly: true,
    hooks: [tlsHook],
    https: { rejectUnauthorized: false },
    retry: 2,
    timeout: 8_000
  })

module.exports = { fetcher, fetcherBrowser }
