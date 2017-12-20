/* global L */

import h337 from 'heatmap.js';

import { A } from '@ember/array';
import { default as EmberObject, get } from '@ember/object';
import { isEmpty } from '@ember/utils';

/*
 * Leaflet Heatmap Overlay (Modified)
 *
 * Modification of the following plugin by Will Viles, 2016.
 *
 * Copyright (c) 2014, Patrick Wied (http://www.patrick-wied.at)
 * Dual-licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and the Beerware (http://en.wikipedia.org/wiki/Beerware) license.
 */

let HeatmapLayer = function() {};

if (typeof FastBoot === 'undefined') {

  if (typeof L.Layer === 'undefined') {
    L.Layer = L.Class;
  }

  HeatmapLayer = L.Layer.extend({

    initialize(config) {
      this.cfg = EmberObject.create(config);
      this._el = L.DomUtil.create('div', 'leaflet-zoom-hide');
      this._data = A([]);
      this._max = get(config, 'maxValue') || 1;
      this._min = get(config, 'minValue') || 0;
      this.cfg.container = this._el;
    },

    onAdd(map) {
      const size = map.getSize();

      this._map = map;
      this._width = size.x;
      this._height = size.y;
      this._el.style.width = size.x + 'px';
      this._el.style.height = size.y + 'px';
      this._el.style.position = 'absolute';
      this._origin = this._map.layerPointToLatLng(new L.Point(0, 0));

      map.getPanes().overlayPane.appendChild(this._el);

      // Fix for map positioning
      L.DomUtil.setPosition(this._el, this._map.containerPointToLayerPoint([0, 0]));

      if (!this._heatmap) {
        this._heatmap = h337.create(this.cfg);
      }

      // this resets the origin and redraws whenever
      // the zoom changed or the map has been moved
      map.on('moveend', this._reset, this);
      this._draw();

    },

    addTo(map) {
      map.addLayer(this);
      return this;

    },

    onRemove(map) {
      // remove layer's DOM elements and listeners
      map.getPanes().overlayPane.removeChild(this._el);
      map.off('moveend', this._reset, this);

    },

    _draw() {
      if (!this._map) {
        return;
      }

      const mapPane = this._map.getPanes().mapPane;
      const point = mapPane._leaflet_pos;

      // reposition the layer
      this._el.style[this._cssTransform] = 'translate(' +
        -Math.round(point.x) + 'px,' +
        -Math.round(point.y) + 'px)';

      this._update();
    },

    _update() {

      let data = {
          max: this._max,
          min: this._min,
          data: []
        },
        bounds = this._map.getBounds(),
        zoom = this._map.getZoom(),
        scale = Math.pow(2, zoom);

      if (isEmpty(this._data)) {
        if (!this._heatmap) {
          return;
        }
        this._heatmap.setData(data);
        return;
      }

      const valueField = this.cfg.getWithDefault('valueField', 'value');

      let latLngPoints = [],
        radiusMultiplier = get(this.cfg, 'scaleRadius') ? scale : 1,
        localMax = 0,
        localMin = 0;

      this._data.data.forEach((datapoint) => {
        const value = get(datapoint, valueField);
        const latlng = get(datapoint, 'latlng');
        const radius = data.radius ? data.radius * radiusMultiplier : (this.cfg.radius || 2) * radiusMultiplier;

        const mapSize = this._map.getSize();
        const mapPadding = radius / Math.min(mapSize.x, mapSize.y);

        // we don't wanna render points that are not even on the map ;-)
        if (!bounds.pad(mapPadding).contains(latlng)) {
          return;
        }

        // local max is the maximum within current bounds
        localMax = Math.max(value, localMax);
        localMin = Math.min(value, localMin);

        let point = this._map.latLngToContainerPoint(latlng),
          latlngPoint = {
            x: Math.round(point.x),
            y: Math.round(point.y),
            [valueField]: value,
            radius: radius
          };

        latLngPoints.push(latlngPoint);

      });

      if (this.cfg.useLocalExtrema) {
        data.max = localMax;
        data.min = localMin;
      }

      data.data = latLngPoints;

      this._heatmap.setData(data);

    },

    updateData(data) {
      const latField = this.cfg.getWithDefault('latField', 'lat');
      const lngField = this.cfg.getWithDefault('lngField', 'lng');
      const valueField = this.cfg.getWithDefault('valueField', 'value');

      let max = this._max,
        min = this._min;

      let mappedData = data.map((point) => {

        const lat = get(point, latField);
        const lng = get(point, lngField);
        const value = get(point, valueField);

        max = Math.max(max, value);
        min = Math.min(min, value);

        return {
          latlng: new L.LatLng(lat, lng),
          [valueField]: value
        };

      });

      this._max = max || this._max;
      this._min = min || this._min;

      this._data = {
        max,
        min,
        data: mappedData
      };

      this._draw();

    },

    _reset() {
      this._origin = this._map.layerPointToLatLng(new L.Point(0, 0));

      // Fix for map positioning
      L.DomUtil.setPosition(this._el, this._map.containerPointToLayerPoint([0, 0]));

      var size = this._map.getSize();
      if (this._width !== size.x || this._height !== size.y) {
        this._width = size.x;
        this._height = size.y;

        this._el.style.width = this._width + 'px';
        this._el.style.height = this._height + 'px';

        this._heatmap._renderer.setDimensions(this._width, this._height);
      }
      this._draw();
    },

    _cssTransform() {
      var div = document.createElement('div');
      var props = [
        'transform',
        'WebkitTransform',
        'MozTransform',
        'OTransform',
        'msTransform'
      ];

      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if (div.style[prop] !== undefined) {
          return prop;
        }
      }

      return props[0];
    }

  });

}

export default HeatmapLayer;
