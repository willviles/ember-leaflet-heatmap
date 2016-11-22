/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-leaflet-heatmap',
  included: function(app){
    if (!process.env.EMBER_CLI_FASTBOOT) {
      app.import(app.bowerDirectory + '/heatmap.js-amd/build/heatmap.js');
    	app.import('vendor/leaflet.heatmap.js');
    }
  }
};
