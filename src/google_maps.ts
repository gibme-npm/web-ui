// Copyright (c) 2021-2023, Brandon Lehmann <brandonlehmann@gmail.com>
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

declare global {
    interface Window {
        WebUIInitializeMap: () => void;
        WebUIGoogleMap: google.maps.Map;
    }
}

/**
 * Represents the center of the USA
 */
export const USACentered: google.maps.MapOptions = {
    center: {
        lat: 39.8097343,
        lng: -98.5556199
    },
    zoom: 5
};

/**
 * Extends the google.maps.MapOptions interface to include loader options
 */
export interface MapOptions extends google.maps.MapOptions {
    version: string | number;
    libraries: string[];
    language: string;
    region: string;
}

/**
 * Loads the Google Maps API
 *
 * @param API_KEY your Google Maps API key
 * @param element the element to initialize the maps object into
 * @param options https://developers.google.com/maps/documentation/javascript/overview#MapOptions
 * @constructor
 */
export const GoogleMapsLoader = async <Type extends HTMLElement = HTMLElement>(
    API_KEY: string,
    element: string | JQuery<Type> = $(document.body) as any,
    options: Partial<MapOptions> = USACentered
): Promise<google.maps.Map> => {
    return new Promise(resolve => {
        options.language ??= 'en';
        options.libraries ??= [];
        options.version ??= 'weekly';
        options.center ??= USACentered.center;
        options.zoom ??= USACentered.zoom;

        window.WebUIInitializeMap = () => {
            if (typeof element === 'string') {
                element = $(element);
            }

            window.WebUIGoogleMap = new google.maps.Map(element[0], options);

            return resolve(window.WebUIGoogleMap);
        };

        let url = 'https://maps.googleapis.com/maps/api/js?' +
            `key=${API_KEY.trim()}` +
            '&callback=WebUIInitializeMap' +
            `&v=${options.version.toString().trim()}` +
            `&language=${options.language.trim()}`;

        if (options.libraries.length > 0) {
            url += `&libraries=${options.libraries.map(elem => elem.trim()).join(',')}`;
        }

        if (options.region) {
            url += `&region=${options.region.trim()}`;
        }

        $.getScript(url);
    });
};

export default GoogleMapsLoader;
