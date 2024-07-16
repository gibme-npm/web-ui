// Copyright (c) 2024, Brandon Lehmann <brandonlehmann@gmail.com>
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
import { Overlay as Types } from '../types';
import type { Timer } from '@gibme/timer';

export { Types };

export default abstract class Overlay {
    private static instances = new Map<string, { id: string, options: Partial<Types.OverlayOptions> }>();
    private static resize_timers = new Map<string, Timer>();

    /**
     * Returns if the overlay is currently open for the specified element
     *
     * @param parent
     */
    public static isOpen (parent: JQuery<HTMLElement> | string): boolean {
        if (typeof parent === 'string') {
            return $(`#${parent}`).length !== 0;
        } else {
            return Overlay.instances.has(parent.id());
        }
    }

    /**
     * Handles our actions against the parent
     *
     * @param parent
     * @param action
     * @param options
     */
    public static handle (
        parent: JQuery<HTMLElement>,
        action: Types.Action,
        options: Types.Options = {}
    ): JQuery {
        const { id } = Overlay.instances.get(parent.id()) || { id: $.uuid() };

        if (action === 'text' && typeof options === 'string') {
            options = Overlay.merge_options(parent.id(), id,
                { text: { message: options } });

            return Overlay.text(parent, id, options);
        } else if (action === 'progress' && typeof options === 'number') {
            options = Overlay.merge_options(parent.id(), id,
                { progress: { value: options } });

            return Overlay.progress(parent, id, options);
        } else if (action === 'text' && typeof options === 'object' && (options as JQuery<HTMLElement>).jquery) {
            options = Overlay.merge_options(parent.id(), id,
                { text: { message: options as JQuery<HTMLElement> } });

            return Overlay.text(parent, id, options);
        } else if (action === 'icon' && typeof options === 'object') {
            options = Overlay.merge_options(parent.id(), id,
                { icon: options as Partial<Types.FontAwesomeOptions> });

            return Overlay.icon(parent, id, options);
        } else if (action === 'image' && typeof options === 'object') {
            options = Overlay.merge_options(parent.id(), id,
                { image: options as Partial<Types.ImageOptions> });

            return Overlay.image(parent, id, options);
        } else {
            options = Types.mergeOptions(options as Partial<Types.OverlayOptions>);
            options = Overlay.merge_options(parent.id(), id, options as Partial<Types.OverlayOptions>);

            switch (action) {
                case 'show':
                    return Overlay.show(parent, id, options);
                case 'hide':
                    return Overlay.hide(parent, id, options);
                case 'text':
                    return Overlay.text(parent, id, options);
                case 'resize':
                    return Overlay.resize(parent, id, options);
                case 'progress':
                    return Overlay.progress(parent, id, options);
                case 'icon':
                    return Overlay.icon(parent, id, options);
                case 'image':
                    return Overlay.image(parent, id, options);
                default:
                    throw new Error('invalid action specified');
            }
        }
    }

    /**
     * Font size helper for a few sizes
     *
     * @param overlay
     * @param resizeFactor
     * @protected
     */
    private static calculate_size (overlay: JQuery<HTMLElement>, resizeFactor: number = 1) {
        const height = overlay.height() || overlay.parent().height();
        if (!height) return '1em';
        return `${Math.floor(height * resizeFactor)}px`;
    }

