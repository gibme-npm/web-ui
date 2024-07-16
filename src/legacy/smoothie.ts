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

/**
 * This legacy package has the library bundled into it and because it has
 * exports that legacy uses may expect, we need to make sure those are exported
 */

import $ from 'jquery';
import { IChartOptions, ITimeSeriesOptions, SmoothieChart, TimeSeries } from 'smoothie';
import '../jquery.extensions/html';

export { SmoothieChart, TimeSeries } from 'smoothie';

declare global {
    interface JQuery {
        /**
         * Initialises a new SmoothieChart
         *
         * @param chartOptions
         * @param delayMillis
         */
        smoothieChart(chartOptions?: IChartOptions, delayMillis?: number): SmoothieChart;
    }

    interface JQueryStatic {
        /**
         * Initialises a new SmoothieChart
         *
         * @param canvas
         * @param chartOptions
         * @param delayMillis
         */
        smoothieChart(
            canvas: JQuery<HTMLCanvasElement>,
            chartOptions?: IChartOptions,
            delayMillis?: number
        ): SmoothieChart;

        /**
         * Initialises a new TimeSeries with optional data options.
         *
         * @param seriesOptions
         */
        timeSeries(seriesOptions?: ITimeSeriesOptions): TimeSeries;
    }
}

{
    const charts = new Map<string, SmoothieChart>();

    $.smoothieChart = function (
        canvas: JQuery<HTMLCanvasElement>,
        chartOptions?: IChartOptions,
        delayMillis?: number
    ): SmoothieChart {
        const id = canvas.attr('id') || canvas.path('tagName');

        const chart = charts.get(id) || (() => {
            const chart = new SmoothieChart(chartOptions);
            chart.streamTo(canvas.element<HTMLCanvasElement>(), delayMillis);
            return chart;
        })();

        charts.set(id, chart);

        return chart;
    };
}

$.timeSeries = function (seriesOptions?: ITimeSeriesOptions): TimeSeries {
    return new TimeSeries(seriesOptions);
};

$.fn.extend({
    smoothieChart: function (chartOptions?: IChartOptions, delayMillis?: number): SmoothieChart {
        const canvas = $(this) as JQuery<HTMLCanvasElement>;

        return $.smoothieChart(canvas, chartOptions, delayMillis);
    }
});
