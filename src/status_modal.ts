// Copyright (c) 2021-2022, Brandon Lehmann <brandonlehmann@gmail.com>
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

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import { createElement } from './web-ui';

export default abstract class StatusModal {
    private static readonly _text = $('#statusText');
    private static readonly _element = $('#statusModal');

    /**
     * Displays a modal with jquery using the supplied elements, message, and style
     *
     * @param message
     * @param isError
     * @param timeout if defined (in milliseconds), the modal will auto close
     * @param style
     * @param statusTextElement
     * @param statusModalElement
     */
    public static show (
        message: any,
        isError = false,
        timeout?: number,
        style?: { successClass?: string, errorClass?: string },
        statusTextElement: JQuery<HTMLElement> = StatusModal._text,
        statusModalElement: JQuery<HTMLElement> = StatusModal._element
    ) {
        [statusTextElement, statusModalElement] = StatusModal._construct(statusTextElement, statusModalElement);

        if (!isError) {
            statusTextElement.addClass(style?.successClass || 'alert-success');
            statusTextElement.removeClass(style?.errorClass || 'alert-danger');
        } else {
            statusTextElement.removeClass(style?.successClass || 'alert-success');
            statusTextElement.addClass(style?.errorClass || 'alert-danger');
        }

        if (message.data && message.data.message) {
            message = message.data.message;
        } else if (message.message) {
            message = message.message;
        }

        let finalMessage = message.toString();

        // Web3 helpers
        // eslint-disable-next-line no-lone-blocks
        {
            if (finalMessage.toLowerCase().includes('while formatting outputs') ||
                finalMessage.toLowerCase().includes('internal error') ||
                finalMessage.toLowerCase().includes('header not found')) {
                finalMessage = 'Internal wallet error, please try again.';
            }

            finalMessage = finalMessage.replace('execution reverted:', '').trim();
        }

        statusTextElement.text(finalMessage);

        if (finalMessage.length !== 0) {
            console.info(finalMessage);
            $.noConflict();
            statusModalElement.modal('show');

            if (timeout) {
                setTimeout(() => statusModalElement.modal('hide'), timeout);
            }
        }
    }

    /**
     * Constructs the necessary elements if they do not exist
     *
     * @param statusTextElement
     * @param statusModalElement
     * @protected
     */
    protected static _construct (
        statusTextElement: JQuery<HTMLElement> = StatusModal._text,
        statusModalElement: JQuery<HTMLElement> = StatusModal._element
    ): [JQuery<HTMLElement>, JQuery<HTMLElement>] {
        if (!statusTextElement.length || !statusModalElement.length) {
            statusModalElement = createElement('div')
                .addClass('modal')
                .addClass('fade')
                .attr('tabindex', '-1')
                .attr('role', 'dialog')
                .attr('arial-labelledby', 'statusModal')
                .attr('aria-hidden', 'true')
                .attr('id', 'statusModal');

            {
                const document = createElement('div')
                    .addClass('modal-dialog')
                    .addClass('modal-lg')
                    .addClass('modal-dialog-centered')
                    .attr('role', 'document');

                {
                    const content = createElement('div')
                        .addClass('modal-content');

                    {
                        const title = createElement('div')
                            .addClass('modal-header')
                            .addClass('bg-dark')
                            .addClass('text-light');

                        const titleText = createElement('h5')
                            .addClass('modal-title')
                            .text('Alert!');
                        titleText.appendTo(title);
                        title.appendTo(content);
                    }

                    {
                        const body = createElement('div')
                            .addClass('modal-body');

                        statusTextElement = createElement('p')
                            .attr('id', 'statusText')
                            .css('font-size', '12px')
                            .addClass('alert');
                        statusTextElement.appendTo(body);
                        body.appendTo(content);
                    }

                    content.appendTo(document);
                }

                document.appendTo(statusModalElement);
            }

            statusModalElement.appendTo($(document.body));
        }

        return [statusTextElement, statusModalElement];
    }
}

export { StatusModal };