    /**
     * Shows the overlay
     *
     * @param parent
     * @param id
     * @param options
     * @protected
     */
    private static show (
        parent: JQuery<HTMLElement>,
        id: string,
        options: Partial<Types.OverlayOptions> = {}
    ): JQuery {
        if (Overlay.isOpen(id)) return parent;

        const overlay = (() => {
            const timer = Overlay.resize_timers.get(id) ||
                $.timer(options.resizeInterval || 50, false);

            const overlay = $('<div>')
                .attr('id', id)
                .hide()
                .appendTo(parent);

            timer.on('tick', () =>
                Overlay.auto_resize(parent, id, Overlay.instances.get(parent.id())?.options));

            timer.start();

            Overlay.resize_timers.set(id, timer);

            return overlay.hide();
        })().removeAttr('class')
            .addClass('d-flex w-100 h-100 position-absolute top-0 start-0 d-none')
            .empty();

        if (options.background?.color) overlay.css('background-color', options.background.color);
        if (options.background?.className) overlay.addClass(options.background.className);

        $('<div>')
            .addClass('d-flex flex-grow-1')
            .attr('id', `${id}.flex`)
            .append($('<div>')
                .attr('id', `${id}-container`)
                .addClass('d-flex flex-column w-100 justify-content-center align-items-center'))
            .appendTo(overlay);

        const container = $(`#${id}-container`);

        const fields = ['text', 'icon', 'image', 'progress'];

        for (const field of fields) {
            const element = $('<div>')
                .attr('id', `${id}-container-${field}`)
                .addClass('m-3')
                .hide()
                .appendTo(container);

            switch (field) {
                case 'text':
                    if (options.text) Overlay.text(parent, id, options);
                    break;
                case 'icon':
                    if (options.icon) Overlay.icon(parent, id, options);
                    break;
                case 'image':
                    if (options.image) Overlay.image(parent, id, options);
                    break;
                case 'progress':
                    $('<div>')
                        .attr('id', `${id}-container-${field}-bar`)
                        .addClass('progress-bar')
                        .appendTo(element);
                    if (options.progress) Overlay.progress(parent, id, options);
                    break;
            }
        }

        const fade = typeof options.fade === 'object' && options.fade.out ? options.fade.out : false;

        overlay.hide().removeClass('d-none');

        parent.addClass('overflow-hidden')
            .trigger('overlay.show');

        if (typeof fade === 'number') {
            overlay.fadeIn(fade, () => {
                parent.trigger('overlay.shown');
                if (options.timeout) setTimeout(() => Overlay.hide(parent, id), options.timeout);
            });
        } else if (fade) {
            overlay.fadeIn(400, () => {
                parent.trigger('overlay.shown');
                if (options.timeout) setTimeout(() => Overlay.hide(parent, id), options.timeout);
            });
        } else {
            overlay.show(() => {
                parent.trigger('overlay.shown');
                if (options.timeout) setTimeout(() => Overlay.hide(parent, id), options.timeout);
            });
        }

        return parent;
    }

    /**
     * Hides the overlay
     *
     * @param parent
     * @param id
     * @param options
     * @protected
     */
    private static hide (
        parent: JQuery<HTMLElement>,
        id: string,
        options: Partial<Types.OverlayOptions> = {}
    ): JQuery {
        if (!Overlay.isOpen(id)) return parent;

        const overlay = $(`#${id}`, parent);

        const fade = typeof options.fade === 'object' && options.fade.out ? options.fade.out : false;

        parent.trigger('hide');

        if (typeof fade === 'number') {
            overlay.fadeOut(fade, () => {
                overlay.hide().addClass('d-none');
                parent.removeClass('overflow-hidden')
                    .trigger('overlay.hidden');
            });
        } else if (fade) {
            overlay.fadeOut(400, () => {
                overlay.hide().addClass('d-none');
                parent.removeClass('overflow-hidden')
                    .trigger('overlay.hidden');
            });
        } else {
            overlay.hide(() => {
                overlay.addClass('d-none');
                parent.removeClass('overflow-hidden')
                    .trigger('overlay.hidden');
            });
        }

        Overlay.instances.delete(parent.id());
        Overlay.resize_timers.delete(id);
        overlay.remove();

        return parent;
    }

