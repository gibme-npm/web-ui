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
import { DataTable, DataTableConfig, DataTablesAPI } from './datatables';
import fetch, { Cookie, CookieJar, Headers, Request, Response } from '@gibme/fetch';
import LoadingOverlay, { LoadingOverlayEvent, LoadingOverlayOptions } from './loading_overlay';
import LocalStorage from '@gibme/local-storage';
import numeral from 'numeral';
import ModalHelper from './modal_helper';
import StatusModal, { StatusModalOptions } from './status_modal';
import Timer from '@gibme/timer';
import moment from 'moment';
import HLS, { HlsConfig as HLSConfig } from 'hls.js';
import GoogleChartsLoader, { ChartOptions } from './google_charts';
import GoogleMapsLoader, { MapOptions, USACentered } from './google_maps';
import GoogleFontsLoader from './google_fonts';
import UIHelper, {
    FontAwesome,
    FontAwesomeOptions,
    HTMLInput,
    HTMLInputOptions,
    VideoElementOptions
} from './ui_helper';
import { v4 as UUID } from 'uuid';
import { SmoothieChart, TimeSeries } from './smoothie';
import ChartJS, { ChartJSHelpers } from './chartjs';

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
    GoogleFontsLoader,
    USACentered,
    MapOptions,
    ChartOptions,
    HLS,
    HLSConfig,
    DataTableConfig,
    DataTablesAPI,
    DataTable,
    ModalHelper,
    VideoElementOptions,
    UIHelper,
    Cookie,
    CookieJar,
    FontAwesome,
    FontAwesomeOptions,
    HTMLInput,
    HTMLInputOptions,
    UUID,
    StatusModalOptions,
    LoadingOverlayEvent,
    SmoothieChart,
    TimeSeries,
    ChartJS,
    ChartJSHelpers
};

export const clearElement = UIHelper.clearElement;
export const createAwesomeIcon = UIHelper.createAwesomeIcon;
export const createAwesomeButton = UIHelper.createAwesomeButton;
export const createDataTable = UIHelper.createDataTable;
export const createElement = UIHelper.createElement;
export const createFloatingInputGroup = UIHelper.createFloatingInputGroup;
export const createHLSMediaElement = UIHelper.createHLSMediaElement;
export const createMediaElement = UIHelper.createMediaElement;
export const fetchElement = UIHelper.fetchElement;
export const fetchHTML = UIHelper.fetchHTML;
export const fetchSelectorPath = UIHelper.fetchSelectorPath;
export const readFileInputCount = UIHelper.readFileInputCount;
export const readFileInputContents = UIHelper.readFileInputContents;

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
    createFloatingInputGroup,
    createAwesomeIcon,
    createHLSMediaElement,
    createMediaElement,
    createDataTable,
    sleep,
    GoogleChartsLoader,
    GoogleMapsLoader,
    GoogleFontsLoader,
    USACentered,
    HLS,
    DataTable,
    ModalHelper,
    UIHelper,
    Cookie,
    CookieJar,
    fetchHTML,
    UUID,
    fetchSelectorPath,
    readFileInputCount,
    readFileInputContents,
    SmoothieChart,
    TimeSeries,
    ChartJS,
    ChartJSHelpers
};
