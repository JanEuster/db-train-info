<script lang="ts">
import Vue, { ref } from "vue";
import { format } from "date-fns";

import QueryFieldStation from "@/components/queryFieldStation.vue";
import QueryFieldTrain from "@/components/queryFieldTrain.vue";
import DateTimeField from "@/components/DateTimeField.vue";
import ApiLogin from "@/components/ApiLogin.vue";
import JourneyDetails from "~/components/journeyDetails/journeyDetails.vue";
import { Station, TrainWithDetails } from "~/components/types";
import DepartureList from "~/components/departureList.vue";

export default Vue.extend({
  name: "IndexPage",
  components: { QueryFieldStation, QueryFieldTrain, JourneyDetails, DepartureList },
  setup() {
    const stationResult = ref<Station>();
    const trainResult = ref<TrainWithDetails>();
    const trainURL = ref<string>("");
    const trainFieldActive = ref<boolean>(false);
    const date = ref(new Date());
    date.value.setUTCFullYear(2020);
    return {
      stationResult,
      trainResult,
      trainURL,
      trainFieldActive,
      date,
    };
  },
  data() {
    return {};
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
      this.stationResult = e;
      this.trainResult = undefined;

      this.generateTrainURL();
    },
    setTrain(e: TrainWithDetails | undefined) {
      this.trainResult = e;
    },
    generateTrainURL() {
      if (this.stationResult) {
        const date = format(new Date(), "yyyy-MM-dd") + "T" + format(new Date(), "HH:mm");
        this.trainFieldActive = true;
        return `https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/departureBoard/${this.stationResult.id}?date=${date}`;
      } else {
        this.trainFieldActive = false;
        return "";
      }
    },
    isTrainActive() {
      return this.trainFieldActive;
    },
    setDate(e: Date) {
      this.date = e;
    },
  },
});
</script>

<template>
  <div class="app">
    <ApiLogin />
    <div class="query-wrapper">
      <div class="query-row">
        <QueryFieldStation @station-result="setStation($event)" />
        <DateTimeField @date-change="setDate($event)" />
        <QueryFieldTrain
          :isActive="isTrainActive()"
          :fetchURL="generateTrainURL()"
          @train-result="setTrain($event)"
          :selected="trainResult"
        />
      </div>
      <div class="query-row" v-if="stationResult">
        <DepartureList
          v-if="stationResult"
          :departuresURL="generateTrainURL()"
          @train-result="setTrain($event)"
        />
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
  max-height: 100vh;
  overflow-y: hidden;
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
  justify-content: flex-start;
  width: 100%;
  flex-wrap: wrap;
}

.query-field {
  position: relative;
  display: inline-block;
  padding: 8px 12px;
  margin: 6px 10px;
}

.query-field,
.result-field {
  border: 3px solid black;
}
</style>
