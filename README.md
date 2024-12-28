# Simple Web UI Library

Bundled up *common* UI tools with a lot of helpers extended into jQuery

**Note: This package is blocking as it waits for all the dependent modules to load from CDN. It is highly recommended that you use jQuery's ready event before attempting to use these methods.

| Package                                                                                                                  | Accessed Via                                                                                                                                          | Loaded From |
|--------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| [jQuery](https://jquery.com/)                                                                                            | `$`                                                                                                                                                   | Bundled     |
| [Bootstrap](https://getbootstrap.com/)                                                                                   |                                                                                                                                                       | CDN         |
| [Bootstrap Modals](https://getbootstrap.com/docs/5.3/components/modal/)                                                  | `$.modal()`<br>`$.statusModal()`                                                                                                                      | CDN         |
| [Chart.js](https://www.chartjs.org/)                                                                                     | `$().chartJS()`                                                                                                                                       | CDN         |
| [cross-fetch wrapper](https://www.npmjs.com/package/@gibme/fetch)                                                        | `$.fetch()`                                                                                                                                           | CDN         |
| [DataTables.net-BootStrap5](https://datatables.net)                                                                      | `$().dt()`                                                                                                                                            | CDN         |
| [FontAwesome Free](https://fontawesome.com/search?m=free&o=r)                                                            | [Font Awesome Docs](https://docs.fontawesome.com/web/setup/get-started/#2-find-and-add-icons)<br>`$.createAwesomeIcon()`<br>`$.createAwesomeButton()` | CDN         |
| [Google Charts](https://developers.google.com/chart)                                                                     | `$.loadGoogleCharts()`                                                                                                                                | CDN         |
| [Google Fonts](https://developers.google.com/fonts/docs/css2)                                                            | `$.loadGoogleFonts()`                                                                                                                                 | CDN         |
| [Google Maps](https://developers.google.com/maps)                                                                        | `$.loadGoogleMaps()`                                                                                                                                  | CDN         |
| [hls.js](https://www.npmjs.com/package/hls.js)                                                                           | `$.hls()`<br>`$.createHLSMedia()`                                                                                                                     | CDN         |
| [Moment.js](https://www.npmjs.com/package/moment)                                                                        | `$.moment()`<br>`$.momentUtc()`                                                                                                                       | CDN         |
| [Numeral.js](https://www.npmjs.com/package/numeral)                                                                      | `$.numeral()`                                                                                                                                         | CDN         |
| [Smoothie Charts](http://smoothiecharts.org/)                                                                            | `$().smoothieChart()`<br>`$.timeSeries()`                                                                                                             | CDN         |
| [QR Codes](https://npmjs.org/package/@gibme/qrcode)                                                                      | `$().qrCode()`                                                                                                                                        | CDN         |
| [Overlays](https://npmjs.org/package/@gibme/overlay)                                                                     | `$().overlay()`                                                                                                                                       | CDN         |
| [LocalStorage](https://www.npmjs.com/package/@gibme/local-storage)                                                       | `$.localStorage()`                                                                                                                                    | CDN         |
| [Timer](https://gibme-npm.github.io/timer/)                                                                              | `$.timer()`                                                                                                                                           | CDN         |
| [WebSocketClient](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications) | `$.websocket()`                                                                                                                                       | CDN         |
| [Nano ID](https://npmjs.org/package/nanoid)                                                                              | `$.nanoid()`                                                                                                                                          | Bundled     |
| [@simplewebauthn/browser](https://simplewebauthn.dev/docs/packages/browser)                                              | `$.webauthn()`                                                                                                                                        | CDN         |
| [Advanced Crypto](https://gibme-npm.github.io/crypto/classes/Crypto.html)                                                | `$.crypto`                                                                                                                                            | CDN         |

## Documentation

[https://gibme-npm.github.io/web-ui/](https://gibme-npm.github.io/web-ui/)

## Example

```typescript
import '@gibme/web-ui';

$(() => {
    $('some_data_table').dt();
    
    $('some_canvas').qrCode('https://github.com');
})
```
