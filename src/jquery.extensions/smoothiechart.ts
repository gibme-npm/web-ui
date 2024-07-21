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

import type { IChartOptions, ITimeSeriesOptions, SmoothieChart, TimeSeries } from 'smoothie';
import { version, CDNJS } from '../helpers/cdn';

declare global {
    interface JQueryStatic {
        /**
         * Initialises a new TimeSeries with optional data options.
         *
         * @param seriesOptions
         */
        timeSeries(seriesOptions?: ITimeSeriesOptions): TimeSeries;
    }

    interface JQuery {
        /**
         * Initialises a new SmoothieChart
         *
         * @param chartOptions
         * @param delayMillis
         */
        smoothieChart(chartOptions?: IChartOptions, delayMillis?: number): SmoothieChart;
    }

    interface Window {
        TimeSeries: typeof TimeSeries;
        SmoothieChart: typeof SmoothieChart;
    }
}

const charts = new Map<string, SmoothieChart>();

($ => {
    const setup = () => {
        $.timeSeries = (options: ITimeSeriesOptions): TimeSeries =>
            new window.TimeSeries(options);

        $.fn.smoothieChart = function (options: IChartOptions = {}, delayMillis?: number): SmoothieChart {
            const canvas = $(this) as JQuery<HTMLCanvasElement>;

            const chart = charts.get(canvas.id()) || (() => {
                const chart = new window.SmoothieChart(options);
                chart.streamTo(canvas.element(), delayMillis);
                return chart;
            })();

            charts.set(canvas.id(), chart);

            return chart;
        };
    };

    if (typeof window.TimeSeries === 'undefined' || typeof window.SmoothieChart === 'undefined') {
        $.getScript({
            url: `${CDNJS}/smoothie/${version('smoothie')}/smoothie.min.js`,
            cache: true,
            success: () => setup()
        });
    } else {
        setup();
    }
})(window.$);

export {};
