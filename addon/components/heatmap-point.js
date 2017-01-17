import Ember from 'ember';
import HeatmapPointLayer from '../layers/heatmap-point';
import BaseLayer from 'ember-leaflet/components/base-layer';
import { ChildMixin } from 'ember-composability-tools';

const { get, getProperties } = Ember;

export default BaseLayer.extend(ChildMixin, {

  tagName: '',

  leafletRequiredOptions: ['lat', 'lng', 'value'],

  didUpdateAttrs({ newAttrs }) {
    if (newAttrs) {
      get(this, '_layer').updateData(newAttrs);
    }

  },

	createLayer() {

    const { lat, lng, value } = getProperties(this, 'lat', 'lng', 'value');

    return new HeatmapPointLayer(get(this, 'options'), {
      lat, lng, value,
      stamp: `lat=${lat}&lng=${lng}&val=${value}`
    });

	},

});
