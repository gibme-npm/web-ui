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

import load_bootstrap from '../loaders/bootstrap';
import load_fontawesome from '../loaders/fontawesome';
import load_datatables_bs5, { load_datatables_dt, load_datatables_ju } from '../loaders/datatables';
import load_chartjs from '../loaders/chartjs';
import load_smoothiecharts from '../loaders/smoothiecharts';
import load_hls from '../loaders/hls';
import load_fetch from '../loaders/fetch';
import load_moment from '../loaders/moment';
import load_numeral from '../loaders/numeral';
import load_qrcode from '../loaders/qrcode';
import load_websocket from '../loaders/websocket';

type Library = 'bootstrap' | 'fontawesome' | 'datatables-bs5' |
    'datatables-ju' | 'datatables-dt' | 'chartjs' | 'smoothiecharts' |
    'hls' | 'fetch' | 'moment' | 'numeral' | 'qrcode' | 'websocket';

const load_from_cdn = async (library: Library): Promise<boolean> => {
    switch (library) {
        case 'bootstrap':
            return load_bootstrap();
        case 'fontawesome':
            return load_fontawesome();
        case 'datatables-bs5':
            return load_datatables_bs5();
        case 'datatables-ju':
            return load_datatables_ju();
        case 'datatables-dt':
            return load_datatables_dt();
        case 'chartjs':
            return load_chartjs();
        case 'smoothiecharts':
            return load_smoothiecharts();
        case 'hls':
            return load_hls();
        case 'fetch':
            return load_fetch();
        case 'moment':
            return load_moment();
        case 'numeral':
            return load_numeral();
        case 'qrcode':
            return load_qrcode();
        case 'websocket':
            return load_websocket();
        default:
            throw new Error('Unsupported library specified');
    }
};

export default load_from_cdn;
