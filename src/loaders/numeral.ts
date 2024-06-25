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
import type { default as numeral } from 'numeral';

declare global {
    interface Window {
        numeral?: typeof numeral;
    }
}

const load_numeral = async (): Promise<boolean> => {
    try {
        await load_script(
            'https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js',
            false,
            'sha512-USPCA7jmJHlCNRSFwUFq3lAm9SaOjwG8TaB8riqx3i/dAJqhaYilVnaf2eVUH5zjq89BU6YguUuAno+jpRvUqA=='
        );
        await load_script(
            'https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/locales.min.js',
            false,
            'sha512-uwd27MOaEPwRsCGC+L8DL+uUQVLpdNj6Pp94kqNq/X+F0eMVJDx/0nMCkkbF+H1IYqZxt7JoS56T5rtpOxscZw=='
        );
        return true;
    } catch (error: any) {
        return false;
    }
};

export default load_numeral;
