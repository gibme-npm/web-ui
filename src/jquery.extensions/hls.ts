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

// eslint-disable-next-line import/no-named-default
import type { HlsConfig, default as Hls } from 'hls.js';
import type { HTML } from '../types';
import { version, CDNJS } from '../helpers/cdn';

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
            hlsConfig?: Partial<HlsConfig>
        ): [JQuery<HTMLMediaElement>, Hls];

        /**
         * Creates a new instance of Hls.js using the supplied configuration parameters
         *
         * @param config
         */
        hls(config: Partial<HlsConfig>): Hls;
    }

    interface Window {
        Hls: typeof Hls;
    }
}

($ => {
    const setup = () => {
        $.createHLSMedia = (
            src: string,
            options: Partial<HTML.Video.Options> = {},
            hlsConfig: Partial<HlsConfig> = {}
        ): [JQuery<HTMLMediaElement>, Hls] => {
            const hls = new window.Hls(hlsConfig);

            const elem = $.createMedia(undefined, options);

            hls.loadSource(src);
            hls.attachMedia(elem[0]);

            if (options.autoplay) {
                hls.on(window.Hls.Events.MEDIA_ATTACHED, () => {
                    elem.trigger('play');
                });
            }

            return [elem, hls];
        };

        $.hls = (config: Partial<HlsConfig> = {}) => new window.Hls(config);
    };

    if (typeof window.Hls === 'undefined') {
        $.getScript({
            url: `${CDNJS}/hls.js/${version('hls.js')}/hls.min.js`,
            cache: true,
            success: () => setup()
        });
    } else {
        setup();
    }
})(window.$);

export {};
