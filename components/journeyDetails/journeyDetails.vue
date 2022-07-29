<script lang="ts" type="module">
import { defineComponent } from "vue";
import { TrainWithDetails } from "../types";
import { HTMLEntityStringToUTF8 as toUTF8 } from "../functions";
import journeyStation from "./journeyStation.vue";
import journeyMap from "./journeyMap.vue";

export default defineComponent({
  components: { journeyStation, journeyMap },
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
    getStationNames(): string[] {
      if (this.trainResult) {
        const names = [];
        for (let station of (this.trainResult as TrainWithDetails).details) {
          console.log(station.stopName);
          names.push(station.stopName);
        }
        return names
      }
      return []
    }
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
    <journeyMap :stationNames="getStationNames()" class="map" />
    <div class="journey-stations-outer">
      <ul class="journey-stations">
        <journeyStation v-for="(station, i) in trainResult.details" :key="i" :stationDetails="station" />
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.journey-details-wrapper {
  display: flex;
  flex-direction: column;
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

.map {
  flex-basis: 5;
}

.journey-stations-outer {
  margin-top: 10px;
  overflow-y: hidden;
  position: relative;
  flex-basis: 1;
}

.journey-stations {
  padding-left: 50px;

  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

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
