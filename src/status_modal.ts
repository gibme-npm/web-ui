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

export default abstract class StatusModal extends ModalHelper {
    /**
     * Displays a modal with jquery using the supplied elements, message, and style
     *
     * @param message
     * @param header
     * @param isError
     * @param timeout
     * @param style
     * @param useDefaultCloseButton
     */
    public static show (
        message: any,
        header = 'New Message!',
        isError = false,
        timeout?: number,
        style?: Partial<{
            successClass: string;
            errorClass: string
        }>,
        useDefaultCloseButton = true
    ) {
        if (message.data && message.data.message) {
            message = message.data.message;
        } else if (message.message) {
            message = message.message;
        }

        let final_message = message.toString();

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

        const title = UIHelper.createElement('span')
            .addClass('alert')
            .text(header);

        if (isError) {
            title.addClass(style?.errorClass || 'text-danger');
        } else {
            title.addClass(style?.successClass || 'text-success');
        }

        ModalHelper.open({
            body,
            title,
            timeout,
            useDefaultCloseButton
        });
    }
}

export { StatusModal };
