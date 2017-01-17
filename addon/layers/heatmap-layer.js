/* global L */
import Ember from 'ember';
import h337 from 'heatmap.js';

/*
* Leaflet Heatmap Overlay (Modified)
*
* Modification of the following plugin by Will Viles, 2016.
*
* Copyright (c) 2014, Patrick Wied (http://www.patrick-wied.at)
* Dual-licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and the Beerware (http://en.wikipedia.org/wiki/Beerware) license.
*/

const { get, isArray, isEmpty, merge } = Ember;

if (typeof L.Layer === 'undefined') { L.Layer = L.Class; }

export default L.Layer.extend({

  initialize(config) {
    this.cfg = Ember.Object.create(config);
    this._el = L.DomUtil.create('div', 'leaflet-zoom-hide');
    this._data = Ember.A([]);
    this._max = 1;
    this._min = 0;
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
    if (!this._map) { return; }

    const mapPane = this._map.getPanes().mapPane;
    const point = mapPane._leaflet_pos;

    // reposition the layer
    this._el.style[this._cssTransform] = 'translate(' +
      -Math.round(point.x) + 'px,' +
      -Math.round(point.y) + 'px)';

    this._update();
  },

  _update() {

    let bounds = this._map.getBounds(),
        zoom = this._map.getZoom(),
        scale = Math.pow(2, zoom);

    let generatedData = { max: this._max, min: this._min, data: [] };

    if (isEmpty(this._data)) {
      if (!this._heatmap) { return; }
      this._heatmap.setData(generatedData);
      return;
    }

    const valueField = this.cfg.getWithDefault('valueField', 'value');

    let latLngPoints = [],
        radiusMultiplier = get(this.cfg, 'scaleRadius') ? scale : 1,
        localMax = 0, localMin = 0;

    this._data.forEach((data) => {
      const value = get(data, valueField);
      const latlng = get(data, 'latlng');

      // we don't wanna render points that are not even on the map ;-)
      if (!bounds.contains(latlng)) { return; }

      // local max is the maximum within current bounds
      localMax = Math.max(value, localMax);
      localMin = Math.min(value, localMin);

      let point = this._map.latLngToContainerPoint(latlng),
          latlngPoint = {
            x: Math.round(point.x),
            y: Math.round(point.y),
            [valueField]: value,
            radius: data.radius ? data.radius * radiusMultiplier : (this.cfg.radius || 2) * radiusMultiplier
          };

      latLngPoints.push(latlngPoint);

    });

    if (this.cfg.useLocalExtrema) {
      generatedData.max = localMax;
      generatedData.min = localMin;
    }

    generatedData.data = latLngPoints;

    this._heatmap.setData(generatedData);

  },

  setData(data) {
    this._max = data.max || this._max;
    this._min = data.min || this._min;
    var latField = this.cfg.latField || 'lat';
    var lngField = this.cfg.lngField || 'lng';
    var valueField = this.cfg.valueField || 'value';

    // transform data to latlngs
    data = data.data;
    var len = data.length;
    var d = Ember.A([]);

    while (len--) {
      var entry = data[len];
      var latlng = new L.LatLng(entry[latField], entry[lngField]);
      var dataObj = { latlng: latlng };
      dataObj[valueField] = entry[valueField];
      if (entry.radius) {
        dataObj.radius = entry.radius;
      }
      d.pushObject(dataObj);
    }

    this._data = d;

    this._draw();

  },

  addData(data) {

    if (isArray(data)) {
      data.forEach((d) => { this.addData(d); });
      return;
    }

    const latField = this.cfg.getWithDefault('latField', 'lat');
    const lngField = this.cfg.getWithDefault('lngField', 'lng');
    const valueField = this.cfg.getWithDefault('valueField', 'value');

    const lat = get(data, latField);
    const lng = get(data, lngField);
    const value = get(data, valueField);

    this._max = Math.max(this._max, value);
    this._min = Math.min(this._min, value);

    this._data.pushObject({
      latlng: new L.LatLng(lat, lng),
      [valueField]: value,
      radius: data.radius ? get(data, 'radius') : null,
      stamp: data.stamp
    });

    this._draw();

  },

  removeData(data) {
    let dataToRemove = this._data.findBy('stamp', data.stamp);

    if (!dataToRemove) { return; }

    this._data.removeObject(dataToRemove);

    this._draw();
  },

  changeData(data) {
    let dataToChange = this._data.findBy('stamp', data.stamp);

    if (!dataToChange) { return; }

    this._data.removeObject(dataToChange);

    this.addData(merge(dataToChange, data));

  },

  // This function is added for adding Heatmap marker layers

  addLayer(layer) {
    layer._heatmap = this;
    this.addData(layer._data);

  },

  removeLayer(layer) {
    this.removeData(layer._data);

  },

  updateLayer(layer) {
    this.changeData(layer._data);
  },

  _reset() {
    this._origin = this._map.layerPointToLatLng(new L.Point(0, 0));

    // Fix for map positioning
    L.DomUtil.setPosition(this._el, this._map.containerPointToLayerPoint([0, 0]));

    var size = this._map.getSize();
    if (this._width !== size.x || this._height !== size.y) {
      this._width  = size.x;
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
