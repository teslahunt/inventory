'use strict'

const createBrowser = require('browserless')
const { onExit } = require('signal-exit')

const browser = () =>
  Promise.resolve(
    this.instance ||
      (this.instance = (() => {
        const browser = createBrowser({ puppeteer: require('puppeteer') })
        onExit(browser.close)
        return browser
      })())
  ).then(browser => browser.createContext())

const fetcher = async url => {
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

module.exports = { fetcher }
