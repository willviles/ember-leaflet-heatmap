import EmberLeafletBaseLayer from 'ember-leaflet/components/base-layer';
import HeatmapLayer from '../layers/heatmap-layer';

import { A } from '@ember/array';
import { get } from '@ember/object';
import { next } from '@ember/runloop';

export default EmberLeafletBaseLayer.extend({

  leafletOptions: Object.freeze([
      'backgroundColor', 'blur', 'gradient', 'latField', 'lngField', 'maxOpacity', 'minOpacity', 'radius', 'scaleRadius', 'useLocalExtrema', 'valueField', 'maxValue', 'minValue'
  ]),

  createLayer(){
    return new HeatmapLayer(get(this, 'options'));
	},

  didCreateLayer() {
    get(this, '_layer').updateData(get(this, 'data'));

    this.setDataObservers();

  },

  setDataObservers() {
    A(['lat', 'lng', 'value']).forEach((property) => {
      property = this.get(`${property}Field`) ?? property;
      this.addObserver(`data.@each.${property}`, this.dataPropertyChange);
    });

    this.addObserver('data.[]', this.dataLengthChange);
  },

  dataLengthChange() { this._updateData(); },
  dataPropertyChange() { this._updateData(); },

  _updateData() {
    next(() => {
      get(this, '_layer').updateData(get(this, 'data'))
    });
  }

});
