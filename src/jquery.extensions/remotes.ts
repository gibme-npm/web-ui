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

import type { Remotes } from '../types';

declare global {
    interface JQueryStatic {
        /**
         * Retrieves information regarding the public IP address supplied
         * If no address is supplied, will return information regarding
         * the client's public address
         *
         * @param address
         */
        ipInfo(address?: string): Promise<Remotes.Results.IPInfo | undefined>;

        /**
         * Retrieves information regarding the US zip code supplied if such information is available
         *
         * @param zipCode
         */
        zipInfo(zipCode: string): Promise<Remotes.Results.ZipInfo | undefined>;
    }
}

($ => {
    $.ipInfo = async (address?: string): Promise<Remotes.Results.IPInfo | undefined> => {
        const params = new URLSearchParams();
        params.set('ip', address || '');

        const response = await $.fetch(`https://ipinfo.hostmanager.workers.dev/?${params.toString()}`);

        if (!response.ok) return;

        const json: Remotes.Responses.IPInfo = await response.json();

        if (json.status !== 'success') return;

        const [as, ...name] = json.as.split(' ')
            .map(elem => elem.trim());

        const asn = parseInt(as.replace('AS', '')) || 0;

        const { query } = json;

        delete (json as any).status;
        delete (json as any).query;

        return {
            ...json,
            address: query,
            org: json.org.length !== 0 ? json.org : undefined,
            as: {
                asn,
                name: name.join(' ')
            }
        } as Remotes.Results.IPInfo;
    };

    $.zipInfo = async (zipCode: string): Promise<Remotes.Results.ZipInfo | undefined> => {
        const response = await $.fetch(`https://zip.hostmanager.workers.dev/${zipCode}`);

        if (!response.ok) return;

        const json: Remotes.Responses.ZipInfo = await response.json();

        if (json.error) return;

        delete (json as any).error;

        return json;
    };
})(window.$);

export {};
