// Copyright (c) 2021-2022, Brandon Lehmann <brandonlehmann@gmail.com>
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
import fetch, { Headers, Request, Response } from 'cross-fetch';
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
import GoogleChartsLoader from './google_charts';
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
    StatusModal,
    Timer,
    GoogleChartsLoader
};

/**
 * Creates a new JQuery HTML Element of the specified type
 *
 * @param type
 */
export const createElement = (type: string): JQuery<HTMLElement> => $(document.createElement(type));

/**
 * Fetches the HTML DOM Object by the id or from a JQuery HTML Element
 *
 * @param id
 */
export const fetchElement = (id: string | JQuery<HTMLElement>): HTMLElement =>
    typeof id === 'string' ? $(`#${name}`)[0] : id[0];

/**
 * Sleeps for the specified timeout period
 *
 * @param timeout in milliseconds
 */
export const sleep = async (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

export default {
    $,
    fetch,
    Headers,
    Request,
    Response,
    LoadingOverlay,
    LocalStorage,
    numeral,
    StatusModal,
    Timer,
    createElement,
    fetchElement,
    sleep,
    GoogleChartsLoader
};
