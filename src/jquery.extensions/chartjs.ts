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

import $ from 'jquery';
import type { Chart as ChartJSType, ChartConfiguration } from 'chart.js';

declare global {
    interface JQuery {
        /**
         * Initialises a new Chart.js instance
         *
         * @param options
         */
        chartJS(options: ChartConfiguration): ChartJSType;
    }

    interface JQueryStatic {
        /**
         * Initialises a new Chart.js instance
         *
         * @param canvas
         * @param options
         */
        chartJS(canvas: JQuery<HTMLCanvasElement>, options: ChartConfiguration): ChartJSType;
    }
}

{
    const charts = new Map<string, ChartJSType>();

    $.chartJS = function (canvas: JQuery<HTMLCanvasElement>, options: ChartConfiguration): ChartJSType {
        if (!window.Chart) throw new Error('Chart.js not loaded');

        const id = canvas.attr('id') || canvas.path('tagName');

        const chart = charts.get(id) || new window.Chart(canvas.element<HTMLCanvasElement>(), options);

        charts.set(id, chart);

        return chart;
    };
}

$.fn.extend({
    chartJS: function (options: ChartConfiguration): ChartJSType {
        const canvas = $(this) as JQuery<HTMLCanvasElement>;

        return $.chartJS(canvas, options);
    }
});
