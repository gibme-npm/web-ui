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

import type { Overlay } from '@gibme/overlay';
import { version, JSDELIVR, loadScript } from '../helpers/cdn';

declare global {
    interface JQuery {
        /**
         * Returns if the overlay for is open
         */
        isOverlayOpen(): boolean;

        /**
         * Displays an overlay over the element
         *
         * @param action
         * @param options
         */
        overlay(action: Overlay.Action, options?: Partial<Overlay.Options>): JQuery;
    }

    interface JQueryStatic {
        /**
         * Returns if the overlay for is open
         */
        isOverlayOpen(): boolean;

        /**
         * Displays an overlay over the element
         *
         * @param action
         * @param options
         */
        overlay(action: Overlay.Action, options?: Partial<Overlay.Options>): JQuery;
    }

    interface Window {
        Overlay: typeof Overlay;
    }
}

($ => {
    (async () => {
        await loadScript(window.Overlay,
            `${JSDELIVR}/@gibme/overlay@${version('@gibme/overlay')}/dist/Overlay.min.js`);

        $.fn.isOverlayOpen = function (): boolean {
            return window.Overlay.isOpen($(this));
        };

        $.fn.overlay = function (action: Overlay.Action, options: Partial<Overlay.Options> = {}): JQuery {
            return window.Overlay.handle($(this), action, options);
        };

        $.isOverlayOpen = (): boolean => {
            return $(document.body).isOverlayOpen();
        };

        $.overlay = (action: Overlay.Action, options: Partial<Overlay.Options> = {}): JQuery => {
            return $(document.body).overlay(action, options);
        };
    })();
})(window.$);

export {};
