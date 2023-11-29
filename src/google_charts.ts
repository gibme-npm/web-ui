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

/**
 * The Google Charts loader options
 */
export interface ChartOptions {
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

/**
 * Loads the Google Charts API
 *
 * @param options loader options to use
 */
export const GoogleChartsLoader = async (
    options: Partial<ChartOptions> = {}
): Promise<void> => {
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

export default GoogleChartsLoader;
