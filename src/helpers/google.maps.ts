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

type PolyArcOptions = Omit<google.maps.PolylineOptions, 'map' | 'path'> & {
    bulge?: number;
    resolution?: number;
}

/**
 * Extends the Google Maps class with a few extra helper methods
 */
export class GoogleMap extends google.maps.Map {
    private _markers: google.maps.Marker[] = [];
    private _polylines: google.maps.Polyline[] = [];
    private _layers: google.maps.KmlLayer[] = [];

    /**
     * Returns the current layers on the map
     */
    public get layers (): google.maps.KmlLayer[] {
        return this._layers;
    }

    /**
     * Returns the current markers on the map
     */
    public get markers (): google.maps.Marker[] {
        return this._markers;
    }

    /**
     * Returns the current polylines on the map
     */
    public get polylines (): google.maps.Polyline[] {
        return this._polylines;
    }

    /**
     * Adds a marker to the map
     *
     * @param marker
     */
    public addMarker (marker: google.maps.Marker): google.maps.Marker {
        marker.setMap(this);

        this._markers.push(marker);

        return marker;
    }

    /**
     * Adds a layer to the map
     *
     * @param layer
     */
    public addLayer (layer: google.maps.KmlLayer): google.maps.KmlLayer {
        layer.setMap(this);

        this._layers.push(layer);

        return layer;
    }

    /**
     * Adds a polyline to the map
     *
     * @param polyline
     */
    public addPolyline (polyline: google.maps.Polyline): google.maps.Polyline {
        polyline.setMap(this);

        this._polylines.push(polyline);

        return polyline;
    }

    /**
     * Clears all the layers from the map
     */
    public clearLayers (): void {
        for (const layer of this._layers) {
            layer.setMap(null);
        }

        this._layers = [];
    }

    /**
     * Clears all the markers on the map as long as they were added via these helper methods
     */
    public clearMarkers (): void {
        for (const marker of this._markers) {
            marker.setMap(null);
        }

        this._markers = [];
    }

    /**
     * Clears all the polylines on the map as long as they were added via these helper methods
     */
    public clearPolylines (): void {
        for (const polyline of this._polylines) {
            polyline.setMap(null);
        }

        this._polylines = [];
    }

    /**
     * Creates a new layer on the map
     *
     * @param options
     */
    public createLayer (options: Omit<google.maps.KmlLayerOptions, 'map'>): google.maps.KmlLayer {
        const layer = new google.maps.KmlLayer({
            ...options,
            map: this
        });

        this._layers.push(layer);

        return layer;
    }

    /**
     * Creates a new marker on the map
     *
     * @param options
     */
    public createMarker (options: Omit<google.maps.MarkerOptions, 'map'>): google.maps.Marker {
        const marker = new google.maps.Marker({
            ...options,
            map: this
        });

        this._markers.push(marker);

        return marker;
    }

    /**
     * Creates a new polyarc on the map
     *
     * @param start
     * @param end
     * @param options
     */
    public createPolyArc (
        start: google.maps.LatLng | [number, number],
        end: google.maps.LatLng | [number, number],
        options: PolyArcOptions = {}
    ): google.maps.Polyline {
        if (Array.isArray(start)) {
            start = this.loadLatLng(start);
        }

        if (Array.isArray(end)) {
            end = this.loadLatLng(end);
        }

        options.bulge ??= 0.15;
        options.resolution ??= 100;

        const { bulge, resolution } = options;

        const arcPoints: google.maps.LatLng[] = [];

        // Convert start and end to cartesian coordinates
        const lat1 = start.lat() * (Math.PI / 180);
        const lng1 = start.lng() * (Math.PI / 180);
        const lat2 = end.lat() * (Math.PI / 180);
        const lng2 = end.lng() * (Math.PI / 180);

        // Midpoint and arc height
        const midLat = (lat1 + lat2) / 2;
        const midLng = (lng1 + lng2) / 2;
        const dx = lat2 - lat1;
        const dy = lng2 - lng1;

        // Perpendicular vector for bulge
        const offsetX = -dy * bulge;
        const offsetY = dx * bulge;

        // Compute control point for the arc
        const controlLat = midLat + offsetX;
        const controlLng = midLng + offsetY;

        for (let i = 0; i <= resolution; i++) {
            const t = i / resolution;
            const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
            const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2;

            arcPoints.push(new google.maps.LatLng(lat * (180 / Math.PI), lng * (180 / Math.PI)));
        }

        return this.createPolyline({
            ...options,
            path: arcPoints
        });
    }

    /**
     * Creates a new polyline on the map
     *
     * @param options
     */
    public createPolyline (options: Omit<google.maps.PolylineOptions, 'map'> = {}): google.maps.Polyline {
        options.strokeColor ??= '#FF0000';
        options.strokeOpacity ??= 1;
        options.strokeWeight ??= 2;

        const polyline = new google.maps.Polyline({
            ...options,
            map: this
        });

        this._polylines.push(polyline);

        return polyline;
    }

    /**
     * Converts a [lat,lng] array to a google maps LatLng
     *
     * @param point
     * @protected
     */
    protected loadLatLng (point: [number, number]): google.maps.LatLng {
        return new google.maps.LatLng(point[0], point[1]);
    }
}
