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

type Event = string;
type Listener = (...args: any[]) => void | Promise<void>;

/**
 * A simple EventEmitter shim that provides only the basics
 */
export class EventEmitter {
    private readonly events: Record<Event, Listener[]> = {};

    public emit (event: Event, ...args: any[]): boolean {
        if (this.events[event]) {
            this.events[event].forEach(listener =>
                listener.apply(this, args));

            return true;
        }

        return false;
    }

    public on (event: Event, listener: Listener): EventEmitter {
        if (!this.events[event]) this.events[event] = [];

        this.events[event].push(listener);

        return this;
    }

    public off (event: Event, listener: Listener): EventEmitter {
        if (!this.events[event]) return this;

        this.events[event] = this.events[event].filter(check => check !== listener);

        return this;
    }

    public once (event: Event, listener: Listener): EventEmitter {
        const wrapper = (...args: any[]) => {
            listener.apply(this, args);
            this.off(event, wrapper);
        };

        this.on(event, wrapper);

        return this;
    }
}
