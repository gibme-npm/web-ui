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
import { Buffer } from 'buffer';
import type { Options, QRCodeInstance as QRCode } from '@gibme/qrcode';
import './html';
import './fetch';

declare global {
    interface JQuery {
        qrCode(text: string, options: Partial<Options>): JQuery
    }

    interface JQueryStatic {
        qrCode(text: string, options: Partial<Options>): QRCode;
    }
}

$.qrCode = function (text: string, options: Partial<Options> = {}): QRCode {
    if (!window.QRCode) throw new Error('QRCode not loaded');

    return window.QRCode(text, options);
};

$.fn.extend({
    qrCode: async function (text: string, options: Partial<Options> = {}) {
        const $this = $(this);
        options.size ??= $this.width();

        if ($this.is('img') || $this.is('canvas')) {
            options.format = 'png';
        } else if ($this.is('svg')) {
            options.format = 'svg';
        } else {
            throw new Error('Unsupported element for QR Code');
        }

        const code = $.qrCode(text, options);

        const response = await $.fetch(code.base_url, {
            method: 'POST',
            json: code.options
        });

        if (!response.ok) {
            throw new Error('Could not fetch QR Code Image');
        }

        const blob = await response.blob();

        const [type, buffer] = [blob.type, Buffer.from(await blob.arrayBuffer())];

        if (options.format === 'png' && $this.is('img')) {
            return new Promise((resolve, reject) => {
                $this.attr(
                    'src',
                    `data:${type};base64,${buffer.toString('base64')}`)
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
                image.src = `data:${type};base64,${buffer.toString('base64')}`;
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
        }
    }
});
