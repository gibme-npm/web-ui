// Copyright (c) 2021-2025, Brandon Lehmann <brandonlehmann@gmail.com>
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

import { version, CDNJS } from './helpers/cdn';
import type { WebSocketReadyState } from '@gibme/websocket';
// eslint-disable-next-line import/no-named-default
import type { default as bootstrap } from 'bootstrap';
import './jquery.extensions/all';
export { WebSocketReadyState };

declare global {
    interface Window {
        $: JQueryStatic;
        jQuery: JQueryStatic;
        bootstrap?: typeof bootstrap;
    }
}

(async ($) => {
    const load = async (url: string): Promise<boolean> => new Promise(resolve => {
        $.ajax({
            url,
            cache: true,
            dataType: 'script',
            success: () => resolve(true),
            error: () => resolve(false)
        });
    });

    const missing_modules = (): string | undefined => {
        if (typeof $.fn.chartJS === 'undefined') return 'chart.js';
        if (typeof $.fn.dt === 'undefined') return 'datatables.net';
        if (typeof $.fetch === 'undefined') return 'fetch';
        if (typeof $.createHLSMedia === 'undefined') return 'hls.js';
        if (typeof $.localStorage === 'undefined') return 'local-storage';
        if (typeof $.moment === 'undefined') return 'moment';
        if (typeof $.numeral === 'undefined') return 'numeral';
        if (typeof $.fn.overlay === 'undefined') return 'overlay';
        if (typeof $.fn.qrCode === 'undefined') return 'qrCode';
        if (typeof $.webauthn === 'undefined') return 'simplewebauthn';
        if (typeof $.fn.smoothieChart === 'undefined') return 'smoothie';
        if (typeof $.timer === 'undefined') return 'timer';
        if (typeof $.websocket === 'undefined') return 'websocket';
        if (typeof $.crypto === 'undefined') return 'crypto';
    };

    const jq_ready = $.fn.ready;
    let pre_jq: any[] = [];

    $.fn.ready = function (fn) {
        pre_jq.push(fn);
        return this;
    };

    // If jQuery is not loaded, load it
    if (!window.$ || !window.jQuery) {
        const jquery = version('jquery');

        const dom_load = async (url: string): Promise<boolean> => new Promise(resolve => {
            const elem = document.createElement('script');
            elem.crossOrigin = 'anonymous';
            elem.referrerPolicy = 'no-referrer';
            elem.defer = true;
            elem.src = url;

            elem.addEventListener('load', () => resolve(true));
            elem.addEventListener('error', () => resolve(false));

            document.head.appendChild(elem);
        });

        await dom_load(`${CDNJS}/jquery/${jquery}/jquery.min.js`);
    }

    if (!$.hasClass('fa-solid')) { // there's probably a better way to detect this
        const fa = version('@fortawesome/fontawesome-free');

        $('<link rel="stylesheet" crossorigin="anonymous" referrerpolicy="no-referrer">')
            .appendTo($(document.head))
            .attr('href', `${CDNJS}/font-awesome/${fa}/css/all.min.css`);
    }

    if (!window.bootstrap) {
        const bs = version('bootstrap');

        $('<link rel="stylesheet" crossorigin="anonymous" referrerpolicy="no-referrer">')
            .appendTo($(document.head))
            .attr('href', `${CDNJS}/bootstrap/${bs}/css/bootstrap.min.css`);

        await load(`${CDNJS}/bootstrap/${bs}/js/bootstrap.bundle.min.js`);
    }

    // wait for everyone to be in the party
    let missing_module: string | undefined = missing_modules();
    do {
        $(document.body).trigger('missing', missing_module);
        await $.sleep(100);
        missing_module = missing_modules();
    } while (missing_module);

    for (let i = 0; i < pre_jq.length; i++) {
        pre_jq[i].call($);
    }

    $.fn.ready = jq_ready;
    pre_jq = [];
})(window.$);

export {};