    /**
     * Updates the progress bar in the overlay
     *
     * @param parent
     * @param id
     * @param options
     * @protected
     */
    private static progress (
        parent: JQuery<HTMLElement>,
        id: string,
        options: Partial<Types.OverlayOptions> = {}
    ): JQuery {
        if (!Overlay.isOpen(id)) return parent;

        const overlay = $(`#${id}`, parent);

        if (!options.progress) return parent;

        const order = Overlay.adjust_order(4, options.progress.order);

        $(`#${id}-container-progress`, overlay)
            .removeClass('order-0 order-1 order-2 order-3 order-4 order-5')
            .addClass(`order-${order} progress w-75`)
            .css('height', '25px')
            .attr('role', 'progressbar');

        const progress_bar = $(`#${id}-container-progress-bar`, overlay);

        if (options.progress.color) progress_bar.css('background-color', options.progress.color);
        if (options.progress.className) progress_bar.addClass(options.progress.className);
        if (options.progress.animated) {
            progress_bar.addClass('progress-bar-animated progress-bar-striped');
        } else {
            progress_bar.removeClass('progress-bar-animated progress-bar-striped');
        }

        progress_bar.attr('aria-valuemin', options.progress.min || 0)
            .attr('aria-valuemax', options.progress.max || 100);

        if (typeof options.progress.value === 'undefined') {
            progress_bar.attr('aria-valuenow', 0)
                .parent().hide();
        } else {
            let value = Math.round(options.progress.value / (options.progress.max || 100) * 100);
            if (value > 100) value = 100;

            progress_bar
                .css('width', `${value}%`)
                .attr('aria-valuenow', value)
                .parent()
                .show();

            parent.trigger('overlay.progress', value);
        }

        return parent;
    }

    /**
     * Performs a resize of elements in the overlay
     *
     * @param parent
     * @param id
     * @param options
     * @protected
     */
    private static resize (
        parent: JQuery<HTMLElement>,
        id: string,
        options: Partial<Types.OverlayOptions> = {}
    ): JQuery {
        if (!Overlay.isOpen(id)) return parent;

        const overlay = $(`#${id}`, parent);

        $(`#${id}-container-text`, overlay)
            .css('font-size', Overlay.calculate_size(overlay, options.text?.resizeFactor));

        $(`#${id}-container-icon-element`, overlay)
            .css('font-size', Overlay.calculate_size(overlay, options.icon?.resizeFactor));

        {
            const size = Overlay.calculate_size(overlay, options.image?.resizeFactor);

            $(`#${id}-container-image-element`, overlay)
                .css('width', size)
                .css('height', size);
        }

        $(`#${id}-container-progress`, overlay)
            .css('height', Overlay.calculate_size(overlay, options.progress?.resizeFactor));

        parent.trigger('overlay.resize');

        return parent;
    }

    /**
     * Performs a resize if the property is set to autoreset for that object
     *
     * @param parent
     * @param id
     * @param options
     * @protected
     */
    private static auto_resize (
        parent: JQuery<HTMLElement>,
        id: string,
        options: Partial<Types.OverlayOptions> = {}
    ): JQuery<HTMLElement> {
        if (!Overlay.isOpen(id)) return parent;

        const overlay = $(`#${id}`, parent);

        if (options.text?.autoResize) {
            $(`#${id}-container-text`, overlay)
                .css('font-size', Overlay.calculate_size(overlay, options.text?.resizeFactor));
        }

        if (options.icon?.autoResize) {
            $(`#${id}-container-icon-element`, overlay)
                .css('font-size', Overlay.calculate_size(overlay, options.icon?.resizeFactor));
        }

        if (options.image?.autoResize) {
            const size = Overlay.calculate_size(overlay, options.image?.resizeFactor);

            $(`#${id}-container-image-element`, overlay)
                .css('width', size)
                .css('height', size);
        }

        if (options.progress?.autoResize) {
            $(`#${id}-container-progress`, overlay)
                .css('height', Overlay.calculate_size(overlay, options.progress?.resizeFactor));
        }

        parent.trigger('overlay.resize');

        return parent;
    }

    /**
     * Updates the text in the overlay
     *
     * @param parent
     * @param id
     * @param options
     * @protected
     */
    private static text (
        parent: JQuery<HTMLElement>,
        id: string,
        options: Partial<Types.OverlayOptions> = {}
    ): JQuery {
        if (!Overlay.isOpen(id)) return parent;

        const overlay = $(`#${id}`, parent);

        const text = $(`#${id}-container-text`, overlay);

        if (!options.text) return parent;

        const order = Overlay.adjust_order(1, options.text.order);

        text.removeClass('order-0 order-1 order-2 order-3 order-4 order-5')
            .addClass(`order-${order}`);

        if (options.text.color) text.css('color', options.text.color);
        if (options.text.className) text.addClass(options.text.className);

        text.css('font-size', Overlay.calculate_size(overlay, options.text.resizeFactor));

        if (typeof options.text.message === 'undefined' || options.text.message.length === 0) {
            text.hide().empty();
        } else {
            if (typeof options.text.message === 'string') {
                text.text(options.text.message).show();
            } else {
                text.empty().append(options.text.message).show();
            }

            parent.trigger('overlay.text', options.text.message);
        }

        return parent;
    }

