import Ember from 'ember';
import HeatmapLayer from '../layers/heatmap-layer';
import BaseLayer from 'ember-leaflet/components/base-layer';
import { ParentMixin } from 'ember-composability-tools';

const { get, run } = Ember;

let willUpdateData;

export default BaseLayer.extend(ParentMixin, {

	leafletOptions: [
	  'backgroundColor', 'blur', 'gradient', 'latField', 'lngField', 'maxOpacity', 'minOpacity', 'radius', 'scaleRadius', 'useLocalExtrema', 'valueField', 'maxValue', 'minValue'
	],

	createLayer(){
    return new HeatmapLayer(get(this, 'options'));

	},

  didCreateLayer() {
    get(this, '_layer').updateData(get(this, 'data'));

    this.setDataObservers();

  },

  setDataObservers() {
    Ember.A(['lat', 'lng', 'value']).forEach((property) => {
      property = this.getWithDefault(`${property}Field`, property);
      this.addObserver(`data.@each.${property}`, this.dataPropertyChange);
    });

    this.addObserver('data.[]', this.dataLengthChange);
  },

  dataLengthChange() { this._updateData(); },
  dataPropertyChange() { this._updateData(); },

  _updateData() {

    run.cancel(willUpdateData);

    willUpdateData = run.later(this, () => {
      get(this, '_layer').updateData(get(this, 'data'));
    }, 250);

  }

});
