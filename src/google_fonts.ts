// Copyright (c) 2024, Brandon Lehmann <brandonlehmann@gmail.com>
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

import $ from './jquery';
import Helper from './ui_helper';

export type FontDisplayType = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';

/**
 * A very simple wrapper around the Google Fonts CSS API that loads fonts
 * with Regular, Bold, Italic, and Bold Italic styles
 *
 * See: https://developers.google.com/fonts/docs/css2
 *
 * @param families
 * @param display
 * @constructor
 */
export const GoogleFontsLoader = (
    families: string | string[],
    display: FontDisplayType = 'swap'
): void => {
    if (!Array.isArray(families)) {
        families = [families];
    }

    const header = $('head');

    Helper.createElement('link')
        .attr('rel', 'preconnect')
        .attr('href', 'https://fonts.gstatic.com')
        .appendTo(header);

    class FontURL {
        private arguments: string[] = [];

        constructor (display: FontDisplayType = 'swap') {
            this.addArgument('display', display);
        }

        public addFamily (family: string): void {
            const value = encodeURIComponent(family);

            this.addArgument('family', `${value}:ital,wght@0,400;0,700;1,400;1,700`);
        }

        private addArgument (key: string, value: string): void {
            this.arguments.push(`${key}=${value}`);
        }

        public toString (): string {
            return `https://fonts.googleapis.com/css2?${this.arguments.join('&')}`;
        }
    }

    const font_css_url = new FontURL(display);

    families.forEach(family => font_css_url.addFamily(family));

    Helper.createElement('link')
        .attr('href', font_css_url.toString())
        .attr('rel', 'stylesheet')
        .appendTo(header);
};

export default GoogleFontsLoader;
