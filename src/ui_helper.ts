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
     * @param className
     * @param attributes
     */
    public static createAwesomeButton (
        className: string,
        attributes: Map<string, string> = new Map<string, string>()
    ): JQuery<HTMLElement> {
        const button = UIHelper.createElement('button')
            .addClass('btn')
            .attr('type', 'button');

        const icon = UIHelper.createElement('i')
            .addClass(className);

        for (const [key, value] of attributes) {
            icon.attr(key, value);
        }

        icon.appendTo(button);

        return button;
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
}

export { UIHelper };
