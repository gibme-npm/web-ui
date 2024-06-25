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

/**
 * Hooks the DOM load/ready event so that we can run things before the event fires
 *
 * @param func
 */
const hook_dom_load = (func: () => Promise<void>): void => {
    (async ($) => {
        /**
         * First up, we grab the jQuery.ready event and stick it in a temporary
         * location. This prevents the ready event from firing functions that
         * may be defined BEFORE our third-party libraries are loaded from the
         * CDNs
         */
        const originalReady = $.fn.ready;
        let preReadyHandlers: any[] = [];

        $.fn.ready = function (fn) {
            preReadyHandlers.push(fn);
            return this;
        };

        await func();

        /**
         * Now that we are ready, we'll call our existing jQuery.ready handlers
         * that we saved off into the temporary location
         */
        for (let i = 0; i < preReadyHandlers.length; i++) {
            preReadyHandlers[i].call($);
        }

        /**
         * Put the standard jQuery.ready method back into place and
         * clear our temporary holding of the events we moved out of the way
         */
        $.fn.ready = originalReady;
        preReadyHandlers = [];
    })(jQuery);
};

export default hook_dom_load;
