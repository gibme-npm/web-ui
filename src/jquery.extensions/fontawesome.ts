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
import type { FontAwesome } from '../types';

declare global {
    interface JQueryStatic {
        /**
         * Creates a button with a fontawesome icon inside
         *
         * @param icon
         * @param iconOptions
         */
        createAwesomeButton<ElementType extends HTMLElement = HTMLElement>(
            icon: string | string[],
            iconOptions?: Partial<FontAwesome.Button.Options>
        ): JQuery<ElementType>;

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
        createAwesomeIcon<ElementType extends HTMLElement = HTMLElement>(
            icon: string | string[],
            options?: Partial<FontAwesome.Icon.Options>
        ): JQuery<ElementType>;
    }
}

$.createAwesomeButton = function <ElementType extends HTMLElement = HTMLElement> (
    icon: string | string[],
    iconOptions: Partial<FontAwesome.Button.Options> = {}
): JQuery<ElementType> {
    if (Array.isArray(icon)) {
        icon = icon.join(' ');
    }

    const button = $<ElementType>('<button>')
        .addClass('btn')
        .attr('type', 'button');

    const element = $.createAwesomeIcon(icon, iconOptions);

    element.appendTo(button);

    if (iconOptions.label && typeof iconOptions.label === 'string') {
        $(document.createElement('span'))
            .text(` ${iconOptions.label}`)
            .appendTo(button);
    } else if (iconOptions.label && typeof iconOptions.label !== 'string') {
        iconOptions.label.appendTo(button);
    }

    return button;
};

$.createAwesomeIcon = function <ElementType extends HTMLElement = HTMLElement> (
    icon: string | string[],
    options: Partial<FontAwesome.Icon.Options> = {}
): JQuery<ElementType> {
    options.style ??= 'solid';
    options.animation ??= 'none';
    options.rotation ??= 'none';
    options.size ??= 'default';

    if (Array.isArray(icon)) {
        icon = icon.join(' ');
    }

    // rework the icon in case of multiple specifiers
    icon = icon.split(' ')
        .map(elem => `fa-${elem}`)
        .join(' ');

    const element = $<ElementType>('<i>')
        .addClass(`fa-${options.style} ${icon}`);

    if (options.animation !== 'none') {
        // spin-reverse requires TWO classes
        if (options.animation === 'spin-reverse') {
            element.addClass('fa-spin fa-spin-reverse');
        } else {
            element.addClass(`fa-${options.animation}`);
        }
    }

    if (options.rotation !== 'none' && options.animation === 'none') {
        element.addClass(`fa-${options.rotation}`);
    }

    if (options.color) {
        element.attr('style', `color: ${options.color};`);
    }

    if (options.size !== 'default') {
        element.addClass(`fa-${options.size}`);
    }

    if (options.class) {
        element.addClass(options.class);
    }

    if (options.attributes) {
        for (const [key, value] of options.attributes) {
            if (value && value.toString().trim().length !== 0) {
                element.attr(key.toString().trim(), value.toString().trim());
            }
        }
    }

    return element;
};
