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

import type { QRCode } from '@gibme/qrcode';
import { version, JSDELIVR, loadScript } from '../helpers/cdn';
import { Buffer } from '../modules/buffer';

declare global {
    interface JQuery {
        /**
         * Fetches a QR Code created with the specified options and either updates
         * the element in place, replaces the element, or draws it in the canvas
         *
         * Note: only <img>, <svg>, and <canvas> elements are supported at this time
         */
        qrCode(text: string, options?: Partial<QRCode.Options>): Promise<JQuery>
    }

    interface Window {
        QRCode: typeof QRCode;
    }
}

($ => {
    $.fn.qrCode = async function (text: string, options: Partial<QRCode.Options> = {}): Promise<JQuery> {
        await loadScript(window.QRCode,
            `${JSDELIVR}/@gibme/qrcode@${version('@gibme/qrcode')}/dist/QRCode.bundle.js`);

        const $this = $(this);
        options.size ??= $this.width();

        if ($this.is('img') || $this.is('canvas')) {
            options.format = 'png';
        } else if ($this.is('svg')) {
            options.format = 'svg';
        } else {
            throw new Error('Unsupported element for QR Code');
        }

        const url = window.QRCode(text, options);

        const response = await $.fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Could not fetch QR Code Image');
        }

        const blob = await response.blob();

        const buffer = Buffer.from(await blob.arrayBuffer(), blob.type);

        if (options.format === 'png' && $this.is('img')) {
            return new Promise((resolve, reject) => {
                $this.attr('src', buffer.toString('inline-base64'))
                    .one('load', () => resolve($this))
                    .one('error', () => reject(new Error('An unknown error occurred')));
            });
        } else if (options.format === 'svg' && $this.is('svg')) {
            const elem = $(buffer.toString());
            const elem_attrs = (() => {
                const attributes: string[][] = [];

                $.each(elem.element<SVGImageElement>().attributes, function () {
                    if (this.name === 'width' || this.name === 'height') return;

                    attributes.push([this.name, this.value]);
                });

                return attributes;
            })();

            // copy the current element's attributes to our new element
            $.each($this.element<SVGImageElement>().attributes, function () {
                elem.attr(this.name, this.value);
            });

            // copy back over the new elements attributes
            for (const [name, value] of elem_attrs) {
                elem.attr(name, value);
            }

            $this.replaceWith(elem);

            return elem;
        } else if (options.format === 'png' && $this.is('canvas')) {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.src = buffer.toString('inline-base64');
                image.onerror = (_event, _source, _lineno, _colno, error) => {
                    if (error) {
                        return reject(error);
                    }

                    return reject(new Error('An unknown error occurred'));
                };
                image.onload = () => {
                    const canvas = $this.element<HTMLCanvasElement>();
                    const context = canvas.getContext('2d');

                    if (!context) {
                        return reject(new Error('Could not get canvas 2d context'));
                    }

                    const scale = Math.min(canvas.width / image.width, canvas.height / image.height);

                    const [x, y] = [
                        (canvas.width - image.width * scale) / 2,
                        (canvas.height - image.width * scale) / 2
                    ];

                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(image,
                        0, 0, image.width, image.height,
                        x, y, image.width * scale, image.height * scale);

                    return resolve($this);
                };
            });
        } else {
            throw new Error('Unsupported element type');
        }
    };
})(window.$);

export {};
