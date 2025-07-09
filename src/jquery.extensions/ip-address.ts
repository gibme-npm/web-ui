// Copyright (c) 2025, Brandon Lehmann <brandonlehmann@gmail.com>
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

import type { Address4, Address6, v4 } from '@gibme/ip-address';
import { version, JSDELIVR } from '../helpers/cdn';

declare global {
    interface JQueryStatic {
        /**
         * Returns whether the specified v4 IP address is valid
         * @param address
         */
        address4isValid(address: string): boolean;

        /**
         * Creates a new Address4 instance
         * @param address
         */
        address4(address: string): Address4;

        /**
         * Returns whether the specified v6 IP address is valid
         * @param address
         */
        address6isValid(address: string): boolean;

        /**
         * Creates a new Address6 instance
         * @param address
         */
        address6(address: string): Address6;

        /**
         * Converts an IP v4 mask length into a dotted decimal subnet mask
         * @param length
         */
        maskLengthToSubnetMask(length: number): string;

        /**
         * Converts a dotted decimal subnet mask into a CIDR mask length
         * @param mask
         */
        subnetMaskToMaskLength(mask: string): number;
    }

    interface Window {
        Address4: typeof Address4;
        Address6: typeof Address6;
        v4: typeof v4;
    }
}

($ => {
    const setup = () => {
        $.address4isValid = (address: string): boolean => window.Address4.isValid(address);

        $.address4 = (address: string): Address4 => new window.Address4(address);

        $.address6isValid = (address: string): boolean => window.Address6.isValid(address);

        $.address6 = (address: string): Address6 => new window.Address6(address);

        $.maskLengthToSubnetMask = (length: number): string => window.v4.helpers.maskLengthToSubnetMask(length);

        $.subnetMaskToMaskLength = (mask: string): number => window.v4.helpers.subnetMaskToMaskLength(mask);
    };

    if (typeof window.Address4 === 'undefined' ||
        typeof window.Address6 === 'undefined' ||
        typeof window.v4 === 'undefined') {
        $.getScript({
            url: `${JSDELIVR}/@gibme/ip-address@${version('@gibme/ip-address')}/dist/ip-address.min.js`,
            cache: true,
            success: () => setup()
        });
    } else {
        setup();
    }
})(window.$);

export {};
