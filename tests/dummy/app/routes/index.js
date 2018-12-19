import Route from '@ember/routing/route';

import { A } from '@ember/array';
import { debug } from "@ember/debug"
import { computed, get, set, setProperties } from '@ember/object';
import { next } from '@ember/runloop';

import faker from 'faker';

export default Route.extend({

  setupController(controller/*, model*/) {

    setProperties(controller, {
      lat: 45.52315708200585,
      lng: -122.68260955810545,
      zoom: 15,
      showHeatmap: true,
      showMarkers: true,
      heatmapOptions: get(this, 'heatmapOptions'),
      markers: get(this, 'markers')
    });

  },

  numMarkers: 500,

  markers: computed(function() {

    let markers = A([]);

    for (let i=0; i < get(this, 'numMarkers'); i++) {
      markers.pushObject({
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        risk: faker.random.number({ min: 0, max: 100 }) / 100,
      });

    }

    markers.pushObjects([{
      lat: 45.52315708200585,
      lng: -122.68260955810545,
      risk: 1
    }, {
      lat: 45.521533419593,
      lng: -122.6601219177246,
      risk: 0.5
    }, {
      lat: 45.51992474488168,
      lng: -122.7011489868164,
      risk: 0.2
    }, {
      lat: 45.520075090261074,
      lng: -122.70029067993163,
      risk: 0.8
    }]);

    return markers;
  }),

  init() {
    this._super(...arguments);
    set(this, 'heatmapOptions', {
      // scaleRadius: true,
      radius: 100,
      // useLocalExtrema: true,
      blur: 1,
      maxOpacity: 1,
      minOpacity: 0,
      // maxValue: 2,
      // minValue: 1,
      valueField: 'risk',
      gradient: {
        '0': '#ffcf4e',
        '0.5': '#ff934e',
        '.8': '#ff585b',
        '0.95': '#ffffff'
      }
    });
  },

  actions: {

    changeData() {
      get(this, 'markers').forEach((marker) => {
        setProperties(marker, {
          lat: faker.address.latitude(),
          lng: faker.address.longitude(),
          risk: faker.random.number({ min: 0, max: 100 }) / 100,
        });

      });

    },

    addData() {
      get(this, 'markers').pushObject({
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        risk: faker.random.number({ min: 0, max: 100 }) / 100,
      });

    },

    updateCoords(e) {
      const center = e.target.getCenter();
      const controller = get(this, 'controller');

      next(() => {
        setProperties(controller, {
          lat: center.lat,
          lng: center.lng,
          zoom: e.target._zoom
        });

        debug(`Lat: ${center.lat} Lng: ${center.lng}`);

      });

    }

  }
});
