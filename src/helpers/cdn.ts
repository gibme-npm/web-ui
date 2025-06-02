// Copyright (c) 2024-2025, Brandon Lehmann <brandonlehmann@gmail.com>
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

// this pulls in our package version(s) with a sledgehammer
const versions = (() => {
    const regex = /([0-9]+\.[0-9]+\.[0-9]+)/;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return (Object.entries(require('../../package.json').dependencies) as string[][])
        .filter(([name, version]) => !name.includes('@types') && version.match(regex))
        .map(([name, version]) => {
            return {
                name,
                version: (version.match(regex) || [])[0]
            };
        })
        .filter(entry => entry.version);
})();

export const version = (name: string): string | undefined => {
    return versions.filter(pkg => pkg.name === name)
        .shift()?.version;
};

export const CDNJS = 'https://cdnjs.cloudflare.com/ajax/libs';

export const JSDELIVR = 'https://cdn.jsdelivr.net/npm';

/** @ignore */
const load_script = async (uri: string): Promise<boolean> => new Promise(resolve => {
    $.getScript({
        url: uri,
        cache: true,
        success: () => resolve(true),
        error: () => resolve(false)
    });
});

export const loadScript = async (
    expected: any,
    uris: string | string[],
    noThrow = false
): Promise<void> => {
    uris = Array.isArray(uris) ? uris : [uris];
    expected = Array.isArray(expected) ? expected : [expected];

    if (expected.some((want: any) => typeof want === 'undefined')) {
        for (const uri of uris) {
            if (!await load_script(uri)) {
                if (!noThrow) {
                    throw new Error(`Failed to load ${uri}`);
                }
            }
        }
    }
};
