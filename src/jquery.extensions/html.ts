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

import type { HTML } from '../types';
import { Buffer } from '../modules/buffer';
import { nanoid } from 'nanoid';

interface FileContents extends Omit<File, 'arrayBuffer' | 'slice' | 'stream' | 'text' | 'lastModified' | 'bytes'> {
    content: Buffer;
    lastModified: Date;
}

type ScrollToOptions = {
    /**
     * Whether focus should be applied automatically to the element
     * after the scroll animation completes
     * @default true
     */
    autoFocus: boolean;
    /**
     * The offset to scroll to in addition to the element's offset
     * Note: to scroll higher than the element, supply a negative value
     * @default 0
     */
    offset: number | Partial<{ top: number, left: number }>,
    /**
     * The scroll behavior to use
     * @default auto
     */
    behavior: 'smooth' | 'instant' | 'auto'
    /**
     * The direction in which to scroll
     * @default both
     */
    direction: 'vertical' | 'horizontal' | 'both';
    /**
     * Callback method that is called when the animation is complete
     */
    callback: () => void;
    /**
     * Whether the method should silently discard errors
     * @default true
     */
    noThrow: boolean;
}

declare global {
    interface JQuery {
        /**
         * Disables the element
         */
        disable(): JQuery;

        /**
         * Fetches the HTML DOM Object
         */
        element<T = HTMLElement>(): T;

        /**
         * Enables the element
         */
        enable(): JQuery;

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
         * Retrieve the full HTML for the specified element, including the element itself
         */
        fullHTML(): string;

        /**
         * Returns the element ID; or, if one is not set, assigns a random UUID to it
         * and returns it
         */
        id(): string;

        /**
         * Sets the readonly property/attribute of the element
         */
        lock(): JQuery;

        /**
         * Returns the full selector path of the element
         *
         * @param type
         */
        path(type?: 'id' | 'tagName'): string;

        /**
         * Scrolls to the element
         *
         * @param options
         */
        scrollTo(options?: Partial<ScrollToOptions>): JQuery;

        /**
         * Returns the element type
         */
        type(): string;

        /**
         * Unsets the readonly property/attribute of the element
         */
        unlock(): JQuery;
    }

    interface JQueryStatic {
        /**
         * Create a form floating element set with a label
         * @param options
         */
        createFloatingInput(options?: Partial<HTML.Input.Options>): JQuery<HTMLElement>;

        /**
         * Creates a form floating input group with a label
         *
         * @param options
         */
        createFloatingInputGroup(options?: Partial<HTML.Input.Options>): JQuery<HTMLElement>;

        /**
         * Creates an input group element
         */
        createInputGroup(): JQuery<HTMLElement>;

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
         * 2) already set via the HTML tag
         * 3) browser preference
         * 4) light mode
         *
         * @param mode
         */
        theme(mode?: 'light' | 'dark'): 'light' | 'dark';
    }
}

