// Copyright (c) 2011, Jon Leighton
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

// pre-compute hex characters
const hexBytes: string[] = (() => {
    const tmp: string[] = [];

    for (let i = 0; i <= 0xff; ++i) {
        tmp.push(i.toString(16).padStart(2, '0'));
    }

    return tmp;
})();

function arrayBufferToHex (buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);

    const hex: string[] = [];

    bytes.forEach(byte => hex.push(hexBytes[byte]));

    return hex.join('');
}

function arrayBufferToBase64 (buffer: ArrayBuffer) {
    let base64 = '';
    const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const bytes = new Uint8Array(buffer);
    const byteLength = bytes.byteLength;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;

    let a: number, b: number, c: number, d: number, chunk: number;

    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048 = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032 = (2^6 - 1) << 6
        d = chunk & 63; // 63 = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder === 1) {
        chunk = bytes[mainLength];
        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1
        base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder === 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }

    return base64;
}

function arrayBufferToString (buffer: ArrayBuffer) {
    let utf8 = '';
    let bytes = new Uint8Array(buffer);

    // we need to not exceed the 30k byte limit in the call stack
    do {
        const tmp = bytes.slice(0, 30000);
        bytes = bytes.slice(30000);

        utf8 += String.fromCharCode.apply(null, tmp as any);
    } while (bytes.byteLength > 0);

    return utf8;
}

export class Buffer {
    // eslint-disable-next-line no-useless-constructor
    protected constructor (public readonly raw: ArrayBuffer, public readonly type?: string) {}

    /**
     * Creates a new instance of a `Buffer` from an ArrayBuffer
     *
     * @param buffer
     * @param type the mime-type if known
     */
    public static from (buffer: ArrayBuffer, type?: string): Buffer {
        return new Buffer(buffer, type);
    }

    /**
     * Dumps the `Buffer` as a string using the specified encoding type
     *
     * @param encoding
     */
    public toString (encoding: 'utf8' | 'base64' | 'inline-base64' | 'hex' = 'utf8'): string {
        if (encoding === 'utf8') {
            return arrayBufferToString(this.raw);
        } else if (encoding === 'hex') {
            return arrayBufferToHex(this.raw);
        } else if (encoding === 'inline-base64') {
            return `data:${this.type};base64,${arrayBufferToBase64(this.raw)}`;
        } else {
            return arrayBufferToBase64(this.raw);
        }
    }
}
