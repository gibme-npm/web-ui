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

/**
 * Vanilla JS loading of a <script> element
 *
 * @param url
 * @param defer
 * @param integrity
 */
export const load_script = async (url: string, defer = false, integrity?: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const elem = document.createElement('script');
        elem.src = url;
        elem.defer = defer;
        elem.async = false;
        elem.crossOrigin = 'anonymous';
        elem.referrerPolicy = 'no-referrer';

        if (integrity) {
            elem.integrity = integrity;
        }

        elem.addEventListener('load', () => resolve(url));

        elem.addEventListener('error', function (event) {
            return reject(new Error(event.message));
        });

        document.head.appendChild(elem);
    });
};

/**
 * Vanilla JS loading of a <link rel="stylesheet"> element
 *
 * @param url
 * @param integrity
 */
export const load_css = async (url: string, integrity?: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const elem = document.createElement('link');
        elem.crossOrigin = 'anonymous';
        elem.referrerPolicy = 'no-referrer';
        elem.href = url;
        elem.rel = 'stylesheet';

        if (integrity) {
            elem.integrity = integrity;
        }

        elem.addEventListener('load', () => resolve(url));

        elem.addEventListener('error', function (event) {
            return reject(new Error(event.message));
        });

        document.head.appendChild(elem);
    });
};
