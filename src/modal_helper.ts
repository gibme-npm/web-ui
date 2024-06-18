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

import $ from './jquery';
import './bootstrap5';
import { v4 as uuid } from 'uuid';
import UIHelper from './ui_helper';

/**
 * The size of the modal
 */
export type ModalSize = 'small' | 'default' | 'large' | 'x-large';

/**
 * The size of the fullscreen modal
 */
export type ModalFullscreenSize = 'always' | 'small' | 'medium' | 'large' | 'x-large' | 'xx-large';

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
    /**
     * The size of the modal; defaults to 'large';
     */
    size: ModalSize;
    /**
     * The size of a fullscreen modal; defaults to `undefined`
     */
    fullscreenSize: ModalFullscreenSize;
    /**
     * Whether the modal should be scrollable; defaults to `false`
     */
    scrollable: boolean;
    /**
     * Whether the modal should be vertically centered; defaults to `true`
     */
    verticallyCentered: boolean;

    [key: string]: any;
}

/**
 * Modal events
 */
export type ModalEvent = 'show' | 'shown' | 'hide' | 'hidden' | 'hidePrevented';

export default abstract class ModalHelper {
    private static readonly id = uuid();
    public static readonly modal_selector = `${ModalHelper.id}`;
    public static readonly modal_dialog_selector = `${ModalHelper.id}-dialog`;
    public static readonly modal_header_selector = `${ModalHelper.id}-header`;
    public static readonly modal_content_selector = `${ModalHelper.id}-content`;
    public static readonly modal_title_selector = `${ModalHelper.id}-title`;
    public static readonly modal_close_button_selector = `${ModalHelper.id}-close-button`;
    public static readonly modal_body_selector = `${ModalHelper.id}-body`;
    public static readonly modal_footer_selector = `${ModalHelper.id}-footer`;
    private static _isOpen = false;

    /**
     * Returns if the modal is currently open
     */
    public static get isOpen (): boolean {
        return ModalHelper._isOpen;
    }

    /**
     * Adds an event listener to the modal
     *
     * @param event
     * @param listener
     */
    public static on (event: ModalEvent, listener: (...args: any[]) => void) {
        ModalHelper.modal().on(`${event}.bs.modal`, listener);
    }

    /**
     * Removes an event listener from the modal
     *
     * @param event
     * @param listener
     */
    public static off (event: ModalEvent, listener: (...args: any[]) => void) {
        ModalHelper.modal().off(`${event}.bs.modal`, listener);
    }

    /**
     * Adds a one-time event listener to the modal
     *
     * @param event
     * @param listener
     */
    public static once (event: ModalEvent, listener: (...args: any[]) => void) {
        ModalHelper.modal().one(`${event}.bs.modal`, listener);
    }

    /**
     * Returns the modal element
     */
    public static modal (): JQuery<HTMLElement> {
        this._constructIfNotExist();

        return $(`#${ModalHelper.modal_selector}`);
    }

    /**
     * Returns the modal dialog element
     *
     * @private
     */
    public static dialog (): JQuery<HTMLElement> {
        this._constructIfNotExist();

        return $(`#${ModalHelper.modal_dialog_selector}`);
    }

    /**
     * Returns the modal header element
     */
    public static header (): JQuery<HTMLElement> {
        this._constructIfNotExist();

        return $(`#${ModalHelper.modal_header_selector}`);
    }

    /**
     * Returns the modal title element
     */
    public static title (): JQuery<HTMLElement> {
        this._constructIfNotExist();

        return $(`#${ModalHelper.modal_title_selector}`);
    }

    /**
     * Returns the modal close button element
     */
    public static close_button (): JQuery<HTMLElement> {
        this._constructIfNotExist();

        return $(`#${ModalHelper.modal_close_button_selector}`);
    }

    /**
     * Returns the modal body element
     */
    public static body (): JQuery<HTMLElement> {
        this._constructIfNotExist();

        return $(`#${ModalHelper.modal_body_selector}`);
    }

    /**
     * Returns the modal footer element
     */
    public static footer (): JQuery<HTMLElement> {
        this._constructIfNotExist();

        return $(`#${ModalHelper.modal_footer_selector}`);
    }

