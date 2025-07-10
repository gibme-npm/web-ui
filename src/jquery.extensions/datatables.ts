// Copyright (c) 2021-2025, Brandon Lehmann <brandonlehmann@gmail.com>
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

import type { Config, Api } from 'datatables.net-bs5';
// eslint-disable-next-line import/no-named-default
import type { default as JSZip } from 'jszip';
// eslint-disable-next-line import/no-named-default
import type { default as pdfMake } from 'pdfmake';
import './datatables/all';
import { version, CDNJS } from '../helpers/cdn';

declare global {
    interface JQuery {
        /**
         * Creates a DataTables.net instance on the element
         *
         * @param config
         * @param buttonContainer if specified, will place the buttons (if enabled) into the container specified
         * if not specified and buttons are enabled, they will be placed at the top of the table
         */
        dt<T extends HTMLElement = HTMLElement>(config?: Config, buttonContainer?: JQuery<T>): Api;
    }

    interface Window {
        pdfMake: typeof pdfMake;
        JSZip: typeof JSZip;
    }
}

($ => {
    const setup = () => {
        $.fn.dt = function <T extends HTMLElement = HTMLElement> (
            options: Config = {},
            buttonContainer?: JQuery<T>
        ): Api {
            const $this = $(this);
            const id = $this.id();

            if (!options.destroy) {
                options.retrieve ??= true;
            }

            const $table = $this.DataTable(options);

            if (options.buttons) {
                if (buttonContainer) {
                    $table.buttons().container().appendTo(buttonContainer);
                } else {
                    $(`#${id}_wrapper`)
                        .children(':first')
                        .children(':first')
                        .append($table.buttons().container());
                }
            }

            const old_draw = $table.draw;

            $table.draw = function (paging?: boolean | string): Api {
                old_draw.call(this, paging);

                this.columns.adjust();

                if (options.responsive) {
                    this.responsive.recalc();
                }

                return this;
            };

            return $table.draw();
        };
    };

    if (typeof $.fn.DataTable === 'undefined' ||
        typeof window.pdfMake === 'undefined' ||
        typeof window.JSZip === 'undefined'
    ) {
        const pkgs: string = [
            `jszip-${version('jszip')}`,
            `dt-${version('datatables.net-bs5')}`,
            `af-${version('datatables.net-autofill-bs5')}`,
            `b-${version('datatables.net-buttons-bs5')}`,
            `b-colvis-${version('datatables.net-buttons-bs5')}`,
            `b-html5-${version('datatables.net-buttons-bs5')}`,
            `b-print-${version('datatables.net-buttons-bs5')}`,
            `cr-${version('datatables.net-colreorder-bs5')}`,
            `date-${version('datatables.net-datetime')}`,
            `fc-${version('datatables.net-fixedcolumns-bs5')}`,
            `fh-${version('datatables.net-fixedheader-bs5')}`,
            `kt-${version('datatables.net-keytable-bs5')}`,
            `r-${version('datatables.net-responsive-bs5')}`,
            `rg-${version('datatables.net-rowgroup-bs5')}`,
            `rr-${version('datatables.net-rowreorder-bs5')}`,
            `sc-${version('datatables.net-scroller-bs5')}`,
            `sb-${version('datatables.net-searchbuilder-bs5')}`,
            `sp-${version('datatables.net-searchpanes-bs5')}`,
            `sl-${version('datatables.net-select-bs5')}`,
            `sr-${version('datatables.net-staterestore-bs5')}`
        ].join('/');
        const pdf = version('pdfmake');

        $('<link rel="stylesheet" crossorigin="anonymous" referrerpolicy="no-referrer">')
            .appendTo($(document.head))
            .attr('href', `https://cdn.datatables.net/v/bs5/${pkgs}/datatables.min.css`);

        $.getScript({
            url: `${CDNJS}/pdfmake/${pdf}/pdfmake.min.js`,
            cache: true,
            success: () => {
                $.getScript({
                    url: `${CDNJS}/pdfmake/${pdf}/vfs_fonts.min.js`,
                    cache: true,
                    success: () => {
                        $.getScript({
                            url: `https://cdn.datatables.net/v/bs5/${pkgs}/datatables.min.js`,
                            cache: true,
                            success: () => setup()
                        });
                    }
                });
            }
        });
    } else {
        setup();
    }
})(window.$);

export {};
