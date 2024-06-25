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

export namespace HTML {
    export type Color = `rgb(${number},${number},${number})`
        | `rgba(${number},${number},${number},${number})`
        | `#${string}`;

    export namespace Input {
        /**
         * HTML Input Option Set
         */
        export interface Options {
            type: 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file'
                | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search'
                | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week';
            class: string;
            id: string;
            label: string | JQuery<HTMLElement>
            input: JQuery<HTMLElement>
            readonly: boolean;
            disabled: boolean;

            [key: string]: string | number | JQuery<HTMLElement> | boolean | undefined;
        }
    }

    export namespace Video {
        /**
         * Video element creation options
         */
        export interface Options {
            autoplay: boolean;
            controls: boolean;
            loop: boolean;
            muted: boolean;
            playsinline: boolean;

            [key: string]: boolean;
        }
    }
}

export namespace FontAwesome {
    export type Animation = 'none' | 'beat' | 'beat-fade' | 'bounce' | 'fade'
        | 'flip' | 'shake' | 'spin' | 'spin-reverse' | 'spin-pulse';

    export type Rotation = 'none' | 'rotate-90' | 'rotate-180' | 'rotate-270'
        | 'flip-horizontal' | 'flip-vertical' | 'flip-both';

    export namespace Icon {
        type Style = 'solid' | 'regular' | 'light' | 'duotone' | 'thin';

        type Size = 'default' | '2xs' | 'xs' | 'lg' | 'xl' | '2xl';

        /**
         * Font Awesome Option set
         */
        export interface Options {
            class: string;
            style: Style;
            animation: Animation;
            rotation: Rotation;
            size: Size;
            color: HTML.Color;
            attributes: any[][];
        }
    }

    export namespace Button {
        /**
         * Font Awesome Button Options set
         */
        export interface Options extends Icon.Options {
            label: string | JQuery<HTMLElement>;

            [key: string]: any;
        }
    }
}

export namespace Google {
    export namespace Charts {
        /**
         * The Google Charts loader options
         */
        export interface Options {
            /**
             * The chart packages to load; defaults to `corechart` only
             *
             * See: https://developers.google.com/chart/interactive/docs/gallery
             */
            packages: string[];
            /**
             * Ther charts version to load
             */
            version: string | number;
        }
    }

    export namespace Fonts {
        export type DisplayType = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    }

    export namespace Maps {
        /**
         * Extends the google.maps.MapOptions interface to include loader options
         */
        export interface Options extends google.maps.MapOptions {
            version: string | number;
            libraries: string[];
            language: string;
            region: string;
        }
    }
}

export namespace Overlay {
    export type Action = 'show' | 'hide' | 'progress' | 'resize' | 'text' | 'icon' | 'image';

    interface AutoResize {
        autoResize: boolean;
        resizeFactor: number;
    }

    interface HasOrder {
        order: number;
    }

    interface BaseOptions {
        className: string;
        color: HTML.Color;
    }

    export interface BackgroundOptions {
        className: string;
        color: HTML.Color;
    }

    export interface CanHide {
        hide: boolean;
    }

    export interface ImageOptions extends Partial<BaseOptions>, Partial<AutoResize>,
        Partial<CanHide>, Partial<HasOrder> {
        source: string;
        animation?: FontAwesome.Animation;
        rotation?: FontAwesome.Rotation;
        width?: number;
        height?: number;
    }

    export interface FontAwesomeOptions extends Partial<FontAwesome.Icon.Options>,
        Partial<AutoResize>, Partial<CanHide>, HasOrder {
        name: string | string[];
    }

    export interface TextOptions extends Partial<BaseOptions>, Partial<AutoResize>, Partial<HasOrder> {
        message: string | JQuery<HTMLElement>;
    }

    export interface ProgressOptions extends Partial<BaseOptions>, Partial<AutoResize>, Partial<HasOrder> {
        value: number;
        min: number;
        max: number;
        animated: boolean;
    }

    export interface OverlayOptions {
        background: Partial<BackgroundOptions>;
        icon: Partial<FontAwesomeOptions>;
        image: Partial<ImageOptions>;
        text: Partial<TextOptions>;
        progress: Partial<ProgressOptions>;
        resizeInterval: number;
        fade: { in?: number | boolean, out?: number | boolean };
        zIndex: number;
        timeout?: number;
    }

    export const DefaultOptions: Readonly<OverlayOptions> = {
        background: {
            color: 'rgba(255, 255, 255, 0.8)'
        },
        icon: {
            name: 'spinner',
            style: 'solid',
            animation: 'spin-pulse',
            color: '#202020',
            resizeFactor: 0.15,
            autoResize: true,
            order: 2
        },
        image: {
            source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                    <circle r="80" cx="500" cy="90"/>
                    <circle r="80" cx="500" cy="910"/>
                    <circle r="80" cx="90" cy="500"/>
                    <circle r="80" cx="910" cy="500"/>
                    <circle r="80" cx="212" cy="212"/>
                    <circle r="80" cx="788" cy="212"/>
                    <circle r="80" cx="212" cy="788"/>
                    <circle r="80" cx="788" cy="788"/></svg>`,
            animation: 'spin',
            autoResize: true,
            resizeFactor: 0.15,
            width: 200,
            height: 200,
            color: '#202020',
            hide: true,
            order: 3
        },
        text: {
            autoResize: true,
            resizeFactor: 0.075,
            color: '#202020',
            order: 1
        },
        progress: {
            autoResize: true,
            resizeFactor: 0.025,
            color: '#a0a0a0',
            min: 0,
            max: 100,
            animated: true,
            order: 4
        },
        fade: { in: 400, out: 200 },
        resizeInterval: 50,
        zIndex: 2147483647
    };

    export type Options = Partial<OverlayOptions> | Partial<FontAwesomeOptions> | JQuery<HTMLElement>
        | string | number;

    export const mergeOptions = (
        target: Partial<OverlayOptions> = {},
        source: Partial<OverlayOptions> = DefaultOptions
    ): Partial<OverlayOptions> => {
        const deep_merge = <Type = any, SourceType = any>(obj1: SourceType, obj2: SourceType): Type => {
            const result = { ...obj1 };

            for (const key in obj2) {
                if (Object.prototype.hasOwnProperty.call(obj2, key)) {
                    if (obj2[key] instanceof Object && obj1[key] instanceof Object) {
                        result[key] = deep_merge(obj1[key], obj2[key]);
                    } else {
                        result[key] = obj2[key];
                    }
                }
            }

            return result as any;
        };

        return deep_merge<OverlayOptions>(source, target);
    };
}

export namespace Remotes {
    export namespace Responses {
        export interface IPInfo {
            status: 'success' | 'fail';
            message?: string;
            query: string;
            country: string;
            countryCode: string;
            region: string;
            regionName: string;
            city: string;
            zip: string;
            lat: number;
            lon: number;
            timezone: string;
            isp: string;
            org: string;
            as: string;
        }
    }

    export namespace Results {
        export interface IPInfo extends Omit<Responses.IPInfo, 'as' | 'org' | 'status'> {
            query: string;
            org?: string;
            as: {
                asn: number;
                name: string;
            }
        }
    }
}
