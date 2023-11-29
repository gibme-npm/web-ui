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

import $ from 'jquery';
import 'gasparesganga-jquery-loading-overlay';
import EventEmitter from 'events';

/**
 * Represents Loading Overlay options
 */
export interface LoadingOverlayOptions {
    override: boolean;
    background: string;
    backgroundClass: string;
    image: string;
    imageAnimation: string;
    imageAutoResize: boolean;
    imageResizeFactor: number;
    imageColor: string;
    imageClass: string;
    imageOrder: number;
    fontawesome: string;
    fontawesomeAnimation: string;
    fontawesomeAutoResize: boolean;
    fontawesomeResizeFactor: number;
    fontawesomeColor: string;
    fontawesomeOrder: number;
    custom: string;
    customAnimation: string;
    customAnimationResize: boolean;
    customResizeFactor: number;
    customOrder: number;
    text: string;
    testAnimation: string;
    textAutoResize: boolean;
    textResizeFactor: number;
    textColor: string;
    textClass: string;
    textOrder: number;
    progress: boolean;
    progressAutoResize: boolean;
    progressResizeFactor: number;
    progressColor: string;
    progressClass: string;
    progressOrder: number;
    progressFixedPosition: string;
    progressSpeed: number;
    progressMin: number;
    progressMax: number;
    size: number;
    maxSize: number;
    minSize: number;
    direction: string;
    fade: [number | boolean, number | boolean];
    resizeInterval: number;
    zIndex: number;
}

/**
 * Loading Overlay events
 */
export type LoadingOverlayEvent = 'shown' | 'hidden';

/**
 * Overlay display helper
 */
export default abstract class LoadingOverlay {
    public static readonly zIndex = 2147483646;
    private static _open = false;
    private static _events = new EventEmitter();

    /**
     * Returns if the overlay is open
     */
    public static get isOpen (): boolean {
        return this._open;
    }

    /**
     * Adds an event listener to the loading overlay
     *
     * @param event
     * @param listener
     */
    public static on (event: LoadingOverlayEvent, listener: (...args: any[]) => void) {
        this._events.on(event, listener);
    }

    /**
     * Removes an event listener from the loading overlay
     *
     * @param event
     * @param listener
     */
    public static off (event: LoadingOverlayEvent, listener: (...args: any[]) => void) {
        this._events.off(event, listener);
    }

    /**
     * Adds a one-time event listener to the loading overlay
     *
     * @param event
     * @param listener
     */
    public static once (event: LoadingOverlayEvent, listener: (...args: any[]) => void) {
        this._events.once(event, listener);
    }

    /**
     * Hides the displayed overlay
     *
     * @param options
     * @param target
     */
    public static hide<Type extends HTMLElement = HTMLElement> (
        options: Partial<LoadingOverlayOptions> = {},
        target: JQuery<Type> = $(document.body) as any
    ) {
        options.zIndex ??= LoadingOverlay.zIndex;

        if (options.zIndex === Number.MAX_SAFE_INTEGER) {
            options.zIndex = Number.MAX_SAFE_INTEGER - 1;
        }

        target.LoadingOverlay('hide', options);

        this._open = true;

        this._events.emit('hidden');
    }

    /**
     * Updates the progress in the current overlay
     *
     * @param options
     * @param target
     */
    public static progress<Type extends HTMLElement = HTMLElement> (
        options: Partial<LoadingOverlayOptions> = {},
        target: JQuery<Type> = $(document.body) as any
    ) {
        options.zIndex ??= LoadingOverlay.zIndex;

        if (options.zIndex === Number.MAX_SAFE_INTEGER) {
            options.zIndex = Number.MAX_SAFE_INTEGER - 1;
        }

        target.LoadingOverlay('progress', options);
    }

    /**
     * Resizes the overlay
     *
     * @param options
     * @param target
     */
    public static resize<Type extends HTMLElement = HTMLElement> (
        options: Partial<LoadingOverlayOptions> = {},
        target: JQuery<Type> = $(document.body) as any
    ) {
        options.zIndex ??= LoadingOverlay.zIndex;

        if (options.zIndex === Number.MAX_SAFE_INTEGER) {
            options.zIndex = Number.MAX_SAFE_INTEGER - 1;
        }

        target.LoadingOverlay('resize', options);
    }

    /**
     * Shows an overlay with the specified options
     *
     * @param text
     * @param options
     * @param target
     */
    public static show<Type extends HTMLElement = HTMLElement> (
        text?: string,
        options: Partial<LoadingOverlayOptions & { timeout: number }> = {},
        target: JQuery<Type> = $(document.body) as any
    ) {
        options.text = text;
        options.zIndex ??= LoadingOverlay.zIndex;

        if (options.zIndex === Number.MAX_SAFE_INTEGER) {
            options.zIndex = Number.MAX_SAFE_INTEGER - 1;
        }

        target.LoadingOverlay('show', options);

        this._open = true;

        this._events.emit('shown');

        if (options.timeout) {
            setTimeout(() => LoadingOverlay.hide(options, target), options.timeout);
        }
    }

    /**
     * Updates the text in the current overlay
     *
     * @param text
     * @param target
     */
    public static text<Type extends HTMLElement = HTMLElement> (
        text: string,
        target: JQuery<Type> = $(document.body) as any
    ) {
        target.LoadingOverlay('text', text as any);
    }
}

export { LoadingOverlay };
