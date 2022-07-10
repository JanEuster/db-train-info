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
  <div>
    {{ toUTF8(stationDetails.stopName) }}
  </div>
</template>

<style lang=""></style>
