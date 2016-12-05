# Ember Leaflet Heatmap

Offers [Heatmap.js](https://www.patrick-wied.at/static/heatmapjs/) functionality for [Ember-Leaflet](http://ember-leaflet.com), an Ember Addon for [Leaflet](http://leafletjs.com) interactive maps.

## Installation

* `ember install ember-leaflet-heatmap`

## Basic setup

Add the `{{heatmap-layer}}` within your `{{leaflet-map}}` component and pass data to it in the format Heatmap.js expects. View the [example data](https://www.patrick-wied.at/static/heatmapjs/docs.html#heatmap-addData).

```handlebars
{{#leaflet-map lat=lat lng=lng zoom=zoom}}

  {{tile-layer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"}}

  {{heatmap-layer data=heatmapData}}

{{/leaflet-map}}
```

## Options

All [Heatmap.js options](https://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create) can be passed into the component. Some examples are below:

```handlebars
{{heatmap-layer data=heatmapData
                backgroundColor="#FFFFFF"
                maxOpacity=0.5
                blur=0.85}}
```

## Contextual Component support

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

Next, override the template with the components you need. For a full list of built-in components, (click here)[https://github.com/miguelcobain/ember-leaflet/blob/master/addon/templates/current/leaflet-map.hbs].

```handlebars
{{yield (hash
  heat-map=(component "tile-layer" parentComponent=this)
)}}
```

Then, you can use it in your templates like so:

```handlebars
{{#your-map lat=lat lng=lng zoom=zoom as |layers|}}
  {{layers.heat-map data=heatmapData}}
{{/your-map}}
```

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
