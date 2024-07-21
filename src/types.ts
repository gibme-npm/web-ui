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

export namespace HTML {
    export namespace Input {
        /**
         * HTML Input Option Set
         */
        export interface Options {
            type: 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file'
                | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search'
                | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week';
            class: string;
            id: string;
            label: string | JQuery<HTMLElement>
            input: JQuery<HTMLElement>
            readonly: boolean;
            disabled: boolean;

            [key: string]: string | number | JQuery<HTMLElement> | boolean | undefined;
        }
    }

    export namespace Video {
        /**
         * Video element creation options
         */
        export interface Options {
            autoplay: boolean;
            controls: boolean;
            loop: boolean;
            muted: boolean;
            playsinline: boolean;

            [key: string]: boolean;
        }
    }
}

export namespace Google {
    export namespace Charts {
        /**
         * The Google Charts loader options
         */
        export interface Options {
            /**
             * The chart packages to load; defaults to `corechart` only
             *
             * See: https://developers.google.com/chart/interactive/docs/gallery
             */
            packages: string[];
            /**
             * Ther charts version to load
             */
            version: string | number;
        }
    }

    export namespace Fonts {
        export type DisplayType = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    }

    export namespace Maps {
        /**
         * Extends the google.maps.MapOptions interface to include loader options
         */
        export interface Options extends google.maps.MapOptions {
            version: string | number;
            libraries: string[];
            language: string;
            region: string;
        }
    }
}

export namespace Remotes {
    export namespace Responses {
        export interface IPInfo {
            status: 'success' | 'fail';
            message?: string;
            query: string;
            country: string;
            countryCode: string;
            region: string;
            regionName: string;
            city: string;
            zip: string;
            lat: number;
            lon: number;
            timezone: string;
            isp: string;
            org: string;
            as: string;
        }

        export interface ZipInfo {
            error: boolean;
            zip: string;
            city: string;
            state: string;
            county: string;
            country: string;
            fips: string;
            timeZone: string;
            population: number;
            latitude: number;
            longitude: number;
            utcOffset: number;
            dma: {
                name: string;
                rank: number;
                percentile: number;
                code: number;
            }
        }
    }

    export namespace Results {
        export interface IPInfo extends Omit<Responses.IPInfo, 'as' | 'org' | 'status'> {
            address: string;
            org?: string;
            as: {
                asn: number;
                name: string;
            }
        }

        export interface ZipInfo extends Omit<Responses.ZipInfo, 'error'> {}
    }
}
