import Ember from 'ember';
import faker from 'faker';

const { computed, get, setProperties } = Ember;

export default Ember.Route.extend({

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

  markers: computed(function() {

    let markers = Ember.A([]);

    for (let i=0; i < 100; i++) {
      markers.pushObject({
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        value: faker.random.number({ min: 0, max: 100 }) / 100,
      });

    }

    markers.pushObjects([{
      lat: 45.52315708200585,
      lng: -122.68260955810545,
      value: 1
    }, {
      lat: 45.521533419593,
      lng: -122.6601219177246,
      value: 0.5
    }, {
      lat: 45.51992474488168,
      lng: -122.7011489868164,
      value: 0.2
    }, {
      lat: 45.520075090261074,
      lng: -122.70029067993163,
      value: 0.8
    }]);

    return markers;
  }),

  heatmapOptions: {
    // scaleRadius: true,
    radius: 100,
    // useLocalExtrema: true,
    blur: 1,
    maxOpacity: 1,
    minOpacity: 0,
    gradient: {
      '0': '#ffcf4e',
      '0.5': '#ff934e',
      '.8': '#ff585b',
      '0.95': '#ffffff'
    }
  },

  actions: {

    changeData() {
      get(this, 'markers').forEach((marker) => {
        setProperties(marker, {
          lat: faker.address.latitude(),
          lng: faker.address.longitude(),
          value: faker.random.number({ min: 0, max: 100 }) / 100,
        });

      });
    },

    updateCoords(e) {
      const center = e.target.getCenter();
      const controller = get(this, 'controller');

      Ember.run.next(() => {
        setProperties(controller, {
          lat: center.lat,
          lng: center.lng,
          zoom: e.target._zoom
        });

        Ember.debug(`Lat: ${center.lat} Lng: ${center.lng}`);

      });

    }

  }
});
