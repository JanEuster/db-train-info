<script>
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM'

// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import 'ol/ol.css'

export default {
    name: 'MapContainer',
    components: {},
    props: {},
    mounted() {
        // this is where we create the OpenLayers map
        // eslint-disable-next-line no-new
        new Map({
            // the map will be created using the 'map-root' ref
            target: this.$refs['map-root'],
            layers: [
                // adding a background tiled layer
                new TileLayer({
                    source: new OSM() // tiles are served by OpenStreetMap
                }),
            ],

            // the map view will initially show the whole world
            view: new View({
                zoom: 0,
                center: [0, 0],
                constrainResolution: true
            }),
        })
    },
}
</script>

<template>
    <div id="journey-map" ref="map-root">
    </div>
</template>

<style lang="scss">
#journey-map {
    width: 100%;
    height: 300px;
}
</style>