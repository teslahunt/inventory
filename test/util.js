const createBrowser = require('browserless')
const { onExit } = require('signal-exit')
const puppeteer = require('puppeteer')

const browser = createBrowser({ puppeteer })

onExit(browser.close)

const fetcher = async url => {
  const browserless = await browser.createContext()

  const fn = browserless.evaluate(
    async (page, response, error) => {
      if (!error) return response.text()
      console.error(error)
      throw error
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
