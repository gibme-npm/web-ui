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

import { load_script } from '../helpers/loaders';
import type { SmoothieChart, TimeSeries } from 'smoothie';

declare global {
    interface Window {
        SmoothieChart?: typeof SmoothieChart;
        TimeSeries?: typeof TimeSeries;
    }
}

const load_smoothiecharts = async (): Promise<boolean> => {
    try {
        await load_script(
            'https://cdnjs.cloudflare.com/ajax/libs/smoothie/1.34.0/smoothie.min.js',
            false,
            'sha512-PNAPdJIoyrliVDPtSFYtH9pFQyeTxofjm3vAueqtsduqKqMCaMIiJcGzMYECbnep0sT0qdqWemVbSm2h86NdjQ=='
        );
        return true;
    } catch {
        return false;
    }
};

export default load_smoothiecharts;
