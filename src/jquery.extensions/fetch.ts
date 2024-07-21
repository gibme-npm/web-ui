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

import type { Cookie, CookieJar, FetchInit, FetchInterface, Response } from '@gibme/fetch';
import type { Store as CookieStore } from 'tough-cookie';
import { version, JSDELIVR } from '../helpers/cdn';

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

    interface Window {
        Cookie: typeof Cookie;
        CookieJar: typeof CookieJar;
        Fetch: FetchInterface;
    }
}

($ => {
    const setup = () => {
        $.cookie = (properties?: Cookie.Properties): Cookie =>
            new window.Cookie(properties);

        $.cookieJar = (store?: CookieStore, options?: CookieJar.Options): CookieJar =>
            new window.CookieJar(store, options);

        $.fetch = async (url: string, init?: FetchInit): Promise<Response> =>
            window.Fetch(url, init);
    };

    if (typeof window.Fetch === 'undefined' ||
        typeof window.Cookie === 'undefined' ||
        typeof window.CookieJar === 'undefined'
    ) {
        $.getScript({
            url: `${JSDELIVR}/@gibme/fetch@${version('@gibme/fetch')}/dist/Fetch.bundle.js`,
            cache: true,
            success: () => setup()
        });
    } else {
        setup();
    }
})(window.$);

export {};
