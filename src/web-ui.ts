// Copyright (c) 2021-2024, Brandon Lehmann <brandonlehmann@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import load_from_cdn from './helpers/load_from_cdn';
import hook_dom_load from './helpers/hook_dom_load';
import './jquery.extensions/all';

export { default as ModalHelper } from './modules/modal';
export { default as StatusModal } from './modules/status-modal';
export { WebSocketReadyState } from './legacy/websocket';

/** @ignore */
interface LoadedInterface {
    bootstrap: boolean;
    fontawesome: boolean;
    datatables: boolean;
    chartjs: boolean;
    hlsjs: boolean;
    fetch: boolean;
    smoothiecharts: boolean;
    moment: boolean;
    numeral: boolean;
    qrcode: boolean;
    websocket: boolean;

    [key: string]: boolean;
}

// Automatically loads upon script load BEFORE jQuery is loaded
hook_dom_load(async () => {
    const loaded: Partial<LoadedInterface> = {};

    // Try to load bootstrap via the CDN
    loaded.bootstrap = await load_from_cdn('bootstrap');

    // Try to load fontawesome from the CDN
    loaded.fontawesome = await load_from_cdn('fontawesome');

    // Try to load DataTables.net from the CDN
    if (loaded.bootstrap) {
        loaded.datatables = await load_from_cdn('datatables-bs5');
    } else {
        loaded.datatables = await load_from_cdn('datatables-dt');
    }

    // Try to load @gibme/websocket
    loaded.websocket = await load_from_cdn('websocket');

    // Try to load Chart.js from the CDN
    loaded.chartjs = await load_from_cdn('chartjs');

    // Try to load Smoothie Charts from the CDN
    loaded.smoothiecharts = await load_from_cdn('smoothiecharts');

    // Try to load hls.js from CDN
    loaded.hlsjs = await load_from_cdn('hls');

    // Try to load @gibme/fetch
    loaded.fetch = await load_from_cdn('fetch');

    // Try to load @gibme/qrcode
    loaded.qrcode = await load_from_cdn('qrcode');

    // Try to load moment.js
    loaded.moment = await load_from_cdn('moment');

    // Try to load numeral.js
    loaded.numeral = await load_from_cdn('numeral');
});
