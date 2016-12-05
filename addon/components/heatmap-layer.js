import Ember from 'ember';
import BaseLayer from 'ember-leaflet/components/base-layer';
import { ParentMixin } from 'ember-composability-tools';

const { get } = Ember;

export default BaseLayer.extend(ParentMixin, {

  leafletRequiredOptions: ['data'],

	leafletOptions: [
	  'backgroundColor', 'blur', 'gradient', 'latField', 'lngField', 'maxOpacity', 'minOpacity', 'radius', 'scaleRadius', 'useLocalExtrema', 'valueField'
	],

	leafletEvents: [
	  'addData'
	],

  didUpdateAttrs({ newAttrs }) {
    if (newAttrs.data) {
      get(this, '_layer').setData(newAttrs.data.value);
    }
  },

	createLayer(){
    return new L.HeatmapOverlay(get(this, 'options'));
	},

  didCreateLayer() {
    get(this, '_layer').setData(get(this, 'data'));
  }

});
