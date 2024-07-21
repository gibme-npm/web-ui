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

import type { Chart, ChartConfiguration } from 'chart.js';
import { version, CDNJS } from '../helpers/cdn';

declare global {
    interface JQuery {
        /**
         * Initialises a new Chart.js instance
         *
         * @param config
         */
        chartJS(config: ChartConfiguration): Chart;
    }

    interface Window {
        Chart: typeof Chart;
    }
}

const charts = new Map<string, Chart>();

($ => {
    const setup = () => {
        $.fn.chartJS = function (config: ChartConfiguration): Chart {
            const canvas = $(this) as JQuery<HTMLCanvasElement>;

            const chart = charts.get(canvas.id()) || new window.Chart(
                canvas.element<HTMLCanvasElement>(), config);

            charts.set(canvas.id(), chart);

            return chart;
        };
    };

    if (typeof window.Chart === 'undefined') {
        $.getScript({
            url: `${CDNJS}/Chart.js/${version('chart.js')}/chart.umd.min.js`,
            cache: true,
            success: () => setup()
        });
    } else {
        setup();
    }
})(window.$);

export {};
