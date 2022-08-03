<script lang="ts">
import Vue, { ref } from "vue";
import { format } from "date-fns";
import QueryFieldStation from "@/components/queryFieldStation.vue";
import QueryFieldTrain from "@/components/queryFieldTrain.vue";
import JourneyDetails from "~/components/journeyDetails/journeyDetails.vue";
import { Station, TrainWithDetails } from "~/components/types";
import DepartureList from "~/components/departureList.vue";

let stationResult = ref<Station>();
let trainResult = ref<TrainWithDetails>();
let trainURL = ref<string>("");
let trainFieldActive = ref<boolean>(false);

export default Vue.extend({
  name: "IndexPage",
  components: { QueryFieldStation, QueryFieldTrain, JourneyDetails, DepartureList },
  data() {
    return {
      stationResult,
      trainURL,
      trainResult,
      trainFieldActive,
    };
  },
  head() {
    return {
      title: "db-train-info",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "My custom description",
        },
      ],
    };
  },
  methods: {
    setStation(e: Station) {
      console.log(e);
      stationResult.value = e;
      trainResult.value = undefined;

      this.generateTrainURL();
    },
    setTrain(e: TrainWithDetails | undefined) {
      console.log(e);
      trainResult.value = e;
    },
    generateTrainURL() {
      if (stationResult.value) {
        const date = format(new Date(), "yyyy-MM-dd") + "T" + format(new Date(), "HH:mm");
        trainFieldActive.value = true;
        return `https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/departureBoard/${stationResult.value.id}?date=${date}`;
      } else {
        trainFieldActive.value = false;
        return "";
      }
    },
    isTrainActive() {
      return trainFieldActive.value;
    },
  },
});
</script>

<template>
  <div class="app">
    <div class="query-wrapper">
      <div class="query-row">
        <QueryFieldStation @station-result="setStation($event)" />
        <QueryFieldTrain
          :isActive="isTrainActive()"
          :fetchURL="generateTrainURL()"
          @train-result="setTrain($event)"
          :selected="trainResult"
        />
      </div>
      <div class="query-row" v-if="stationResult">
        <DepartureList :departuresURL="generateTrainURL()" @train-result="setTrain($event)" />
      </div>
    </div>
    <JourneyDetails v-if="trainResult" :trainResult="trainResult" />
  </div>
</template>

<style lang="scss">
:root {
  font-family: "Segoe UI", Arial, Helvetica, sans-serif;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.tight {
  letter-spacing: -4px;
}

.app {
  padding: 20px;
  display: flex;
  align-items: flex-start;
  height: 100vh;
}

.query-wrapper {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  max-height: calc(100vh - 40px);

  & > * {
    width: 100%;
  }
}

.query-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

.query-field {
  display: inline-block;
  width: 100%;
  padding: 12px;
  padding-top: 8px;
  padding-bottom: 16px;
  margin: 6px 10px;
}

.query-field,
.result-field {
  border: 3px solid black;
}
</style>
