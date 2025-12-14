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

import { Modal } from './modal';
import { StatusModalTypes } from './types';
import Options = StatusModalTypes.Options;
export * from './types';

export default abstract class StatusModal extends Modal {
    /**
     * Displays a modal using the supplied elements, message, and style
     *
     * @param options
     */
    public static show (options: Partial<Options> = {}): JQuery {
        options.title ??= 'New Message!';

        if (options.body.data && options.body.data.message) {
            options.body = options.body.data.message;
        } else if (options.body.message) {
            options.body = options.body.message;
        }

        let message = options.body.toString();

        // Web3 helpers

        {
            const lower = message.toLowerCase();

            if (lower.includes('while formatting outputs') ||
                lower.includes('internal error') ||
                lower.includes('header not found')) {
                message = 'Internal wallet error, please try again.';
            }

            message = message.replace('execution reverted:', '').trim();
        }

        return this.open({
            title: $('<span>').addClass(`${options.titleClass}`).text(options.title),
            body: $('<div>').addClass(`${options.bodyClass}`).text(message),
            timeout: options.timeout,
            useDefaultCloseButton: options.useDefaultCloseButton
        });
    }
}

export { StatusModal };
