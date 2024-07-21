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

import type { HTML } from '../types';
import { Buffer } from '../modules/buffer';
import { nanoid } from 'nanoid';

interface FileContents extends Omit<File, 'arrayBuffer' | 'slice' | 'stream' | 'text' | 'lastModified'> {
    content: Buffer;
    lastModified: Date;
}

declare global {
    interface JQuery {
        /**
         * Fetches the HTML DOM Object
         */
        element<T = HTMLElement>(): T;

        /**
         * Reads a file from a file input field and returns the file as a Buffer
         *
         * @param idx
         */
        fileContents(idx: number): Promise<FileContents>;

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
        createFloatingInputGroup(options: Partial<HTML.Input.Options>): JQuery<HTMLElement>;

        /**
         * Creates a new JQuery HTML Media Element with the properties set as defined in the options
         *
         * Note: if autoplay is enabled, muted will be set to true
         * @param src
         * @param options
         */
        createMedia(src?: string, options?: Partial<HTML.Video.Options>): JQuery<HTMLMediaElement>;

        /**
         * Returns if the document has the specified class available
         *
         * @param className
         */
        hasClass(className: string): boolean;

        /**
         * Generates a random ID
         *
         * @param size
         */
        nanoid(size?: number): string;

        /**
         * Gets or sets the theme mode of the document
         *
         * Order of preference is:
         *
         * 1) specified value
         * 2) already set via the html tag
         * 3) browser preference
         * 4) light mode
         *
         * @param mode
         */
        theme(mode?: 'light' | 'dark'): 'light' | 'dark';
    }
}

($ => {
    $.createFloatingInputGroup = (
        options: Partial<HTML.Input.Options> = {}
    ): JQuery<HTMLElement> => {
        options.type ??= 'text';
        options.readonly ??= false;
        options.disabled ??= false;

        const id = options.id || options.input?.id() || nanoid();

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

    $.createMedia = (
        src?: string,
        options: Partial<HTML.Video.Options> = {}
    ): JQuery<HTMLMediaElement> => {
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

    $.hasClass = (className: string): boolean => {
        className = className.trim();
        if (className.length === 0) return false;
        const sheets: StyleSheetList = document.styleSheets;
        for (let i = 0; i < sheets.length; i++) {
            const rules: CSSRuleList = sheets[i].rules || sheets[i].cssRules;
            for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                if (rule instanceof CSSStyleRule && (rules[j] as CSSStyleRule).selectorText.includes(`.${className}`)) {
                    return true;
                }
            }
        }
        return false;
    };

    $.nanoid = (size?: number) => nanoid(size);

    $.theme = (mode?: 'light' | 'dark'): 'light' | 'dark' => {
        const $html = $('html');

        const theme = $html.attr('data-bs-theme');
        if (theme === 'dark' || theme === 'light') {
            mode ??= theme;
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            mode ??= 'dark';
        } else {
            mode ??= 'light';
        }

        $html.attr('data-bs-theme', mode);

        return mode;
    };

    $.fn.element = function<T = HTMLElement> (): T {
        return $(this)[0] as T;
    };

    $.fn.fileContents = async function (idx = 0): Promise<FileContents> {
        const $this = $(this) as JQuery<HTMLInputElement>;

        const files: FileList | undefined = $this.prop('files');

        if (!files || files.length === 0) {
            throw new Error('Could not read input field');
        }

        const file = files[idx];

        if (!file) {
            throw new Error('Could not read input file');
        }

        const content = Buffer.from(await file.arrayBuffer());

        const { size, type, name, lastModified, webkitRelativePath } = file;

        return {
            name,
            type,
            size,
            lastModified: new Date(lastModified),
            webkitRelativePath,
            content
        };
    };

    $.fn.fileCount = function (): number {
        const $this = $(this) as JQuery<HTMLInputElement>;

        return $this.prop('files').length || 0;
    };

    $.fn.fullHTML = function (): string {
        const $this = $(this) as JQuery<HTMLElement>;

        return $('<div>')
            .append($this.clone())
            .html();
    };

    $.fn.id = function (): string {
        const $this = $(this);

        const id = $this.attr('id') || nanoid();

        $this.attr('id', id);

        return id;
    };

    $.fn.path = function (type: 'id' | 'tagName' = 'id'): string {
        let $this = $(this) as JQuery<HTMLElement>;

        const ids: string[] = [];

        do {
            if (type === 'tagName') {
                const id = $this.prop(type);

                if (id) {
                    ids.push(id);
                }
            } else {
                ids.push($this.id());
            }

            $this = $this.parent();
        } while (typeof $this.prop('tagName') !== 'undefined');

        return ids.reverse()
            .map(elem => `${type === 'id' ? '#' : ''}${elem}`)
            .join(type === 'id' ? ' ' : ' > ');
    };

    $.fn.type = function (): string {
        return $(this).prev().prop('nodeName');
    };
})(window.$);

export {};
