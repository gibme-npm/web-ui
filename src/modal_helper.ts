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

import './bootstrap5';
import $ from 'jquery';
import { v4 as uuid } from 'uuid';
import UIHelper from './ui_helper';

/**
 * Describes modal options
 */
export interface ModalOpenOptions<
    BodyElement extends HTMLElement = HTMLElement,
    TitleElement extends HTMLElement = HTMLElement,
    FooterElement extends HTMLElement = HTMLElement
> {
    /**
     * The body of the modal
     */
    body: JQuery<BodyElement> | string;
    /**
     * The title of the modal
     */
    title: JQuery<TitleElement> | string;
    /**
     * The footer of the modal
     */
    footer: JQuery<FooterElement> | string;
    /**
     * A timeout wherein the modal will auto hide
     */
    timeout: number;
    /**
     * Whether we display the default close button in the upper right of the modal
     */
    useDefaultCloseButton: boolean;
    /**
     * Whether `body`, `title`, and `footer` are **destructive** meaning that if they
     * are passed in as JQuery elements, the elements will be **moved** into the modal
     * whereby they may be removed in the future.
     */
    destructive: boolean;

    [key: string]: any;
}

export default abstract class ModalHelper {
    private static readonly id = uuid();
    public static readonly modal_selector = `${ModalHelper.id}`;
    public static readonly modal_header_selector = `${ModalHelper.id}-header`;
    public static readonly modal_title_selector = `${ModalHelper.id}-title`;
    public static readonly modal_close_button_selector = `${ModalHelper.id}-close-button`;
    public static readonly modal_body_selector = `${ModalHelper.id}-body`;
    public static readonly modal_footer_selector = `${ModalHelper.id}-footer`;

    /**
     * Returns the modal element
     *
     * @param parent
     */
    public static modal<ElementType extends HTMLElement = HTMLElement> (
        parent?: JQuery<ElementType>
    ): JQuery<HTMLElement> {
        if (parent) {
            return parent.find(`#${ModalHelper.modal_selector}`);
        }

        return $(`#${ModalHelper.modal_selector}`);
    }

    /**
     * Returns the modal header element
     *
     * @param parent
     */
    public static header<ElementType extends HTMLElement = HTMLElement> (
        parent?: JQuery<ElementType>
    ): JQuery<HTMLElement> {
        if (parent) {
            return parent.find(`#${ModalHelper.modal_header_selector}`);
        }

        return $(`#${ModalHelper.modal_header_selector}`);
    }

    /**
     * Returns the modal title element
     *
     * @param parent
     */
    public static title<ElementType extends HTMLElement = HTMLElement> (
        parent?: JQuery<ElementType>
    ): JQuery<HTMLElement> {
        if (parent) {
            return parent.find(`#${ModalHelper.modal_title_selector}`);
        }

        return $(`#${ModalHelper.modal_title_selector}`);
    }

    /**
     * Returns the modal close button element
     *
     * @param parent
     */
    public static close_button<ElementType extends HTMLElement = HTMLElement> (
        parent?: JQuery<ElementType>
    ): JQuery<HTMLElement> {
        if (parent) {
            return parent.find(`#${ModalHelper.modal_close_button_selector}`);
        }

        return $(`#${ModalHelper.modal_close_button_selector}`);
    }

    /**
     * Returns the modal body element
     *
     * @param parent
     */
    public static body<ElementType extends HTMLElement = HTMLElement> (
        parent?: JQuery<ElementType>
    ): JQuery<HTMLElement> {
        if (parent) {
            return parent.find(`#${ModalHelper.modal_body_selector}`);
        }

        return $(`#${ModalHelper.modal_body_selector}`);
    }

    /**
     * Returns the modal footer element
     *
     * @param parent
     */
    public static footer<ElementType extends HTMLElement = HTMLElement> (
        parent?: JQuery<ElementType>
    ): JQuery<HTMLElement> {
        if (parent) {
            return parent.find(`#${ModalHelper.modal_footer_selector}`);
        }

        return $(`#${ModalHelper.modal_footer_selector}`);
    }

    /**
     * Closes the modal
     *
     * Note: can be called even if the modal is not open
     */
    public static close () {
        if (ModalHelper.modal().length !== 0) {
            ModalHelper.modal().modal('hide');
        }
    }

