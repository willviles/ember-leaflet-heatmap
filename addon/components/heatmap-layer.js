import Ember from 'ember';
import BaseLayer from 'ember-leaflet/components/base-layer';
import { ParentMixin } from 'ember-composability-tools';

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
      this.get('_layer').setData(newAttrs.data.value);
    }
  },

	createLayer(){
    return new L.HeatmapOverlay(this.get('options'));
	},

  layerSetup() {
		if (Ember.isNone(this.get('_layer'))) {
			this._layer = this.createLayer();
      this._layer.setData(this.get('data'));
			this._addObservers();
			this._addEventListeners();
			this.didCreateLayer();
		}
		if (this.get('containerLayer')) {
			if (!Ember.isNone(this.get('containerLayer')._layer)) {
				this.get('containerLayer')._layer.addLayer(this._layer);
			}
		}
	},

	didInsertElement() {
		this._super(...arguments);
		this.layerSetup();
	}
});
