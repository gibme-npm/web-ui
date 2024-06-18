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

import { EventEmitter } from 'events';

const WebSocket = global.WebSocket;

export enum WebSocketReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}

export interface WebSocketClientOptions {
    url: string;
    protocols?: string | string[];
    binaryType: 'arraybuffer' | 'blob';
}

export default class WebSocketClient extends EventEmitter {
    private socket?: WebSocket;

    constructor (private readonly options: WebSocketClientOptions) {
        super();

        this.options.binaryType ??= 'arraybuffer';
    }

    public on(event: 'close', listener: () => void): this;

    public on(event: 'error', listener: (error: Error) => void): this;

    public on(event: 'message', listener: (message: Buffer) => void): this;

    public on(event: 'open', listener: () => void): this;

    public on (event: any, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    public connect () {
        this.socket = new WebSocket(this.options.url, this.options.protocols);

        this.binaryType = this.options.binaryType;

        this.socket.addEventListener('close', () => this.emit('close'));
        this.socket.addEventListener('error', event =>
            this.emit('error', new Error(event.toString())));
        this.socket.addEventListener('message', event => {
            if (event.data instanceof ArrayBuffer) {
                return this.emit('message', Buffer.from(event.data));
            } else {
                return this.emit('message', Buffer.from(event.data));
            }
        });
        this.socket.addEventListener('open', () => this.emit('open'));
    }

    public close (code?: number, reason?: string) {
        this.socket?.close(code, reason);
    }

    public send (data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        this.socket?.send(data);
    }

    public get binaryType (): 'arraybuffer' | 'blob' {
        return this.socket?.binaryType || 'arraybuffer';
    }

    public set binaryType (value: 'arraybuffer' | 'blob') {
        if (this.socket) {
            this.socket.binaryType = value;
        }
    }

    public get bufferedAmount (): number {
        return this.socket?.bufferedAmount || 0;
    }

    public get extensions (): string {
        return this.socket?.extensions || '';
    }

    public get protocol (): string {
        return this.socket?.protocol || '';
    }

    public get readyState (): WebSocketReadyState {
        return this.socket?.readyState || 3;
    }

    public get url (): string {
        return this.socket?.url || '';
    }
}
