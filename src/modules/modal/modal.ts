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

import { EventEmitter } from '../eventemitter';
import type { ModalTypes } from './types';
import { nanoid } from 'nanoid';
export * from './types';

/** @ignore */
const $ = window.$;

export default abstract class Modal {
    private static _id?: string;
    private static readonly emitter = new EventEmitter();
    private static _open = false;

    // eslint-disable-next-line no-useless-constructor
    protected constructor () { }

    public static get id (): string {
        this._id ??= nanoid();

        return this._id;
    }

    /**
     * Constructs the modal elements if it does not exist already
     *
     * @param options
     * @private
     */
    private static constructIfNotExist (options: Partial<ModalTypes.Options> = {}) {
        if ($(`#${this.id}`).length === 0) {
            this.construct(options);
        }
    }

    /**
     * Construct the modal elements and add them to the document body
     *
     * @param options
     * @private
     */
    private static construct (options: Partial<ModalTypes.Options> = {}) {
        options.size ??= 'large';
        options.verticallyCentered ??= true;

        const { id } = this;

        $('<div>')
            .addClass('modal fade')
            .attr('id', id)
            .attr('tabindex', -1)
            .attr('role', 'dialog')
            .attr('aria-labelledby', `${id}-title`)
            .attr('aria-hidden', 'true')
            .append($('<div>')
                .addClass('modal-dialog')
                .attr('id', `${id}-dialog`)
                .attr('role', 'document')
                .append($('<div>')
                    .addClass('modal-content')
                    .attr('id', `${id}-content`)
                    .append($('<div>')
                        .addClass('modal-header container-fluid d-flex flex-row')
                        .attr('id', `${id}-header`)
                        .append($('<h5>')
                            .addClass('modal-title flex-grow-1')
                            .attr('id', `${id}-title`))
                        .append($.createAwesomeButton('xmark', {
                            attributes: {
                                'aria-hidden': true,
                                id: `${id}-close-button`,
                                'data-dismiss': 'modal',
                                'aria-label': 'Close'
                            }
                        }).addClass('btn-danger close').on('click', () => this.close())))
                    .append($('<div>')
                        .addClass('modal-body')
                        .attr('id', `${id}-body`))
                    .append($('<div>')
                        .addClass('modal-footer')
                        .attr('id', `${id}-footer`))))
            .appendTo($(document.body));

        // avoid jquery event handlers due to edge cases
        const element = $(`#${id}`)[0];
        if (element) {
            element.addEventListener('show.bs.modal', () => this.emitter.emit('show'));
            element.addEventListener('shown.bs.modal', () => {
                this._open = true;
                this.emitter.emit('shown');
            });
            element.addEventListener('hide.bs.modal', () => this.emitter.emit('hide'));
            element.addEventListener('hidden.bs.modal', () => {
                this._open = false;
                this.emitter.emit('hidden');
            });
        }
    }

