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
import './bootstrap5';
import './fontawesome';
import { DataTable, DataTableConfig } from './datatables';
import fetch, { Cookie, CookieJar, Headers, Request, Response } from '@gibme/fetch';
import LoadingOverlay, { LoadingOverlayOptions } from './loading_overlay';
import LocalStorage from '@gibme/local-storage';
import numeral from 'numeral';
import ModalHelper from './modal_helper';
import StatusModal from './status_modal';
import Timer from '@gibme/timer';
import moment from 'moment';
import HLS, { HlsConfig as HLSConfig } from 'hls.js';
import GoogleChartsLoader, { ChartOptions } from './google_charts';
import GoogleMapsLoader, { MapOptions, USACentered } from './google_maps';
import UIHelper, { VideoElementOptions } from './ui_helper';

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
    HLSConfig,
    DataTableConfig,
    DataTable,
    ModalHelper,
    VideoElementOptions,
    UIHelper,
    Cookie,
    CookieJar
};

export const clearElement = UIHelper.clearElement;
export const createAwesomeButton = UIHelper.createAwesomeButton;
export const createDataTable = UIHelper.createDataTable;
export const createElement = UIHelper.createElement;
export const createHLSMediaElement = UIHelper.createHLSMediaElement;
export const createMediaElement = UIHelper.createMediaElement;
export const fetchElement = UIHelper.fetchElement;

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
    createAwesomeButton,
    clearElement,
    createElement,
    fetchElement,
    createHLSMediaElement,
    createMediaElement,
    createDataTable,
    sleep,
    GoogleChartsLoader,
    GoogleMapsLoader,
    USACentered,
    HLS,
    DataTable,
    ModalHelper,
    UIHelper,
    Cookie,
    CookieJar
};
