// Copyright (c) 2025, Brandon Lehmann <brandonlehmann@gmail.com>
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

import type { phone, PhoneResult } from '@gibme/phone';
import { version, JSDELIVR } from '../helpers/cdn';

type Options = {
    country: string;
    validateMobilePrefix: boolean;
    strictDetection: boolean;
}

declare global {
    interface JQueryStatic {
        /**
         * Normalizes phone numbers into E.164 format
         * @param number
         * @param options
         */
        phone(number: string, options?: Partial<Options>): PhoneResult;
    }

    interface Window {
        phone: typeof phone;
    }
}

($ => {
    const setup = () => {
        $.phone = (number: string, options: Partial<Options> = {}): PhoneResult => window.phone(number, options);
    };

    if (typeof window.phone === 'undefined') {
        $.getScript({
            url: `${JSDELIVR}/@gibme/phone@${version('@gibme/phone')}/dist/phone.min.js`,
            cache: true,
            success: () => setup()
        });
    } else {
        setup();
    }
})(window.$);

export {};
