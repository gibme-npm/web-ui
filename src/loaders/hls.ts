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
// eslint-disable-next-line import/no-named-default
import type { default as HLS } from 'hls.js';

declare global {
    interface Window {
        Hls?: typeof HLS;
    }
}

const load_hls = async (): Promise<boolean> => {
    try {
        await load_script(
            'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.11/hls.min.js',
            false,
            'sha512-Z0W3S5swMoBWjkNBP3ACbXA4mh/jdjJOTOOZfF1yIO0OdkIU373s/Tm+eaCbUQq7EEgKl9O1eji1ZgseHCUVgw==');
        return true;
    } catch {
        return false;
    }
};

export default load_hls;
