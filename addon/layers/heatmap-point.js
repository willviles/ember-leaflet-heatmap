/* global L */

if (typeof L.Layer === 'undefined') { L.Layer = L.Class; }

export default L.Layer.extend({
  initialize(config, data) {
    this._data = data;

  },

  updateData(data) {
    this._data.lat = data.lat ? data.lat.value : this._data.lat;
    this._data.lng = data.lng ? data.lng.value : this._data.lng;
    this._data.value = data.value ? data.value.value : this._data.value;

    this._heatmap.updateLayer(this);

  }

});
