# Simple Web UI Library

Bundled up *common* UI tools

* [jQuery](https://jquery.com/)
* [jQuery Loading Overlays](https://www.npmjs.com/package/gasparesganga-jquery-loading-overlay)
* [Bootstrap](https://getbootstrap.com/) (Note: this auto loads)
* [Bootstrap Modals](https://getbootstrap.com/docs/5.2/components/modal/)
* [cross-fetch](https://www.npmjs.com/package/cross-fetch)
* [FontAwesome-free](https://www.npmjs.com/package/@fortawesome/fontawesome-free)
* [Numeral.js](https://www.npmjs.com/package/numeral)
* [LocalStorage](https://www.npmjs.com/package/local-storage)
* [Timer](https://gibme-npm.github.io/timer/) w/ events
* [Google Charts Loader](https://developers.google.com/chart)

## Documentation

[https://gibme-npm.github.io/web-ui/](https://gibme-npm.github.io/web-ui/)

## Sample Code

In your application...

```typescript
import WebUI from '@gibme/web-ui';

WebUI.LoadingOverlay.show();

setTimeout(() => WebUI.LoadingOverlay.hide(), 5_000);
```
