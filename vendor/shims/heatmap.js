/* eslint-env node:true */
/* globals define, self */

(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['h337'],
      __esModule: true,
    };
  }

  define('heatmap.js', [], vendorModule);
})();
