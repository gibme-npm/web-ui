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

import $ from 'jquery';
import Timer, { AsyncTimer, SyncTimer } from '@gibme/timer';

declare global {
    interface JQueryStatic {
        /**
         * A helper class that performs an async function at the given interval and emits the result on a regular basis
         *
         * @param func
         * @param interval
         * @param autoStart
         */
        asyncTimer<Type = any>(func: () => Promise<Type>, interval: number, autoStart?: boolean): AsyncTimer;

        /**
         * A helper class that performs a sync function at the given interval and emits the result on a regular basis
         *
         * @param func
         * @param interval
         * @param autoStart
         */
        syncTimer<Type = any>(func: () => Type, interval: number, autoStart?: boolean): SyncTimer;

        /**
         * Creates a new timer instance
         *
         * @param interval
         * @param autostart
         * @param args
         */
        timer(interval: number, autostart?: boolean, ...args: any[]): Timer;
    }
}

$.asyncTimer = function <Type = any> (
    func: () => Promise<Type>,
    interval: number,
    autoStart = false
): AsyncTimer {
    return new AsyncTimer<Type>(func, interval, autoStart);
};

$.syncTimer = function <Type = any> (
    func: () => Type,
    interval: number,
    autoStart = false
): SyncTimer {
    return new SyncTimer<Type>(func, interval, autoStart);
};

$.timer = function (interval: number, autostart = false, ...args: any[]): Timer {
    return new Timer(interval, autostart, ...args);
};
