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

import { createIcon, createButton, FontAwesome } from '@gibme/fontawesome';

declare global {
    interface JQueryStatic {
        /**
         * Creates a button with a fontawesome icon inside
         *
         * @param icon
         * @param options the button options
         */
        createAwesomeButton(
            icon: string | string[],
            options?: Partial<FontAwesome.Button.Options>
        ): JQuery<HTMLButtonElement>;

        /**
         * Creates a Font Awesome Icon
         *
         * Note: The icon name must be specified without the `fa-` prefix. If the icon includes
         * multiple names (i.e. `fa-brand fa-x-twitter`) the icon should be specified as either
         * `brand x-twitter` or `['brand','x-twitter']`
         *
         * @param icon
         * @param options
         */
        createAwesomeIcon(
            icon: string | string[],
            options?: Partial<FontAwesome.Icon.Options>
        ): JQuery<HTMLElement>;
    }
}

($ => {
    $.createAwesomeButton = (
        icon: string | string[],
        options: Partial<FontAwesome.Button.Options> = {}
    ): JQuery<HTMLButtonElement> => $(createButton(icon, options));

    $.createAwesomeIcon = (
        icon: string | string[],
        options: Partial<FontAwesome.Icon.Options> = {}
    ): JQuery<HTMLElement> => $(createIcon(icon, options));
})(window.$);

export {};
