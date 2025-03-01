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

import type { Google } from '../types';
import type { GoogleMap } from '../helpers/google.maps';

declare global {
    interface JQueryStatic {
        /**
         * Loads the Google Charts API
         *
         * @param options
         */
        loadGoogleCharts(options?: Partial<Google.Charts.Options>): Promise<void>;

        /**
         * A very simple wrapper around the Google Fonts CSS API that loads fonts
         * with Regular, Bold, Italic, and Bold Italic styles
         *
         * See: https://developers.google.com/fonts/docs/css2
         *
         * @param families
         * @param display
         */
        loadGoogleFonts(families: string | string[], display?: Google.Fonts.DisplayType): void;

        /**
         * Loads the Google Maps API
         *
         * @param API_KEY your Google Maps API key
         * @param element the element to initialize the maps object into
         * @param options https://developers.google.com/maps/documentation/javascript/overview#MapOptions
         */
        loadGoogleMaps<ElementType extends HTMLElement = HTMLElement>(
            API_KEY: string,
            element?: JQuery<ElementType>,
            options?: Partial<Google.Maps.Options>
        ): Promise<GoogleMap>;

        /**
         * Represents the center of the USA
         */
        USACentered(): Readonly<google.maps.MapOptions>;
    }

    interface Window {
        WebUIInitializeMap?: () => void;
    }
}

($ => {
    $.loadGoogleCharts = function (options: Partial<Google.Charts.Options> = {}): Promise<void> {
        options.packages ??= ['corechart'];

        return new Promise(resolve => {
            $.getScript('https://www.gstatic.com/charts/loader.js', () => {
                options.version ??= 'current';

                google.charts.load(options.version, { packages: options.packages });
                google.charts.setOnLoadCallback(() => {
                    return resolve();
                });
            });
        });
    };

    $.loadGoogleFonts = function (families: string | string[], display: Google.Fonts.DisplayType = 'swap'): void {
        if (!Array.isArray(families)) {
            families = [families];
        }

        const header = $('head');

        $('<link>')
            .attr('rel', 'preconnect')
            .attr('href', 'https://fonts.gstatic.com')
            .appendTo(header);

        class FontURL {
            private arguments: string[] = [];

            constructor (display: Google.Fonts.DisplayType = 'swap') {
                this.addArgument('display', display);
            }

            public addFamily (family: string): void {
                const value = encodeURIComponent(family);

                this.addArgument('family', `${value}:ital,wght@0,400;0,700;1,400;1,700`);
            }

            public toString (): string {
                return `https://fonts.googleapis.com/css2?${this.arguments.join('&')}`;
            }

            private addArgument (key: string, value: string): void {
                this.arguments.push(`${key}=${value}`);
            }
        }

        const font_css_url = new FontURL(display);

        families.forEach(family => font_css_url.addFamily(family));

        $('<link>')
            .attr('href', font_css_url.toString())
            .attr('rel', 'stylesheet')
            .appendTo(header);
    };

    const maps = new Map<string, GoogleMap>();

    {
        let loaded = false;

        $.loadGoogleMaps = async function <ElementType extends HTMLElement = HTMLElement> (
            API_KEY: string,
            element: JQuery<ElementType> = $(document.body) as JQuery<ElementType>,
            options: Partial<Google.Maps.Options> = $.USACentered()
        ): Promise<GoogleMap> {
            const create_if_not_exists = async (): Promise<GoogleMap> => {
                let map = maps.get(element.id());

                if (map) {
                    map.setOptions(options);

                    return map;
                }

                const MapWrapper = (await import('../helpers/google.maps')).GoogleMap;

                map = new MapWrapper(element.element(), options);

                maps.set(element.id(), map);

                return map;
            };

            {
                const map = maps.get(element.id());

                if (map) {
                    return map;
                }
            }

            if (loaded) {
                return create_if_not_exists();
            } else {
                return new Promise((resolve, reject) => {
                    options.language ??= 'en';
                    options.libraries ??= [];
                    options.version ??= 'weekly';
                    options.center ??= $.USACentered().center;
                    options.zoom ??= $.USACentered().zoom;

                    const params = new URLSearchParams();
                    params.set('key', API_KEY.trim());
                    params.set('callback', 'WebUIInitializeMap');
                    params.set('v', options.version.toString().trim());
                    params.set('language', options.language.trim());

                    if (options.libraries.length !== 0) {
                        params.set('libraries', options.libraries.map(elem => elem.trim()).join(','));
                    }

                    if (options.region) params.set('region', options.region.trim());

                    window.WebUIInitializeMap = async () => {
                        delete window.WebUIInitializeMap;

                        loaded = true;

                        return resolve(await create_if_not_exists());
                    };

                    $.ajax({
                        url: `https://maps.googleapis.com/maps/api/js?${params.toString()}`,
                        dataType: 'script',
                        error: error => {
                            return reject(error);
                        }
                    });
                });
            }
        };
    }

    $.USACentered = function (): Readonly<google.maps.MapOptions> {
        return {
            center: {
                lat: 39.8097343,
                lng: -98.5556199
            },
            zoom: 5
        };
    };
})(window.$);

export {};
