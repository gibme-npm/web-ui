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

import type { Response, Fetch } from '@gibme/fetch';
import { version, JSDELIVR } from '../helpers/cdn';

declare global {
    interface JQueryStatic {
        /**
         * cross-fetch wrapper with additional options
         */
        fetch(url: string, init?: Fetch.InitWeb): Promise<Response>;
    }

    interface Window {
        Fetch: Fetch.WebInterface;
    }
}

($ => {
    const setup = () => {
        $.fetch = async (url: string, init?: Fetch.InitWeb): Promise<Response> =>
            window.Fetch(url, init);
    };

    if (typeof window.Fetch === 'undefined') {
        $.getScript({
            url: `${JSDELIVR}/@gibme/fetch@${version('@gibme/fetch')}/dist/Fetch.min.js`,
            cache: true,
            success: () => setup()
        });
    } else {
        setup();
    }
})(window.$);

export {};
