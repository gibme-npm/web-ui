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
    binaryType?: 'arraybuffer' | 'blob';
}

/**
 * Class that shims around a browser supplied WebSocket object to
 * make it more like a 'standard' EventEmitter and more of what we
 * are used to using
 */
export default class WebSocketClient extends EventEmitter {
    private socket?: WebSocket;

    /**
     * Constructs a new instances of the class
     * @param options
     */
    constructor (private readonly options: WebSocketClientOptions) {
        super();

        this.options.binaryType ??= 'arraybuffer';
    }

    /**
     * Returns the underlying WebSocket's binary type
     */
    public get binaryType (): 'arraybuffer' | 'blob' {
        return this.socket?.binaryType || 'arraybuffer';
    }

    /**
     * Sets the underlying WebSocket's binary type
     *
     * @param value
     */
    public set binaryType (value: 'arraybuffer' | 'blob') {
        if (this.socket) {
            this.socket.binaryType = value;
        }
    }

    /**
     * Returns the amount of data buffered by the underlying WebSocket
     */
    public get bufferedAmount (): number {
        return this.socket?.bufferedAmount || 0;
    }

    /**
     * Returns any extensions currently enabled in the underlying WebSocket
     */
    public get extensions (): string {
        return this.socket?.extensions || '';
    }

    /**
     * Returns the underlying WebSocket protocol
     */
    public get protocol (): string {
        return this.socket?.protocol || '';
    }

    /**
     * Returns the underlying WebSocket's ready state
     */
    public get readyState (): WebSocketReadyState {
        return this.socket?.readyState || 3;
    }

    /**
     * Returns the underlying WebSocket's remote URL
     */
    public get url (): string {
        return this.socket?.url || '';
    }

    /**
     * Emitted when the underlying WebSocket is closed
     *
     * @param event
     * @param listener
     */
    public on(event: 'close', listener: () => void): this;

    /**
     * Emitted when the underlying WebSocket encounters an error
     *
     * @param event
     * @param listener
     */
    public on(event: 'error', listener: (error: Error) => void): this;

    /**
     * Emitted when the underlying WebSocket receives a message
     *
     * @param event
     * @param listener
     */
    public on(event: 'message', listener: (message: Buffer) => void): this;

    /**
     * Emitted when the underlying WebSocket is opened
     *
     * @param event
     * @param listener
     */
    public on(event: 'open', listener: () => void): this;

    public on (event: any, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    /**
     * Attempts to connect the underlying WebSocket to the remote URL
     *
     * This method also allows us to re-use the class instance, so we do not have
     * to recreate it if we need to 'reconnect' the WebSocket late
     */
    public connect () {
        this.socket = new WebSocket(this.options.url, this.options.protocols);

        this.binaryType = this.options.binaryType || 'arraybuffer';

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

    /**
     * Closes the underlying WebSocket
     *
     * @param code
     * @param reason
     */
    public close (code?: number, reason?: string) {
        this.socket?.close(code, reason);
    }

    /**
     * Sends the specified data via the underlying WebSocket
     *
     * @param data
     */
    public send (data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        this.socket?.send(data);
    }
}
