<script lang="ts" type="module">
import { defineComponent } from "vue";
import {format} from "date-fns"
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
    longDate(dateTime: string) {
      return format(new Date(dateTime), "PPPP")
    },
    setTrain(train: TrainWithDetails) {
      if (train === undefined) {
        return false;
      }
      return true;
    },
    getStationPos(): string[][] {
      if (this.trainResult) {
        const pos: string[][] = [];
        for (let station of (this.trainResult as TrainWithDetails).details) {
          pos.push([station.lon, station.lat]);
        }
        return pos
      }
      return []
    }
  },
});
</script>

<template>
  <div v-if="trainResult.details && trainResult" class="journey-details-wrapper result-field">
    <header @train-result="setTrain($event)">
      <h1>{{ toUTF8(trainResult.name) }}</h1>
      <h2>
        {{ toUTF8(trainResult.details[0].stopName) }} <span class="tight">-------</span>
        {{ toUTF8(trainResult.details[trainResult.details.length - 1].stopName) }}
      </h2>
      <h3>
        {{ longDate(trainResult.dateTime) }}
        <br />
        <b
          >{{ trainResult.details[0].depTime }}
          <span class="tight">---------</span>
          {{ trainResult.details[trainResult.details.length - 1].arrTime }}</b
        >
      </h3>
    </header>
    <journeyMap :stations="trainResult.details" class="map" />
    <div class="journey-stations-outer">
      <div class="journey-stations">
        <ul>
          <journeyStation
            v-for="(station, i) in trainResult.details"
            :key="i"
            :stationDetails="station"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.journey-details-wrapper {
  display: flex;
  flex-direction: column;
  min-width: 550px;
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
  h3 {
    margin-top: 5px;
    font-size: 15px;
    line-height: 1.1;
  }
}

.map {
  flex-basis: 5;
  margin-bottom: 15px;
}

.journey-stations-outer {
  flex-basis: 1;
  overflow-y: hidden;
  position: relative;
  height: 400px;

  border-top: 2px solid black;
  border-bottom: 2px solid black;
}

.journey-stations {
  padding-left: 50px;
  max-height: 100%;

  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  & ul {
    position: relative;
  }

  & ul::before {
    content: "";
    position: absolute;
    width: 3px;
    height: 100%;
    left: 3px;
    height: calc(100% - 18px);
    transform: translateY(9px);
    background: black;
  }
}
</style>
