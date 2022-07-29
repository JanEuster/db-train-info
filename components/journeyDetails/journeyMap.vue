<script lang="ts">
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import { LineString, MultiPoint } from "ol/geom";
import { Circle } from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import "ol/ol.css";

import Stroke from "ol/style/Stroke";
import { fromLonLat } from "ol/proj";
import Fill from "ol/style/Fill";

import { HTMLEntityStringToUTF8 as toUTF8 } from "../functions";

export default {
    name: "MapContainer",
    components: {},
    props: {
        stationNames: { type: Array, required: true },
    },
    async mounted() {
        // eslint-disable-next-line no-new
        new Map({
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
        // this is where we create the OpenLayers map
        const points: number[][] = [];
        for (const station of this.stationNames as string[]) {
            await fetch(`https://nominatim.openstreetmap.org/search?q=${toUTF8(station)}&format=json`)
                .then((value) => value.json())
                .then((json) => {
                    const location = json[0];

                    points.push(fromLonLat([Number(location.lon), Number(location.lat)]));
                });
        }
        const lineFeatures: Feature[] = [
            new Feature({
                geometry: new LineString(points),
            }),
            new Feature({
                geometry: new MultiPoint(points),
            }),
        ];
        const lineSource = new VectorSource({
            features: lineFeatures,
        });
        const fill = new Fill({
            color: "#ADFF2F",
        });
        const stroke = new Stroke({
            color: "black",
            width: 2.5,
        });
        const lineLayer = new VectorLayer({
            source: lineSource,
            style(feature, resolution) {
                const geo = feature.getGeometry();
                if (geo instanceof LineString) {
                    return new Style({
                        stroke,
                    });
                } else if (geo instanceof MultiPoint) {
                    return new Style({
                        image: new Circle({
                            radius: 5,
                            fill,
                            stroke,
                        }),
                    });
                }
            },
        });

        // remove old map
        this.$refs["map-root"].innerHTML = "";

        // eslint-disable-next-line no-new
        new Map({
            // the map will be created using the 'map-root' ref
            target: this.$refs["map-root"],
            layers: [
                // adding a background tiled layer
                new TileLayer({
                    source: new OSM(), // tiles are served by OpenStreetMap
                }),
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
    height: 300px;
    margin-top: 12px;
}
</style>