    /**
     * Sets the modal dialog options
     *
     * @param options
     * @private
     */
    private static setDialogOptions (options: Partial<ModalTypes.Options> = {}) {
        const { dialog } = this;

        dialog
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
     * Displays the modal using the supplied options
     *
     * Note: If body, title, or footer are passed as JQuery<> elements the call is
     * non-destructive (i.e. the elements will be cloned and the ids changed to avoid
     * conflicts elsewhere)
     *
     * @param options
     * @private
     */
    private static display<
        BodyElement extends HTMLElement = HTMLElement,
        TitleElement extends HTMLElement = HTMLElement,
        FooterElement extends HTMLElement = HTMLElement
    > (options: Partial<ModalTypes.Options<BodyElement, TitleElement, FooterElement>> = {}): JQuery {
        options.title ??= 'New Message!';
        options.useDefaultCloseButton ??= true;
        options.size ??= 'large';
        options.verticallyCentered ??= true;

        if (!options.body) {
            throw new Error('Modal must have a body!');
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

        this.constructIfNotExist(options);
        this.setDialogOptions(options);

        const { id, close_button, header, title, body, footer, container } = this;

        if (options.useDefaultCloseButton) {
            close_button.removeClass('d-none');
        } else {
            close_button.addClass('d-none');
        }

        if (options.title?.length === 0 && !options.useDefaultCloseButton) {
            header.addClass('d-none');
        } else {
            header.removeClass('d-none');
        }

        // clear the title
        title.text('');
        if (typeof options.title === 'string') {
            title.text(options.title);
        } else {
            title.append(
                options.destructive
                    ? options.title
                    : options.title.clone()
                        .attr('id', `${id}-title-content`));
        }

        // clear the body
        body.empty();
        if (typeof options.body === 'string') {
            body.text(options.body);
        } else {
            body.append(
                options.destructive
                    ? options.body
                    : options.body.clone()
                        .attr('id', `${id}-body-content`));
        }

        // clear the footer
        footer.empty();
        if (options.footer) {
            if (typeof options.footer === 'string') {
                footer.text(options.footer);
            } else {
                footer.append(
                    options.destructive
                        ? options.footer
                        : options.footer.clone()
                            .attr('id', `${id}-footer-content`));
            }
            footer.removeClass('d-none');
        } else {
            footer.addClass('d-none');
        }

        if (options.timeout) {
            setTimeout(() => this.close(), options.timeout);
        }

        return container.modal('show');
    }

    /**
     * Adds an event listener to the modal
     *
     * @param event
     * @param listener
     */
    public static on (event: ModalTypes.Event, listener: (...args: any[]) => void) {
        this.emitter.on(event, listener);
    }

    /**
     * Removes an event listener from the modal
     *
     * @param event
     * @param listener
     */
    public static off (event: ModalTypes.Event, listener: (...args: any[]) => void) {
        this.emitter.off(event, listener);
    }

    /**
     * Adds a one-time event listener to the modal
     *
     * @param event
     * @param listener
     */
    public static once (event: ModalTypes.Event, listener: (...args: any[]) => void) {
        this.emitter.once(event, listener);
    }

    /**
     * Returns if the modal is open
     */
    public static get isOpen (): boolean {
        return this._open;
    }

    /**
     * Returns the modal element
     */
    public static get container (): JQuery<HTMLElement> {
        this.constructIfNotExist();

        return $(`#${this.id}`);
    }

    /**
     * Returns the modal dialog element
     *
     * @private
     */
    public static get dialog (): JQuery<HTMLElement> {
        this.constructIfNotExist();

        return $(`#${this.id}-dialog`);
    }

    /**
     * Returns the modal header element
     */
    public static get header (): JQuery<HTMLElement> {
        this.constructIfNotExist();

        return $(`#${this.id}-header`);
    }

    /**
     * Returns the modal title element
     */
    public static get title (): JQuery<HTMLElement> {
        this.constructIfNotExist();

        return $(`#${this.id}-title`);
    }

    /**
     * Returns the modal close button element
     */
    public static get close_button (): JQuery<HTMLElement> {
        this.constructIfNotExist();

        return $(`#${this.id}-close-button`);
    }

    /**
     * Returns the modal body element
     */
    public static get body (): JQuery<HTMLElement> {
        this.constructIfNotExist();

        return $(`#${this.id}-body`);
    }

    /**
     * Returns the modal footer element
     */
    public static get footer (): JQuery<HTMLElement> {
        this.constructIfNotExist();

        return $(`#${this.id}-footer`);
    }

    /**
     * Allows for selecting an element within the modal itself
     *
     * @param selector
     */
    public static select<T extends HTMLElement = HTMLElement> (selector: JQuery.Selector): JQuery<T> {
        this.constructIfNotExist();

        return $(selector, this.container);
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
    > (options: Partial<ModalTypes.Options<BodyElement, TitleElement, FooterElement>> = {}): JQuery {
        if (!this.isOpen) {
            return this.display<BodyElement, TitleElement, FooterElement>(options);
        }

        this.once('hidden', () => {
            this.display<BodyElement, TitleElement, FooterElement>(options);
        });

        this.close();

        return this.container;
    }

    /**
     * Closes the modal
     *
     * Note: can be called even if the modal is not open
     */
    public static close () {
        this.constructIfNotExist();

        this.container.modal('hide').remove();
    }
}

export { Modal };
