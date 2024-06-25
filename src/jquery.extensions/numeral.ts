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
// eslint-disable-next-line import/no-named-default
import type { default as numeral } from 'numeral';

declare global {
    interface JQueryStatic {
        /**
         * Initiates an instance of numeral
         *
         * @param input
         */
        numeral(input?: any): numeral.Numeral;

        /**
         * This function sets the current locale. If no arguments are passed in,
         * it will simply return the current global locale key.
         *
         * @param locale if set to 'auto' will use the browser's locale setting
         */
        numeralLocale(locale?: string | 'auto'): string;

        /**
         * Registers a language definition or a custom format definition.
         *
         * @param what
         * @param key
         * @param value
         */
        numeralRegister(
            what: numeral.RegisterType,
            key: string,
            value: numeral.NumeralJSFormat | numeral.NumeralJSLocale
        ): void;

        /**
         * Sets the numeral null format
         *
         * @param format
         */
        numeralNullFormat(format: string): void;

        /**
         * Sets the numeral zero format
         *
         * @param format
         */
        numeralZeroFormat(format: string): void;
    }
}

$.numeral = function (input?: any): numeral.Numeral {
    return window.numeral(input);
};

$.numeralLocale = function (locale?: string | 'auto'): string {
    if (!locale) {
        return window.numeral.locale();
    }

    if (locale === 'auto') {
        const browser = navigator.language.toLowerCase();

        window.numeral.locale(browser);

        if (!window.numeral.localeData()) {
            window.numeral.locale(browser.split('-')[0]);
        }

        if (!window.numeral.localeData()) {
            window.numeral.locale('en');
        }
    } else {
        window.numeral.locale(locale);
    }

    return window.numeral.locale();
};

$.numeralRegister = function (
    what: numeral.RegisterType,
    key: string,
    value: numeral.NumeralJSFormat | numeral.NumeralJSLocale
): void {
    window.numeral.register(what, key, value);
};

$.numeralNullFormat = function (format: string): void {
    return window.numeral.nullFormat(format);
};

$.numeralZeroFormat = function (format: string): void {
    return window.numeral.zeroFormat(format);
};
