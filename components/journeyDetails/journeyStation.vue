<script lang="ts">
import { PropType } from "vue";
import { StationDetails } from "../types";
import { HTMLEntityStringToUTF8 as toUTF8 } from "../functions";

export default {
  props: {
    stationDetails: undefined,
  },
  data() {
    return {
      toUTF8,
    };
  },
};
</script>

<template>
  <div class="station-wrapper">
    <span class="before">{{ stationDetails.depTime ?? stationDetails.arrTime }} </span>
    <h3>{{ toUTF8(stationDetails.stopName) }} <sub>stopId: {{ stationDetails.stopId }}</sub></h3>
  </div>
</template>

<style lang="scss">
.station-wrapper {
  position: relative;
  
  &>* {
    padding-left: 20px;
  }

  .before {
    position: absolute;
    left: -68px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background: white;
    border: 3px solid black;
    border-radius: 50%;
  }

  h3 {
    position: relative;
  }
  h3 sub {
    position: absolute;
    right: 5px;
    top: 50%;
    height: 100%;
    font-size: 10px;
  }
}
</style>
