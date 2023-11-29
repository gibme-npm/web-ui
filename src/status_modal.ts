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

import ModalHelper from './modal_helper';
import UIHelper from './ui_helper';

/**
 * Describes status modal options
 */
export interface StatusModalOptions {
    /**
     * The title to use for the status modal
     */
    title: string;
    /**
     * The message to display
     */
    body: any;
    /**
     * The message footer to display
     */
    footer: string;
    /**
     * A timeout wherein the modal will auto hide
     */
    timeout: number;
    /**
     * The class to apply to the title
     */
    class: string;
    /**
     * Whether we display the default close button in the upper right of the modal
     */
    useDefaultCloseButton: boolean;
}

export default abstract class StatusModal extends ModalHelper {
    /**
     * Displays a modal with jquery using the supplied elements, message, and style
     *
     * @param options
     */
    public static show (
        options: Partial<StatusModalOptions> = {}
    ) {
        options.title ??= 'New Message!';

        if (options.body.data && options.body.data.message) {
            options.body = options.body.data.message;
        } else if (options.body.message) {
            options.body = options.body.message;
        }

        let final_message = options.body.toString();

        // Web3 helpers
        // eslint-disable-next-line no-lone-blocks
        {
            const lower = final_message.toLowerCase();

            if (lower.includes('while formatting outputs') ||
                lower.includes('internal error') ||
                lower.includes('header not found')) {
                final_message = 'Internal wallet error, please try again.';
            }

            final_message = final_message.replace('execution reverted:', '').trim();
        }

        const body = UIHelper.createElement('div')
            .addClass('alert')
            .text(final_message);

        const _title = UIHelper.createElement('span')
            .addClass('alert')
            .text(options.title);

        if (options.class) {
            _title.addClass(options.class);
        }

        ModalHelper.open({
            title: _title,
            body,
            footer: options.footer,
            timeout: options.timeout,
            useDefaultCloseButton: options.useDefaultCloseButton
        });
    }
}

export { StatusModal };