    /**
     * Closes the modal
     *
     * Note: can be called even if the modal is not open
     */
    public static close () {
        this._constructIfNotExist();

        ModalHelper.modal().modal('hide');
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
    > (
        options: Partial<ModalOpenOptions<BodyElement, TitleElement, FooterElement>> = {}
    ) {
        this._constructIfNotExist();

        if (ModalHelper.isOpen) {
            ModalHelper.once('hidden', () => {
                ModalHelper._open(options);
            });

            ModalHelper.close();
        } else {
            ModalHelper._open(options);
        }
    }

    /**
     * Allows for selecting an element within the modal itself
     *
     * @param selector
     */
    public static select<Type extends HTMLElement = HTMLElement> (
        selector: JQuery.Selector
    ): JQuery<Type> {
        this._constructIfNotExist();

        return $(`#${ModalHelper.modal_selector} ${selector}`);
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
    private static _open<
        BodyElement extends HTMLElement = HTMLElement,
        TitleElement extends HTMLElement = HTMLElement,
        FooterElement extends HTMLElement = HTMLElement
    > (options: Partial<ModalOpenOptions<BodyElement, TitleElement, FooterElement>> = {}) {
        options.title ??= 'New Message!';
        options.useDefaultCloseButton ??= true;
        options.size ??= 'large';
        options.verticallyCentered ??= true;

        this._constructIfNotExist();

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

        // set the dialog options
        ModalHelper._setDialogOptions(options);

        ModalHelper.modal().modal('show');

        if (options.timeout) {
            setTimeout(() => ModalHelper.modal().modal('hide'), options.timeout);
        }
    }

    /**
     * Constructs the modal if it does not exist
     *
     * @private
     */
    private static _constructIfNotExist () {
        if ($(`#${ModalHelper.modal_selector}`).length === 0) {
            this._constructModal();
        }
    }

    /**
     * Sets the modal dialog options
     *
     * @param options
     * @private
     */
    private static _setDialogOptions (
        options: Partial<ModalOpenOptions> = {}
    ): void {
        const dialog = ModalHelper.dialog()
            .removeClass('modal-sm modal-lg modal-xl')
            .removeClass('modal-fullscreen-sm-down')
            .removeClass('modal-fullscreen-md-down')
            .removeClass('modal-fullscreen-lg-down')
            .removeClass('modal-fullscreen-xl-down')
            .removeClass('modal-fullscreen-xxl-down')
            .removeClass('modal-fullscreen')
            .removeClass('modal-dialog-scrollable')
            .removeClass('modal-dialog-centered');

        switch (options.size) {
            case 'small':
                dialog.addClass('modal-sm');
                break;
            case 'large':
                dialog.addClass('modal-lg');
                break;
            case 'x-large':
                dialog.addClass('modal-xl');
                break;
            case 'default':
            default:
                break;
        }

        switch (options.fullscreenSize) {
            case 'small':
                dialog.addClass('modal-fullscreen-sm-down');
                break;
            case 'medium':
                dialog.addClass('modal-fullscreen-md-down');
                break;
            case 'large':
                dialog.addClass('modal-fullscreen-lg-down');
                break;
            case 'x-large':
                dialog.addClass('modal-fullscreen-xl-down');
                break;
            case 'xx-large':
                dialog.addClass('modal-fullscreen-xxl-down');
                break;
            case 'always':
                dialog.addClass('modal-fullscreen');
                break;
            default:
                break;
        }

        if (options.scrollable) {
            dialog.addClass('modal-dialog-scrollable');
        }

        if (options.verticallyCentered) {
            dialog.addClass('modal-dialog-centered');
        }
    }

    /**
     * Constructs a new instance of the modal within the document
     *
     * @private
     */
    private static _constructModal (
        options: Partial<ModalOpenOptions> = {}
    ): void {
        options.size ??= 'large';
        options.verticallyCentered ??= true;

        const modal = UIHelper.createElement('div')
            .addClass('modal fade')
            .attr('id', ModalHelper.modal_selector)
            .attr('tabindex', '-1')
            .attr('role', 'dialog')
            .attr('aria-labelledby', ModalHelper.modal_title_selector)
            .attr('aria-hidden', 'true');

        const dialog = UIHelper.createElement('div')
            .addClass('modal-dialog')
            .attr('id', ModalHelper.modal_dialog_selector)
            .attr('role', 'document');

        const content = UIHelper.createElement('div')
            .addClass('modal-content')
            .attr('id', ModalHelper.modal_content_selector);

        {
            const header = UIHelper.createElement('div')
                .addClass('modal-header')
                .attr('id', ModalHelper.modal_header_selector);

            UIHelper.createElement('h5')
                .addClass('modal-title')
                .attr('id', ModalHelper.modal_title_selector)
                .appendTo(header);

            UIHelper.createAwesomeButton('xmark', {
                attributes: [
                    ['aria-hidden', 'true'],
                    ['id', ModalHelper.modal_close_button_selector
                    ],
                    ['data-dismiss', 'modal'],
                    ['aria-label', 'Close']
                ]
            }).addClass('btn-danger close')
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

        modal.appendTo($(document.body));

        $(`#${this.modal_selector}`).on('hidden.bs.modal', () => {
            this._isOpen = false;
        }).on('shown.bs.modal', () => {
            this._isOpen = true;
        });
    }
}

export { ModalHelper };