($ => {
    $.createFloatingInput = (
        options: Partial<HTML.Input.Options> = {}
    ): JQuery<HTMLElement> => {
        options.type ??= 'text';
        options.readonly ??= false;
        options.disabled ??= false;
        options.id ??= options.input?.id() ?? nanoid();

        const float = $('<div class="form-floating">');

        const label = $('<label>');

        if (options.label) {
            if (typeof options.label === 'string') {
                label.text(options.label);
            } else {
                options.label.appendTo(label);
            }
        }

        if (options.id) {
            label.attr('for', options.id);

            if (options.type === 'file') {
                float.removeClass('form-floating input-group');

                label.addClass('form-label')
                    .appendTo(float);
            }
        }

        if (!options.input) {
            const element = $('<input>')
                .attr('type', options.type);

            if (options.id) {
                element.attr('id', options.id);
            }

            if (options.class) {
                element.addClass(options.class);
            }

            if (options.readonly) {
                element.lock();
            }

            if (options.disabled) {
                element.disable();
            }

            for (const key of Object.keys(options)) {
                if (key === 'id' || key === 'label' || key === 'class' ||
                    key === 'readonly' || key === 'disabled' ||
                    key === 'invalid-feedback' || key === 'valid-feedback') {
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
            if (options.id) {
                options.input.attr('id', options.id);
            }

            options.input.addClass('form-control')
                .appendTo(float);
        }

        if (label.attr('for') && options.type !== 'file') {
            label.appendTo(float);
        }

        if (options.valid_feedback) {
            if (typeof options.valid_feedback === 'string') {
                $('<div class="valid-feedback">')
                    .text(options.valid_feedback)
                    .attr('id', `${options.id}-valid-feedback`)
                    .appendTo(float);
            } else {
                const id = options.valid_feedback.attr('id') || `${options.id}-valid-feedback`;

                options.valid_feedback.attr('id', id);

                options.valid_feedback.appendTo(float);
            }
        }

        if (options.invalid_feedback) {
            if (typeof options.invalid_feedback === 'string') {
                $('<div class="invalid-feedback">')
                    .text(options.invalid_feedback)
                    .attr('id', `${options.id}-invalid-feedback`)
                    .appendTo(float);
            } else {
                const id = options.invalid_feedback.attr('id') || `${options.id}-invalid-feedback`;

                options.invalid_feedback.attr('id', id);

                options.invalid_feedback.appendTo(float);
            }
        }

        return float;
    };

    $.createFloatingInputGroup = (
        options: Partial<HTML.Input.Options> = {}
    ): JQuery<HTMLElement> => {
        return $.createInputGroup().append($.createFloatingInput(options));
    };

    $.createInputGroup = (): JQuery<HTMLElement> => {
        return $('<div class="input-group">');
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

    $.fn.disable = function (): JQuery {
        return $(this).attr('disabled', 'disabled')
            .prop('disabled', true);
    };

    $.fn.element = function<T = HTMLElement> (): T {
        return $(this)[0] as T;
    };

    $.fn.enable = function (): JQuery {
        return $(this).removeAttr('disabled')
            .removeProp('disabled');
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

    $.fn.lock = function (): JQuery {
        return $(this).attr('readonly', 'readonly')
            .prop('readonly', true);
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

    $.fn.scrollTo = function (options: Partial<ScrollToOptions> = {}): JQuery {
        const $this = $(this) as JQuery<HTMLElement>;
        options.autoFocus ??= true;
        options.offset ??= 0;
        options.behavior ??= 'auto';
        options.direction ??= 'both';
        options.callback ??= () => {};
        options.noThrow ??= true;

        const throwError = (message: string): JQuery => {
            if (!options.noThrow) {
                throw new Error(message);
            }

            return $this;
        };

        if (!$this.is(':visible')) {
            return throwError('Element is not visible');
        }

        if (typeof $this.offset === 'undefined') {
            return throwError('Could not find element offset');
        }

        let top = 0;
        let left = 0;

        try {
            top = $this.offset()?.top || 0;
            left = $this.offset()?.left || 0;
        } catch {
            return throwError('Could not find element offset');
        }

        if (typeof options.offset === 'number') {
            top += options.offset;
            left += options.offset;
        } else if (typeof options.offset === 'object') {
            top += options.offset.top || 0;
            left += options.offset.left || 0;
        }

        const properties: Record<string, number> = {};

        if (options.direction === 'vertical' || options.direction === 'both') {
            properties.top = top;
        }

        if (options.direction === 'horizontal' || options.direction === 'both') {
            properties.left = left;
        }

        window.scrollTo({
            ...properties,
            behavior: options.behavior
        });

        if (options.autoFocus) {
            $this.trigger('focus');
        }

        if (options.callback) {
            options.callback.call($this);
        }

        return $this;
    };

    $.fn.type = function (): string {
        return $(this).prev().prop('nodeName');
    };

    $.fn.unlock = function (): JQuery {
        return $(this).removeAttr('readonly')
            .removeProp('readonly');
    };
})(window.$);

export {};
