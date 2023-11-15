// Copyright (c) 2021-2023, Brandon Lehmann <brandonlehmann@gmail.com>
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
import { DataTableConfig } from './datatables';
import HLS, { HlsConfig as HLSConfig } from 'hls.js';
import { v4 as uuid } from 'uuid';

/**
 * Video element creation options
 */
export interface VideoElementOptions {
    autoplay: boolean;
    controls: boolean;
    loop: boolean;
    muted: boolean;
    playsinline: boolean;

    [key: string]: boolean;
}

/**
 * Font Awesome options namespace
 */
export namespace FontAwesome {
    /**
     * Defines the Font Awesome style
     */
    export type Style = 'solid' | 'regular' | 'light' | 'duotone' | 'thin';
    /**
     * Defines the Font Awesome animation
     */
    export type Animation = 'none' | 'beat' | 'beat-fade' | 'bounce' | 'fade'
        | 'flip' | 'shake' | 'spin' | 'spin-reverse' | 'spin-pulse';
    /**
     * Defines the Font Awesome rotation
     *
     * Note: does not work if an animation is specified
     */
    export type Rotation = 'none' | 'rotate-90' | 'rotate-180' |'rotate-270'
        | 'flip-horizontal' | 'flip-vertical' | 'flip-both';
    /**
     * Defines the Font Awesome icon size
     */
    export type Size = 'default' | '2xs' | 'xs' | 'lg' | 'xl' | '2xl';
}

/**
 * Font Awesome Option set
 */
export interface FontAwesomeOptions {
    class: string;
    style: FontAwesome.Style;
    animation: FontAwesome.Animation;
    rotation: FontAwesome.Rotation;
    size: FontAwesome.Size;
    color: `#${string}`;
}

/**
 * Font Awesome Button Options set
 */
export interface FontAwesomeButtonOptions extends FontAwesomeOptions {
    label: string | JQuery<HTMLElement>;
}

/**
 * HTML Input namespace
 */
export namespace HTMLInput {
    /**
     * Defines the HTML Input type
     */
    export type Type = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file'
    |'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search'
| 'submit' | 'tel' | 'text' |'time' | 'url' | 'week'
}

/**
 * HTML Input Option Set
 */
export interface HTMLInputOptions {
    type: HTMLInput.Type;
    class: string;
    id: string;
    label: string | JQuery<HTMLElement>
    input: JQuery<HTMLElement>

    [key: string]: string | number | JQuery<HTMLElement>;
}

export default abstract class UIHelper {
    /**
     * Clears all the child elements and inner text/HTML from the specified element
     *
     * @param parent
     */
    public static clearElement<ElementType extends HTMLElement = HTMLElement> (
        parent: JQuery<ElementType> | string
    ) {
        if (typeof parent === 'string') {
            parent = parent.startsWith('#') ? $(parent) : $(`#${parent}`);
        }

        while (parent.children().length > 0) {
            parent.children().first().remove();
        }

        parent.text('');
    }