    /**
     * Opens the modal using the supplied options
     *
     * Note: If body, title, or footer are passed as JQuery<> elements the call is
     * non-destructive (i.e. the elements will be cloned and the ids changed to avoid
     * conflicts elsewhere)
     *
     * @param options
     */
    public static open<
        BodyElement extends HTMLElement = HTMLElement,
        TitleElement extends HTMLElement = HTMLElement,
        FooterElement extends HTMLElement = HTMLElement
    > (options: Partial<ModalOpenOptions<BodyElement, TitleElement, FooterElement>> = {}) {
        options.title ??= 'New Message!';
        options.useDefaultCloseButton ??= true;

        if (!options.body) {
            throw new Error('Modal must have a body');
        }

        if (typeof options.body !== 'string' && options.body.length === 0) {
            throw new Error('Could not locate specified body element for modal');
        }

        if (typeof options.title !== 'string' && options.title.length === 0) {
            throw new Error('Could not locate specified title element for modal');
        }

        if (options.footer && typeof options.footer !== 'string' && options.footer.length === 0) {
            throw new Error('Could not locate specified footer element for modal');
        }

        if (ModalHelper.modal().length === 0) {
            this._constructModal().appendTo($(document.body));
        }

        if (options.useDefaultCloseButton) {
            ModalHelper.close_button().removeClass('d-none');
        } else {
            ModalHelper.close_button().addClass('d-none');
        }

        if (options.title?.length === 0 && !options.useDefaultCloseButton) {
            ModalHelper.header().addClass('d-none');
        } else {
            ModalHelper.header().removeClass('d-none');
        }

        // clear the title
        ModalHelper.title().text('');
        if (typeof options.title === 'string') {
            ModalHelper.title().text(options.title);
        } else {
            ModalHelper.title().append(
                options.destructive
                    ? options.title
                    : options.title.clone()
                        .attr('id', `${ModalHelper.id}-title-content`));
        }

        UIHelper.clearElement(ModalHelper.body());
        if (typeof options.body === 'string') {
            ModalHelper.body().text(options.body);
        } else {
            ModalHelper.body().append(
                options.destructive
                    ? options.body
                    : options.body.clone()
                        .attr('id', `${ModalHelper.id}-body-content`));
        }

        UIHelper.clearElement(ModalHelper.footer());
        if (options.footer) {
            if (typeof options.footer === 'string') {
                ModalHelper.footer().text(options.footer);
            } else {
                ModalHelper.footer().append(
                    options.destructive
                        ? options.footer
                        : options.footer.clone()
                            .attr('id', `${ModalHelper.id}-footer-content`));
            }
            ModalHelper.footer().removeClass('d-none');
        } else {
            ModalHelper.footer().addClass('d-none');
        }

        ModalHelper.modal().modal('show');

        if (options.timeout) {
            setTimeout(() => ModalHelper.modal().modal('hide'), options.timeout);
        }
    }

    /**
     * Constructs a new instance of the modal within the document
     *
     * @private
     */
    private static _constructModal (): JQuery<HTMLElement> {
        const modal = UIHelper.createElement('div')
            .addClass('modal fade')
            .attr('id', ModalHelper.modal_selector)
            .attr('tabindex', '-1')
            .attr('role', 'dialog')
            .attr('aria-labelledby', ModalHelper.modal_title_selector)
            .attr('aria-hidden', 'true');

        const dialog = UIHelper.createElement('div')
            .addClass('modal-dialog modal-lg modal-dialog-centered')
            .attr('role', 'document');

        const content = UIHelper.createElement('div')
            .addClass('modal-content');

        {
            const header = UIHelper.createElement('div')
                .addClass('modal-header');

            UIHelper.createElement('h5')
                .addClass('modal-title')
                .attr('id', ModalHelper.modal_title_selector)
                .appendTo(header);

            UIHelper.createAwesomeButton('xmark', {},
                [
                    ['aria-hidden', 'true'],
                    ['id', ModalHelper.modal_close_button_selector],
                    ['data-dismiss', 'modal'],
                    ['aria-label', 'Close']
                ])
                .addClass('btn-outline-danger close')
                .on('click', () => ModalHelper.close())
                .appendTo(header);

            header.appendTo(content);
        }

        UIHelper.createElement('div')
            .addClass('modal-body')
            .attr('id', ModalHelper.modal_body_selector)
            .appendTo(content);

        UIHelper.createElement('div')
            .addClass('modal-footer')
            .attr('id', ModalHelper.modal_footer_selector)
            .appendTo(content);

        content.appendTo(dialog);

        dialog.appendTo(modal);

        return modal;
    }
}

export { ModalHelper };
