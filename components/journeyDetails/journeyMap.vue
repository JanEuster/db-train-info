<script lang="ts">
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM, { ATTRIBUTION } from "ol/source/OSM";
import Feature from "ol/Feature";
import { FeatureLike } from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import XYZ from "ol/source/XYZ";
import { LineString, Point } from "ol/geom";
import { Circle, Text } from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import { StyleLike } from "ol/style/Style";

import Stroke from "ol/style/Stroke";
import { fromLonLat } from "ol/proj";
import Fill from "ol/style/Fill";

import { HTMLEntityStringToUTF8 as toUTF8 } from "../functions";

export default {
  name: "MapContainer",
  components: {},
  props: {
    stations: { type: Array, required: true },
  },
  mounted() {
    // eslint-disable-next-line no-new
    let map = new Map({
      // the map will be created using the 'map-root' ref
      target: this.$refs["map-root"],
      layers: [
        // adding a background tiled layer
        new TileLayer({
          source: new OSM(), // tiles are served by OpenStreetMap
        }),
      ],

      // the map view will initially show the whole world
      view: new View({
        zoom: 5,
        center: fromLonLat([10.454, 51.351]),
        constrainResolution: true,
      }),
    });
    const points: number[][] = [];
    for (const station of this.stations) {
      points.push(fromLonLat([station.lon, station.lat]));
    }
    const lineFeatures: Feature[] = [
      new Feature({
        geometry: new LineString(points),
      }),
    ];
    for (const station of this.stations) {
      lineFeatures.push(
        new Feature({
          geometry: new Point(fromLonLat([station.lon, station.lat])),
          labelPoint: new Point(fromLonLat([station.lon, station.lat])),
          name: toUTF8(station.stopName),
        })
      );
    }

    const lineSource = new VectorSource({
      features: lineFeatures,
    });
    const fill = new Fill({
      color: "#ADFF2F",
    });
    const stroke = new Stroke({
      color: "rgba(0,0,0, 0.7)",
      width: 2.5,
    });
    const getText = (feature: Feature, resolution: number) => {
      return resolution < 2100
        ? new Text({
            textAlign: "left",
            textBaseline: "middle",
            font: "10px Arial",
            text: feature.get("name"),
            fill: new Fill({ color: "white" }),
            stroke: new Stroke({ color: "black", width: 5 }),
            offsetX: 12,
            offsetY: 0,
            placement: "point",
            maxAngle: 0,
            overflow: false,
            rotation: 0,
          })
        : null;
    };

    const lineLayer = new VectorLayer({
      source: lineSource,
      style(feature: FeatureLike, resolution: number): void | Style | Style[] {
        const geo = feature.getGeometry();
        if (geo instanceof LineString) {
          return new Style({
            stroke,
          });
        } else if (geo instanceof Point) {
          return new Style({
            image: new Circle({
              radius: 5,
              fill,
              stroke,
            }),
            text: getText(feature as Feature<Geometry>, resolution) ?? undefined,
          });
        }
      },
    });

    // remove old map
    this.$refs["map-root"].innerHTML = "";

    // eslint-disable-next-line no-new
    const osmRail = new TileLayer({
      visible: true,
      source: new XYZ({
        attributions: [ATTRIBUTION],
        url: "http://{a-c}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
        crossOrigin: null, // make it work inside canvas
        tilePixelRatio: 2, // server returns 512px img for 256 tiles
        maxZoom: 19, // XYZ's default is 18
        opaque: true,
      }),
    });
    osmRail.setOpacity(0.5);

    map = new Map({
      // the map will be created using the 'map-root' ref
      target: this.$refs["map-root"],
      layers: [
        // adding a background tiled layer
        new TileLayer({
          source: new OSM(),
        }),
        osmRail,
        lineLayer,
      ],

      // the map view will initially show the whole world
      view: new View({
        zoom: 5,
        center: fromLonLat([10.454, 51.351]),
        constrainResolution: true,
      }),
    });
  },
};
</script>

<template>
  <div id="journey-map" ref="map-root"></div>
</template>

<style lang="scss">
#journey-map {
  width: 100%;
  height: 420px;
  max-height: 70vh;
  margin-top: 12px;
}

// copy paste map styles
.ol-box {
  box-sizing: border-box;
  border-radius: 2px;
  border: 1.5px solid rgb(179, 197, 219);
  background-color: rgba(255, 255, 255, 0.4);
}

.ol-mouse-position {
  top: 8px;
  right: 8px;
  position: absolute;
}

.ol-scale-line {
  background: rgba(0, 60, 136, 0.3);
  border-radius: 4px;
  bottom: 8px;
  left: 8px;
  padding: 2px;
  position: absolute;
}

.ol-scale-line-inner {
  border: 1px solid #eee;
  border-top: none;
  color: #eee;
  font-size: 10px;
  text-align: center;
  margin: 1px;
  will-change: contents, width;
  transition: all 0.25s;
}

.ol-scale-singlebar-even {
  background-color: #000000;
}

.ol-scale-singlebar-odd {
  background-color: #ffffff;
}

.ol-scale-bar {
  position: absolute;
  bottom: 8px;
  left: 8px;
}

.ol-scale-step-marker {
  width: 1px;
  height: 15px;
  background-color: #000000;
  float: right;
  z-index: 10;
}

