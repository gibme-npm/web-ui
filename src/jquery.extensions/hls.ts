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
import type { default as HLS, HlsConfig as HLSConfig } from 'hls.js';
import { HTML } from '../types';

declare global {
    interface JQueryStatic {
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
        createHLSMedia(
            src: string,
            options?: Partial<HTML.Video.Options>,
            hlsConfig?: Partial<HLSConfig>
        ): [JQuery<HTMLMediaElement>, HLS];
    }
}

$.createHLSMedia = function (
    src: string,
    options: Partial<HTML.Video.Options> = {},
    hlsConfig: Partial<HLSConfig> = {}
): [JQuery<HTMLMediaElement>, HLS] {
    if (!window.Hls) throw new Error('Hls.js not loaded');

    const hls = new window.Hls(hlsConfig);

    const element = $.createMedia(undefined, options);

    hls.loadSource(src);
    hls.attachMedia(element[0]);

    if (options.autoplay) {
        hls.on(window.Hls.Events.MEDIA_ATTACHED, () => {
            element.trigger('play');
        });
    }

    return [element, hls];
};
