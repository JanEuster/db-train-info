<script lang="ts">
import Vue, { ref } from "vue";
import { format } from "date-fns";
import QueryFieldStation from "@/components/queryFieldStation.vue";
import QueryFieldTrain from "@/components/queryFieldTrain.vue";
import JourneyDetails from "~/components/journeyDetails/journeyDetails.vue";
import { Station, TrainWithDetails } from "~/components/types";

let stationResult = ref<Station>();
let trainResult = ref<TrainWithDetails>();
let trainURL = ref<string>("");
let trainFieldActive = ref<boolean>(false);

export default Vue.extend({
  name: "IndexPage",
  components: { QueryFieldStation, QueryFieldTrain, JourneyDetails },
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
  <div>
    <div class="query-wrapper">
      <QueryFieldStation @station-result="setStation($event)" />
      <QueryFieldTrain
        :isActive="isTrainActive()"
        :fetchURL="generateTrainURL()"
        @train-result="setTrain($event)"
        :selected="trainResult"
      />
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

.tight {
  letter-spacing: -4px;
}

.query-wrapper {
  display: flex;
  align-items: flex-start;
  padding: 20px 0;
  height: 100vh;

  & > * {
    margin-left: 10px;
  }
}
</style>
