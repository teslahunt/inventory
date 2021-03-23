<div align="center">
  <img src="https://teslahunt.io/banner-red.png" alt="@teslahunt/title">
  <br><br>
</div>

![Last version](https://img.shields.io/github/tag/Kikobeats/tesla-inventory.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/com/teslahunt/tesla-inventory/master.svg?style=flat-square)](https://travis-ci.com/github/teslahunt/tesla-inventory)
[![Coverage Status](https://img.shields.io/coveralls/Kikobeats/tesla-inventory.svg?style=flat-square)](https://coveralls.io/github/Kikobeats/tesla-inventory)
[![Dependency status](https://img.shields.io/david/Kikobeats/tesla-inventory.svg?style=flat-square)](https://david-dm.org/Kikobeats/tesla-inventory)
[![Dev Dependencies Status](https://img.shields.io/david/dev/Kikobeats/tesla-inventory.svg?style=flat-square)](https://david-dm.org/Kikobeats/tesla-inventory#info=devDependencies)
[![NPM Status](https://img.shields.io/npm/dm/tesla-inventory.svg?style=flat-square)](https://www.npmjs.org/package/tesla-inventory)

> Retrieve real-time data from Tesla Inventory.

## Install

```bash
$ npm install tesla-inventory --save
```

## Usage

```js
const teslaInventory = require('tesla-inventory')

teslaInventory('fr', {
  model: 's',
  condition: 'used'
}).then(results => console.log(results))
```

## API

### teslaInventory(inventory, [query], [gotOpts])

#### inventory

*Required*<br>
Type: `string`

The Tesla Inventory identifier, see [`inventories`](/inventories.js).

#### query

Type: `object`

The query options to be passed agaisnt [Tesla Inventory API](https://www.tesla.com/inventory/api/v1/inventory-results).

These options can be:

- **arrangeby**: Price
- **condition**: used|new
- **model**: ms|mx|m3
- **order**: asc|desc

## License

**tesla-inventory** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/Kikobeats/tesla-inventory/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/Kikobeats/tesla-inventory/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · Twitter [@Kikobeats](https://twitter.com/Kikobeats)
