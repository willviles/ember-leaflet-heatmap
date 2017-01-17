import Ember from 'ember';
import HeatmapLayer from '../layers/heatmap-layer';
import layout from '../templates/components/heatmap-layer';
import BaseLayer from 'ember-leaflet/components/base-layer';
import { ParentMixin } from 'ember-composability-tools';

const { get } = Ember;

export default BaseLayer.extend(ParentMixin, {

  layout: layout,

	leafletOptions: [
	  'backgroundColor', 'blur', 'gradient', 'latField', 'lngField', 'maxOpacity', 'minOpacity', 'radius', 'scaleRadius', 'useLocalExtrema', 'latField', 'lngField', 'valueField'
	],

	leafletEvents: [
    // Heatmap events
	  'addData'
	],

	createLayer(){
    return new HeatmapLayer(get(this, 'options'));
	}

});