    /**
     * Creates a font awesome button
     *
     * Note: This method supports legacy button creation via specifying the full FontAwesome icon path in the
     * icon argument and an Array of attributes for the button. It also supports the new style icon creation
     * such as that found in `createAwesomeIcon`. Support for the legacy method will be removed in a future
     * release.
     *
     * @param icon
     * @param attributesOrOptions
     * @param attributes
     */
    public static createAwesomeButton (
        icon: string | string[],
        attributesOrOptions: string[][] | Partial<FontAwesomeButtonOptions> = [],
        attributes: string[][] = []
    ): JQuery<HTMLElement> {
        if (Array.isArray(icon)) {
            icon = icon.join(' ');
        }

        const button = UIHelper.createElement('button')
            .addClass('btn')
            .attr('type', 'button');

        if (Array.isArray(attributesOrOptions)) {
            const element = UIHelper.createElement('i')
                .addClass(icon);

            for (const [key, value] of attributesOrOptions) {
                element.attr(key, value);
            }

            element.appendTo(button);
        } else {
            const element = UIHelper.createAwesomeIcon(icon, attributesOrOptions);

            for (const [key, value] of attributes) {
                element.attr(key, value);
            }

            element.appendTo(button);

            if (attributesOrOptions.label && typeof attributesOrOptions.label === 'string') {
                UIHelper.createElement('span')
                    .text(` ${attributesOrOptions.label}`)
                    .appendTo(button);
            } else if (attributesOrOptions.label && typeof attributesOrOptions.label !== 'string') {
                attributesOrOptions.label.appendTo(button);
            }
        }

        return button;
    }

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
    public static createAwesomeIcon (
        icon: string | string[],
        options: Partial<FontAwesomeOptions> = {}
    ): JQuery<HTMLElement> {
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

        const element = UIHelper.createElement('i')
            .addClass(`fa-${options.style} ${icon}`);

        if (options.animation !== 'none') {
            element.addClass(`fa-${options.animation}`);
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

        return element;
    }

    /**
     * Creates a new DataTable
     *
     * @param id
     * @param options
     */
    public static createDataTable (
        id: string | JQuery<HTMLElement>,
        options?: DataTableConfig
    ) {
        return ((typeof id === 'string') ? $(`#${id}`) : id).DataTable(options);
    }

    /**
     * Creates a new JQuery HTML Element of the specified type
     *
     * @param type
     */
    public static createElement<Type extends HTMLElement = HTMLElement> (
        type: string
    ): JQuery<Type> {
        return $(document.createElement(type)) as any;
    }

    /**
     * Creates a form floating input group with a label
     *
     * @param options
     */
    public static createFloatingInputGroup (
        options: Partial<HTMLInputOptions> = {}
    ): JQuery<HTMLElement> {
        options.type ??= 'text';

        const id = options.id || options.input?.attr('id') || uuid();

        const float = UIHelper.createElement('div')
            .addClass('form-floating input-group');

        const label = UIHelper.createElement('label');

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
            const element = UIHelper.createElement('input')
                .attr('type', options.type);

            if (id) {
                element.attr('id', id);
            }

            if (options.class) {
                element.addClass(options.class);
            }

            for (const key of Object.keys(options)) {
                if (key === 'id' || key === 'label' || key === 'class') {
                    continue;
                }

                const value = options[key];

                if (typeof value === 'string' || typeof value === 'number') {
                    element.attr(key, value.toString());
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
    }

    /**
     * Creates a new JQuery HTML Media Element with the properties set as defined in the options
     * It loads a hls.js player around the element so that it can load that content
     *
     * Note: if autoplay is enabled, muted will be set to true
     *
     * @param src
     * @param options
     * @param hlsConfig
     */
    public static createHLSMediaElement (
        src: string,
        options: Partial<VideoElementOptions> = {},
        hlsConfig: Partial<HLSConfig> = {}
    ): [JQuery<HTMLMediaElement>, HLS] {
        const hls = new HLS(hlsConfig);

        const element = UIHelper.createMediaElement(undefined, options);

        hls.loadSource(src);
        hls.attachMedia(element[0]);

        if (options.autoplay) {
            hls.on(HLS.Events.MEDIA_ATTACHED, () => {
                element.trigger('play');
            });
        }

        return [element, hls];
    }

    /**
     * Creates a new JQuery HTML Media Element with the properties set as defined in the options
     *
     * Note: if autoplay is enabled, muted will be set to true
     *
     * @param src
     * @param options
     */
    public static createMediaElement (
        src?: string,
        options: Partial<VideoElementOptions> = {}
    ): JQuery<HTMLMediaElement> {
        if (options.autoplay) {
            options.muted = true;
        }

        const element = UIHelper.createElement<HTMLMediaElement>('video')
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
    }

    /**
     * Fetches the HTML DOM Object by the id or from a JQuery HTML Element
     *
     * @param id
     */
    public static fetchElement<Type extends HTMLElement = HTMLElement> (
        id: string | JQuery<HTMLElement>
    ): Type {
        return (typeof id === 'string' ? $(`#${id}`)[0] : id[0]) as any;
    }

    /**
     * Retrieve the full HTML for the specified element including the element itself
     *
     * @param element
     */
    public static fetchHTML<Type extends HTMLElement = HTMLElement> (
        element: JQuery<Type>
    ): string | undefined {
        return UIHelper.createElement('div')
            .append(element.clone())
            .html();
    }
}

export { UIHelper };