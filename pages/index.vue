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
    const date = ref(new Date());
    return {
      stationResult,
      trainResult,
      trainURL,
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
    },
    setTrain(e: TrainWithDetails | undefined) {
      this.trainResult = e;
    },
    isTrainActive() {
      return this.stationResult ? true : false;
    },
    setDate(e: Date) {
      this.date = e;
      const stationResult = this.stationResult;
      this.stationResult = undefined;
      setTimeout(() => {
        this.stationResult = stationResult;
      }, 50);
    },
  },
});
</script>

<template>
<div>
<h1>The DB Fahrplan API was removed from their catalog for no apparent reason??? Thank you DB, always a pleasure</h1>
  <div class="app">
    <ApiLogin />
    <div class="query-wrapper">
      <div class="query-row">
        <QueryFieldStation @station-result="setStation($event)" />
        <DateTimeField @date-change="setDate($event)" />
        <QueryFieldTrain
          :isActive="isTrainActive()"
          :stationId="stationResult ? stationResult.id : 0"
          :date="date"
          @train-result="setTrain($event)"
          :selected="trainResult"
        />
      </div>
      <div class="query-row" v-if="stationResult">
        <DepartureList
          v-if="stationResult"
          :stationId="stationResult.id"
          :date="date"
          @train-result="setTrain($event)"
        />
      </div>
    </div>
    <JourneyDetails v-if="trainResult" :trainResult="trainResult" />
  </div>
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
.tight {
  margin-left: -0.3%;
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