    /**
     * Updates the image in the overlay
     *
     * @param parent
     * @param id
     * @param options
     * @private
     */
    private static image (
        parent: JQuery<HTMLElement>,
        id: string,
        options: Partial<Types.OverlayOptions> = {}
    ): JQuery {
        if (!Overlay.isOpen(id)) return parent;

        const overlay = $(`#${id}`, parent);

        const image = $(`#${id}-container-image`, overlay);

        if (!options.image) return parent;

        const order = Overlay.adjust_order(3, options.image.order);

        image.removeClass('order-0 order-1 order-2 order-3 order-4 order-5')
            .addClass(`order-${order}`);

        if (options.image.hide) {
            image.hide();

            parent.trigger('overlay.image', options.image);
        } else {
            if (options.image.source) {
                const img = options.image.source.startsWith('<svg')
                    ? $(options.image.source)
                    : $(`<img src="${options.image.source}" alt="Overlay Icon Image">`);

                img.attr('id', `${id}-container-image-element`);

                if (options.image.width) img.css('width', options.image.width);
                if (options.image.height) img.css('height', options.image.height);
                if (options.image.rotation && options.image.rotation !== 'none') {
                    img.addClass(`fa-${options.image.rotation}`);
                }
                if (options.image.animation && options.image.animation !== 'none') {
                    if (options.image.animation === 'spin-reverse') {
                        img.addClass('fa-spin fa-spin-reverse');
                    } else {
                        img.addClass(`fa-${options.image.animation}`);
                    }
                }

                image.empty().append(img).show();

                parent.trigger('overlay.image', options.icon);
            }
        }

        return parent;
    }

    /**
     * Updates the icon in the overlay
     *
     * @param parent
     * @param id
     * @param options
     * @protected
     */
    private static icon (
        parent: JQuery<HTMLElement>,
        id: string,
        options: Partial<Types.OverlayOptions> = {}
    ): JQuery {
        if (!Overlay.isOpen(id)) return parent;

        const overlay = $(`#${id}`, parent);

        const icon = $(`#${id}-container-icon`, overlay);

        if (!options.icon) return parent;

        const order = Overlay.adjust_order(2, options.icon.order);

        icon.removeClass('order-0 order-1 order-2 order-3 order-4 order-5')
            .addClass(`order-${order}`);

        if (options.icon.hide) {
            icon.hide();

            parent.trigger('overlay.icon', options.icon);
        } else {
            if (options.icon.name) {
                icon.empty()
                    .append($.createAwesomeIcon(options.icon.name,
                        {
                            ...options.icon,
                            attributes: [...options.icon.attributes || [], ['id', `${id}-container-icon-element`]]
                        })
                        .css('font-size', Overlay.calculate_size(overlay, options.icon.resizeFactor))
                    )
                    .show();

                parent.trigger('overlay.icon', options.icon);
            }
        }

        return parent;
    }

    /**
     * Adjusts the order to fit within the bootstrap range of pre-defined orders
     *
     * @param default_value
     * @param order
     * @private
     */
    private static adjust_order (default_value: number, order?: number): number {
        if (!order) return default_value;

        if (order < 0) return 0;
        if (order > 5) return 5;
        return order;
    }

    /**
     * Merges "new" options with cached options and updates the cache
     *
     * @param parent_path
     * @param id
     * @param new_options
     * @private
     */
    private static merge_options (
        parent_path: string,
        id: string,
        new_options: Partial<Types.OverlayOptions>
    ): Partial<Types.OverlayOptions> {
        const {
            options: _options
        } = Overlay.instances.get(parent_path) || { options: new_options };

        const options = Types.mergeOptions(new_options, _options);

        Overlay.instances.set(parent_path, { id, options });

        return options;
    }
}
