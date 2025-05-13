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

// eslint-disable-next-line import/no-named-default
import type { MomentInput, Moment, default as MomentJS } from 'moment';
import { version, CDNJS } from '../helpers/cdn';

declare global {
    interface JQueryStatic {
        /**
         * Initiates an instance of moment.js
         *
         * @param input
         * @param strict
         */
        moment(input?: MomentInput, strict?: boolean): Moment;

        /**
         * Initiates an instance of moment.js from a UTC date
         *
         * @param input
         * @param strict
         */
        momentUtc(input?: MomentInput, strict?: boolean): Moment;
    }

    interface Window {
        moment: typeof MomentJS;
    }
}

($ => {
    const setup = () => {
        $.moment = (input?: MomentInput, strict?: boolean): Moment =>
            window.moment(input, strict);

        $.momentUtc = (input?: MomentInput, strict?: boolean): Moment =>
            window.moment.utc(input, strict);
    };

    if (typeof window.moment === 'undefined') {
        $.getScript({
            url: `${CDNJS}/moment.js/${version('moment')}/moment-with-locales.min.js`,
            cache: true,
            success: () => setup()
        });
    } else {
        setup();
    }
})(window.$);

export {};
