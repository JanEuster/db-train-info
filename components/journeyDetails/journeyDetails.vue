<script lang="ts" type="module">
import { defineComponent } from "vue";
import { TrainWithDetails } from "../types";
import { HTMLEntityStringToUTF8 as toUTF8 } from "../functions";
import journeyStation from "./journeyStation.vue";

export default defineComponent({
  components: { journeyStation },
  props: {
    trainResult: { type: Object },
  },
  data() {
    return {
      toUTF8,
    };
  },
  methods: {
    setTrain(train: TrainWithDetails) {
      if (train === undefined) {
        return false;
      }
      return true;
    },
  },
});
</script>

<template>
  <div v-if="trainResult" class="journey-details-wrapper">
    <header @train-result="setTrain($event)">
      <h1>{{ toUTF8(trainResult.name) }}</h1>
      <h2>
        {{ toUTF8(trainResult.details[0].stopName) }} <span class="tight">-----</span>
        {{ toUTF8(trainResult.details[trainResult.details.length - 1].stopName) }}
      </h2>
    </header>
    <ul class="journey-stations">
      <journeyStation
        v-for="(station, i) in trainResult.details"
        :key="i"
        :stationDetails="station"
      />
    </ul>
  </div>
</template>

<style lang="scss">
.journey-details-wrapper {
  display: inline-block;
  border: 3px solid black;
  min-width: 400px;
  max-width: 100%;
  padding: 4px 8px;
  min-height: 100%;
  max-height: 100%;

  h1 {
    font-size: 22px;
    line-height: 22px;
    font-weight: 800;
  }

  h2 {
    font-size: 18px;
    line-height: 18px;
    font-weight: 600;
    font-style: italic;
  }
}

.journey-stations {
  margin-top: 10px;
  padding-left: 50px;

  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 3px;
    left: calc(50px + 3px);
    height: calc(100% - 18px);
    transform: translateY(9px);
    background: black;
  }
}
</style>
