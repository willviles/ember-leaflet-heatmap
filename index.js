'use strict';

const BroccoliDebug = require('broccoli-debug');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const path = require('path');
const fastbootTransform = require('fastboot-transform');

module.exports = {
  name: 'ember-leaflet-heatmap',

  included(app) {

    app.import(this.treePaths.vendor + '/heatmap.js/heatmap.js');

    app.import('vendor/shims/heatmap.js', {
      exports: {
        ['heatmap.js']: ['default']
      }
    });

    return this._super.included.apply(this, arguments);
  },

  treeForVendor(vendorTree) {
    let debugTree = BroccoliDebug.buildDebugCallback(this.name),
        trees = [];

    if (vendorTree) {
      trees.push(
        debugTree(vendorTree, 'vendorTree')
      );
    }

    let js = fastbootTransform(
      moduleToFunnel('heatmap.js')
    );

    trees.push(
      debugTree(js, 'js')
    );

    return mergeTrees(trees);
  }

};

function moduleToFunnel(moduleName) {
  return new Funnel(resolveModulePath(moduleName), {
    destDir: 'heatmap.js',
    include: [new RegExp(/\.js$/)]
  });
}

function resolveModulePath(moduleName) {
  return path.dirname(require.resolve(moduleName));
}