.ol-scale-step-text {
  position: absolute;
  bottom: -5px;
  font-size: 12px;
  z-index: 11;
  color: #000000;
  text-shadow: -2px 0 #ffffff, 0 2px #ffffff, 2px 0 #ffffff, 0 -2px #ffffff;
}

.ol-scale-text {
  position: absolute;
  font-size: 14px;
  text-align: center;
  bottom: 25px;
  color: #000000;
  text-shadow: -2px 0 #ffffff, 0 2px #ffffff, 2px 0 #ffffff, 0 -2px #ffffff;
}

.ol-scale-singlebar {
  position: relative;
  height: 10px;
  z-index: 9;
  box-sizing: border-box;
  border: 1px solid black;
}

.ol-unsupported {
  display: none;
}

.ol-viewport,
.ol-unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.ol-viewport canvas {
  all: unset;
}

.ol-selectable {
  -webkit-touch-callout: default;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.ol-grabbing {
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
  cursor: grabbing;
}

.ol-grab {
  cursor: move;
  cursor: -webkit-grab;
  cursor: -moz-grab;
  cursor: grab;
}

.ol-control {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  padding: 2px;
}

.ol-control:hover {
  background-color: rgba(255, 255, 255, 0.6);
}

.ol-zoom {
  top: 0.5em;
  left: 0.5em;
}

.ol-rotate {
  top: 0.5em;
  right: 0.5em;
  transition: opacity 0.25s linear, visibility 0s linear;
}

.ol-rotate.ol-hidden {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s linear, visibility 0s linear 0.25s;
}

.ol-zoom-extent {
  top: 4.643em;
  left: 0.5em;
}

.ol-full-screen {
  right: 0.5em;
  top: 0.5em;
}

.ol-control button {
  display: block;
  margin: 1px;
  padding: 0;
  color: white;
  font-weight: bold;
  text-decoration: none;
  font-size: inherit;
  text-align: center;
  height: 1.375em;
  width: 1.375em;
  line-height: 0.4em;
  background-color: rgba(0, 60, 136, 0.5);
  border: none;
  border-radius: 2px;
}

.ol-control button::-moz-focus-inner {
  border: none;
  padding: 0;
}

.ol-zoom-extent button {
  line-height: 1.4em;
}

.ol-compass {
  display: block;
  font-weight: normal;
  font-size: 1.2em;
  will-change: transform;
}

.ol-touch .ol-control button {
  font-size: 1.5em;
}

.ol-touch .ol-zoom-extent {
  top: 5.5em;
}

.ol-control button:hover,
.ol-control button:focus {
  text-decoration: none;
  background-color: rgba(0, 60, 136, 0.7);
}

.ol-zoom .ol-zoom-in {
  border-radius: 2px 2px 0 0;
}

.ol-zoom .ol-zoom-out {
  border-radius: 0 0 2px 2px;
}

.ol-attribution {
  text-align: right;
  bottom: 0.5em;
  right: 0.5em;
  max-width: calc(100% - 1.3em);
  display: flex;
  flex-flow: row-reverse;
  align-items: center;
}

.ol-attribution a {
  color: rgba(0, 60, 136, 0.7);
  text-decoration: none;
}

.ol-attribution ul {
  margin: 0;
  padding: 1px 0.5em;
  color: #000;
  text-shadow: 0 0 2px #fff;
  font-size: 12px;
}

.ol-attribution li {
  display: inline;
  list-style: none;
}

.ol-attribution li:not(:last-child):after {
  content: " ";
}

.ol-attribution img {
  max-height: 2em;
  max-width: inherit;
  vertical-align: middle;
}

.ol-attribution button {
  flex-shrink: 0;
}

.ol-attribution.ol-collapsed ul {
  display: none;
}

.ol-attribution:not(.ol-collapsed) {
  background: rgba(255, 255, 255, 0.8);
}

.ol-attribution.ol-uncollapsible {
  bottom: 0;
  right: 0;
  border-radius: 4px 0 0;
}

.ol-attribution.ol-uncollapsible img {
  margin-top: -0.2em;
  max-height: 1.6em;
}

.ol-attribution.ol-uncollapsible button {
  display: none;
}

.ol-zoomslider {
  top: 4.5em;
  left: 0.5em;
  height: 200px;
}

.ol-zoomslider button {
  position: relative;
  height: 10px;
}

.ol-touch .ol-zoomslider {
  top: 5.5em;
}

.ol-overviewmap {
  left: 0.5em;
  bottom: 0.5em;
}

.ol-overviewmap.ol-uncollapsible {
  bottom: 0;
  left: 0;
  border-radius: 0 4px 0 0;
}

.ol-overviewmap .ol-overviewmap-map,
.ol-overviewmap button {
  display: block;
}

.ol-overviewmap .ol-overviewmap-map {
  border: 1px solid #7b98bc;
  height: 150px;
  margin: 2px;
  width: 150px;
}

.ol-overviewmap:not(.ol-collapsed) button {
  bottom: 2px;
  left: 2px;
  position: absolute;
}

.ol-overviewmap.ol-collapsed .ol-overviewmap-map,
.ol-overviewmap.ol-uncollapsible button {
  display: none;
}

.ol-overviewmap:not(.ol-collapsed) {
  background: rgba(255, 255, 255, 0.8);
}

.ol-overviewmap-box {
  border: 2px dotted rgba(0, 60, 136, 0.7);
}

.ol-overviewmap .ol-overviewmap-box:hover {
  cursor: move;
}
</style>
