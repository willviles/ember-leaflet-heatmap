Ember Leaflet Heatmap [![npm](https://img.shields.io/npm/v/ember-leaflet-heatmap.svg)](https://www.npmjs.com/package/ember-leaflet-heatmap)
======

Offers [Heatmap.js](https://www.patrick-wied.at/static/heatmapjs/) functionality for [Ember-Leaflet](http://ember-leaflet.com), an Ember Addon for [Leaflet](http://leafletjs.com) interactive maps.

## Installation

`ember install ember-leaflet-heatmap`

## Usage

### Setup

To setup the heatmap, simply add the `heatmap-layer` component and pass in an Ember Array of data. By default, Ember Leaflet Heatmap will grab `lat`, `lng` and `value` properties from each item in your array. It will listen to all array changes and automatically update the heatmap.

```handlebars
{{#leaflet-map lat=lat lng=lng zoom=zoom}}

  {{tile-layer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"}}

  {{heatmap-layer data=data options=options}}

{{/leaflet-map}}
```

If your data doesn't have `lat`, `lng` or `value` keys, you can set the correct property key references like so:

```handlebars
{{heatmap-layer data=data latField="latitude" lngField="longitude" valueField="risk"}}
```

### Options

All [Heatmap.js options](https://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create) can be passed into the component, either as individual values or in an options hash. Some examples are below:

```handlebars
{{heatmap-layer data=data
                backgroundColor="#FFFFFF"
                maxOpacity=0.5
                blur=0.85}}
```

### Contextual Component support

[Ember-Leaflet](http://ember-leaflet.com) now makes use of contextual components in Ember. However, only the built in child components are defined out-of-the-box:

```handlebars
{{#leaflet-map lat=lat lng=lng zoom=zoom as |layers|}}
  <!-- layers.heat-map undefined -->
{{/leaflet-map}}
```

To use Ember Leaflet Heatmap as a contextual component, extend the base leaflet-map component into a custom component of your own.

```javascript
// your-map.js
import LeafletMap from 'ember-leaflet/components/leaflet-map';

export default LeafletMap.extend({
  // Add options here
});
```

Next, override the template with the components you need. For a full list of built-in components, [click here](https://github.com/miguelcobain/ember-leaflet/blob/master/addon/templates/current/leaflet-map.hbs).

```handlebars
{{yield (hash
  heatmap=(component "heatmap-layer" parentComponent=this)
)}}
```

Then, you can use it in your templates like so:

```handlebars
{{#your-map lat=lat lng=lng zoom=zoom as |layers|}}

  {{layers.heatmap data=data options=options}}

{{/your-map}}
```

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `yarn test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
