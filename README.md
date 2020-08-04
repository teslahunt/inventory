# tesla-inventory

> Retrieve real-time data from Tesla Inventory.

## Install

```bash
$ npm install tesla-inventory --save
```

## Usage

```js
(async () => {
  const teslaInventory = require('tesla-inventory')
  const results = await teslaInventory('fr', { model: 's', condition: 'used' })
})()
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
