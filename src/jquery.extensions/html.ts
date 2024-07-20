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
import type { HTML } from '../types';
import './uuid';

declare global {
    interface JQuery {
        /**
         * Fetches the HTML DOM Object
         */
        element<ElementType = HTMLElement>(): ElementType;

        /**
         * Reads a file from a file input field and returns the file as a Buffer
         *
         * @param idx
         */
        fileContents(idx: number): Promise<{ content: Buffer, name: string, size: number }>;

        /**
         * Returns the number of files selected in a file input field
         */
        fileCount(): number;

        /**
         * Retrieve the full HTML for the specified element including the element itself
         */
        fullHTML(): string;

        /**
         * Returns the elements ID; or, if one is not set, assigns a random UUID to it
         * and returns it
         */
        id(): string;

        /**
         * Returns the full selector path of the element
         *
         * @param type
         */
        path(type: 'id' | 'tagName'): string;

        /**
         * Returns the element type
         */
        type(): string;
    }

    interface JQueryStatic {
        /**
         * Creates a form floating input group with a label
         *
         * @param options
         */
        createFloatingInputGroup(
            options: Partial<HTML.Input.Options>
        ): JQuery<HTMLElement>;

        /**
         * Creates a new JQuery HTML Media Element with the properties set as defined in the options
         *
         * Note: if autoplay is enabled, muted will be set to true
         * @param src
         * @param options
         */
        createMedia(src?: string, options?: Partial<HTML.Video.Options>): JQuery<HTMLMediaElement>;
    }
}

$.createFloatingInputGroup = function (
    options: Partial<HTML.Input.Options> = {}
): JQuery<HTMLElement> {
    options.type ??= 'text';
    options.readonly ??= false;
    options.disabled ??= false;

    const id = options.id || options.input?.id() || $.uuid();

    const float = $('<div>')
        .addClass('form-floating input-group');

    const label = $('<label>');

    if (options.label) {
        if (typeof options.label === 'string') {
            label.text(options.label);
        } else {
            options.label.appendTo(label);
        }
    }

    if (id) {
        label.attr('for', id);

        if (options.type === 'file') {
            float.removeClass('form-floating input-group');

            label.addClass('form-label')
                .appendTo(float);
        }
    }

    if (!options.input) {
        const element = $('<input>')
            .attr('type', options.type);

        if (id) {
            element.attr('id', id);
        }

        if (options.class) {
            element.addClass(options.class);
        }

        if (options.readonly) {
            element.attr('readonly', 'readonly');
        }

        if (options.disabled) {
            element.attr('disabled', 'disabled');
        }

        for (const key of Object.keys(options)) {
            if (key === 'id' || key === 'label' || key === 'class' || key === 'readonly' || key === 'disabled') {
                continue;
            }

            const value = options[key];

            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                const _value = value.toString().trim();

                if (_value && _value.length !== 0) {
                    element.attr(key, _value);
                }
            } else if (value) {
                value.appendTo(element);
            }
        }

        element.addClass('form-control')
            .appendTo(float);
    } else {
        if (id) {
            options.input.attr('id', id);
        }

        options.input.addClass('form-control')
            .appendTo(float);
    }

    if (label.attr('for') && options.type !== 'file') {
        label.appendTo(float);
    }

    return float;
};

$.createMedia = function (
    src?: string,
    options: Partial<HTML.Video.Options> = {}
): JQuery<HTMLMediaElement> {
    if (options.autoplay) {
        options.muted = true;
    }

    const element = $<HTMLMediaElement>('<video>')
        .prop({
            src,
            ...options
        });

    for (const key of Object.keys(options)) {
        if (options[key] === true) {
            element.attr(key, '');
        }
    }

    return element;
};

$.fn.extend({
    element: function <ElementType = HTMLElement> (): ElementType {
        return $(this)[0] as ElementType;
    },
    fileContents: function (idx = 0): Promise<{ content: Buffer, name: string, size: number }> {
        return new Promise((resolve, reject) => {
            const parent = $(this) as JQuery<HTMLInputElement>;

            const files: any[] = parent.prop('files');

            if (!files || files.length === 0) {
                return reject(new Error('Could not read input field'));
            }

            const file = files[idx];

            if (!file) {
                return reject(new Error('Could not read input field'));
            }

            const reader = new FileReader();

            reader.addEventListener('load', () => {
                if (!reader.result) {
                    return reject(new Error('Could not read file from input field'));
                }

                let buffer: Buffer;

                if (reader.result instanceof ArrayBuffer) {
                    buffer = Buffer.from(reader.result);
                } else {
                    buffer = Buffer.from(reader.result, 'utf8');
                }

                return resolve({
                    content: buffer,
                    name: file.name,
                    size: file.size
                });
            });

            reader.readAsArrayBuffer(file);
        });
    },
    fileCount: function (): number {
        const parent = $(this) as JQuery<HTMLInputElement>;

        return parent.prop('files').length || 0;
    },
    fullHTML: function (): string {
        const parent = $(this) as JQuery<HTMLElement>;

        return $('<div>')
            .append(parent.clone())
            .html();
    },
    id: function (): string {
        const id = $(this).attr('id');

        if (id) {
            return id;
        }

        const uuid = $.uuid();

        $(this).attr('id', uuid);

        return uuid;
    },
    path: function (type: 'id' | 'tagName' = 'id'): string {
        let parent = $(this) as JQuery<HTMLElement>;

        const ids: string[] = [];

        do {
            const id = parent.prop(type);

            if (id) {
                ids.push(id);
            }

            parent = parent.parent();
        } while (typeof parent.prop('tagName') !== 'undefined');

        return ids.reverse()
            .map(elem => `${type === 'id' ? '#' : ''}${elem}`)
            .join(type === 'id' ? ' ' : ' > ');
    },
    type: function (): string {
        return $(this).prev().prop('nodeName');
    }
});
