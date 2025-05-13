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

import type { AsyncTimer, SyncTimer, Timer } from '@gibme/timer';
import { version, JSDELIVR } from '../helpers/cdn';

declare global {
    interface JQueryStatic {
        /**
         * A helper class that performs an async function at the given interval and emits the result on a regular basis
         *
         * @param func
         * @param interval
         * @param autoStart
         */
        asyncTimer<T = any>(func: () => Promise<T>, interval: number, autoStart?: boolean): AsyncTimer;

        /**
         * A helper class that performs a sync function at the given interval and emits the result on a regular basis
         *
         * @param func
         * @param interval
         * @param autoStart
         */
        syncTimer<T = any>(func: () => T, interval: number, autoStart?: boolean): SyncTimer;

        /**
         * Creates a new timer instance
         *
         * @param interval
         * @param autostart
         * @param args are emitted with each tick event
         */
        timer(interval: number, autostart?: boolean, ...args: any[]): Timer;
    }

    interface Window {
        AsyncTimer: typeof AsyncTimer;
        SyncTimer: typeof SyncTimer;
        Timer: typeof Timer;
    }
}

($ => {
    const setup = () => {
        $.asyncTimer = <T = any>(
            func: () => Promise<T>,
            interval: number,
            autoStart = false
        ): AsyncTimer => new window.AsyncTimer(func, interval, autoStart);

        $.syncTimer = <T = any>(
            func: () => T,
            interval: number,
            autoStart = false
        ): SyncTimer => new window.SyncTimer(func, interval, autoStart);

        $.timer = (interval: number, autoStart = false): Timer => new window.Timer(interval, autoStart);
    };

    if (typeof window.AsyncTimer === 'undefined' ||
        typeof window.SyncTimer === 'undefined' ||
        typeof window.Timer === 'undefined'
    ) {
        $.getScript({
            url: `${JSDELIVR}/@gibme/timer@${version('@gibme/timer')}/dist/timer.min.js`,
            cache: true,
            success: () => setup()
        });
    } else {
        setup();
    }
})(window.$);

export {};
