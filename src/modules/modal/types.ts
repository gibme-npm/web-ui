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

export namespace ModalTypes {
    /**
     * Modal events
     */
    export type Event = 'show' | 'shown' | 'hide' | 'hidden' | 'hidePrevented';

    /**
     * The size of the modal
     */
    export type Size = 'small' | 'default' | 'large' | 'x-large';

    /**
     * The size of the fullscreen modal
     */
    export type FullScreenSize = 'always' | 'small' | 'medium' | 'large' | 'x-large' | 'xx-large';

    /**
     * Describes modal options
     */
    export interface Options<
        BodyElement extends HTMLElement = HTMLElement,
        TitleElement extends HTMLElement = HTMLElement,
        FooterElement extends HTMLElement = HTMLElement
    > {
        /**
         * The body of the modal
         */
        body: JQuery<BodyElement> | string;
        /**
         * The title of the modal
         */
        title: JQuery<TitleElement> | string;
        /**
         * The footer of the modal
         */
        footer: JQuery<FooterElement> | string;
        /**
         * A timeout wherein the modal will auto hide
         */
        timeout: number;
        /**
         * Whether we display the default close button in the upper right of the modal
         */
        useDefaultCloseButton: boolean;
        /**
         * Whether `body`, `title`, and `footer` are **destructive** meaning that if they
         * are passed in as JQuery elements, the elements will be **moved** into the modal
         * whereby they may be removed in the future.
         */
        destructive: boolean;
        /**
         * The size of the modal; defaults to 'large';
         */
        size: Size;
        /**
         * The size of a fullscreen modal; defaults to `undefined`
         */
        fullscreenSize: FullScreenSize;
        /**
         * Whether the modal should be scrollable; defaults to `false`
         */
        scrollable: boolean;
        /**
         * Whether the modal should be vertically centered; defaults to `true`
         */
        verticallyCentered: boolean;
    }
}

export namespace StatusModalTypes {
    export interface Options {
        /**
         * The title to use for the status modal
         */
        title: string;
        /**
         * The message to display
         */
        body: any;
        /**
         * The message footer to display
         */
        footer: string;
        /**
         * A timeout wherein the modal will auto hide
         */
        timeout: number;
        /**
         * The class to apply to the title
         */
        titleClass: string;
        /**
         * The class to apply to the body
         */
        bodyClass: string;
        /**
         * Whether we display the default close button in the upper right of the modal
         */
        useDefaultCloseButton: boolean;
    }
}
