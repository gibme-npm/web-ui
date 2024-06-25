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

import $ from 'jquery';
import type { Cookie, CookieJar, FetchInit } from '@gibme/fetch';
import type { Store as CookieStore } from 'tough-cookie';

declare global {
    interface JQueryStatic {
        /**
         * Creates a new Cookie
         *
         * @param properties
         */
        cookie(properties?: Cookie.Properties): Cookie;

        /**
         * Creates a CookieJar
         *
         * @param store
         * @param options
         */
        cookieJar(store?: CookieStore, options?: CookieJar.Options): CookieJar;

        /**
         * cross-fetch wrapper with additional options
         */
        fetch(url: string, init?: FetchInit): Promise<Response>;
    }
}

$.cookie = function (properties?: Cookie.Properties): Cookie {
    if (!window.Cookie) throw new Error('Fetch.Cookie not loaded');

    return new window.Cookie(properties);
};

$.cookieJar = function (store?: CookieStore, options?: CookieJar.Options): CookieJar {
    if (!window.CookieJar) throw new Error('Fetch.CookieJar not loaded');

    return new window.CookieJar(store, options);
};

$.fetch = function (url: string, init: FetchInit = {}): Promise<Response> {
    if (!window.Fetch) throw new Error('Fetch not loaded');

    return window.Fetch(url, init);
};
