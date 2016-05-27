# Ember-leaflet-heatmap

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
