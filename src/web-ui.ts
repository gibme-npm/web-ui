// Copyright (c) 2021-2023, Brandon Lehmann <brandonlehmann@gmail.com>
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

import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import fetch, { Headers, Request, Response } from '@gibme/fetch';
import 'datatables.net-bs5/js/dataTables.bootstrap5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-fixedheader-bs5/js/fixedHeader.bootstrap5';
import 'datatables.net-fixedheader-bs5/css/fixedHeader.bootstrap5.min.css';
import 'datatables.net-responsive-bs5/js/responsive.bootstrap5';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';
import '@fortawesome/fontawesome-free/js/all';
import LoadingOverlay, { LoadingOverlayOptions } from './loading_overlay';
import LocalStorage from '@gibme/local-storage';
import numeral from 'numeral';
import StatusModal from './status_modal';
import Timer from '@gibme/timer';
import moment from 'moment';
import HLS, { HlsConfig as HLSConfig } from 'hls.js';
import GoogleChartsLoader, { ChartOptions } from './google_charts';
import GoogleMapsLoader, { USACentered, MapOptions } from './google_maps';
export {
    $,
    fetch,
    Headers,
    Request,
    Response,
    LoadingOverlay,
    LoadingOverlayOptions,
    LocalStorage,
    numeral,
    moment,
    StatusModal,
    Timer,
    GoogleChartsLoader,
    GoogleMapsLoader,
    USACentered,
    MapOptions,
    ChartOptions,
    HLS,
    HLSConfig
};

/**
 * Creates a new JQuery HTML Element of the specified type
 *
 * @param type
 */
export const createElement = <Type extends HTMLElement = HTMLElement>(type: string): JQuery<Type> =>
    $(document.createElement(type)) as any;

/**
 * Video element creation options
 */
export interface VideoElementOptions {
    autoplay: boolean;
    controls: boolean;
    loop: boolean;
    muted: boolean;
    playsinline: boolean;

    [key: string]: boolean;
}

/**
 * Creates a new JQuery HTML Media Element with the properties set as defined in the options
 *
 * Note: if autoplay is enabled, muted will be set to true
 *
 * @param src
 * @param options
 */
export const createMediaElement = (
    src?: string,
    options: Partial<VideoElementOptions> = {}
): JQuery<HTMLMediaElement> => {
    if (options.autoplay) {
        options.muted = true;
    }

    const element = createElement<HTMLMediaElement>('video')
        .prop({
            src,
            ...options
        });

    for (const key of Object.keys(options)) {
        if (options[key] === true) {
            element.attr(key, '');
        }
    }

    return element;
};

/**
 * Creates a new JQuery HTML Media Element with the properties set as defined in the options
 * It loads a hls.js player around the element so that it can load that content
 *
 * Note: if autoplay is enabled, muted will be set to true
 *
 * @param src
 * @param options
 * @param hlsConfig
 */
export const createHLSMediaElement = (
    src: string,
    options: Partial<VideoElementOptions> = {},
    hlsConfig: Partial<HLSConfig> = {}
): [JQuery<HTMLMediaElement>, HLS] => {
    const hls = new HLS(hlsConfig);

    const element = createMediaElement(undefined, options);

    hls.loadSource(src);
    hls.attachMedia(element[0]);

    if (options.autoplay) {
        hls.on(HLS.Events.MEDIA_ATTACHED, () => {
            element.trigger('play');
        });
    }

    return [element, hls];
};

/**
 * Fetches the HTML DOM Object by the id or from a JQuery HTML Element
 *
 * @param id
 */
export const fetchElement = <Type extends HTMLElement = HTMLElement>(id: string | JQuery<HTMLElement>): Type =>
    (typeof id === 'string' ? $(`#${name}`)[0] : id[0]) as Type;

/**
 * Sleeps for the specified timeout period
 *
 * @param timeout in milliseconds
 */
export const sleep = async (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

export default {
    $,
    Headers,
    Request,
    Response,
    LoadingOverlay,
    LocalStorage,
    numeral,
    moment,
    StatusModal,
    Timer,
    createElement,
    fetchElement,
    sleep,
    GoogleChartsLoader,
    GoogleMapsLoader,
    USACentered,
    HLS
};
