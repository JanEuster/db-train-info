
<script lang="ts">
import Vue, { ref } from 'vue'
import { format } from 'date-fns'
import QueryFieldStation from '@/components/queryFieldStation.vue';
import QueryFieldTrain from '@/components/queryFieldTrain.vue';

type Station = {
  name: String;
  lon: number;
  lat: number;
  id: number;
}
type Train = {

}
let stationResult = ref<Station>();
let trainResult = ref<Object>();
let trainURL = ref<string>("");
let trainFieldActive = ref<boolean>(false);


export default Vue.extend({
  name: "IndexPage",
  components: { QueryFieldStation, QueryFieldTrain },
  data() {
    return {
      stationResult,
      trainURL,
      trainResult,
      trainFieldActive,
    };
  },
  methods: {
    setStation(e: Station) {
      stationResult.value = e;
      this.generateTrainURL();
    },
    setTrain(e: Train) {
      trainResult.value = e;
    },
    generateTrainURL() {
      if (stationResult.value) {
        const date = format(new Date(), 'yyyy-MM-dd') + "T" + format(new Date(), 'HH:mm');
        trainFieldActive.value = true;
        return `https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/departureBoard/${stationResult.value.id}?date=${date}`;
      } else {
        trainFieldActive.value = false;
        return "";
      }
    }
  },
})
</script>


<template>
  <div class="query-wrapper">
    <QueryFieldStation @station-result="setStation($event)" />
    <QueryFieldTrain :isActive="trainFieldActive" :fetchURL="generateTrainURL()" @train-result="setTrain($event)" />
  </div>
</template>

<style lang="scss">
:root {
  font-family: 'Segoe UI', Arial, Helvetica, sans-serif
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.query-wrapper {
  display: flex;
  align-items: flex-start;
  margin-top: 20px;

  &>* {
    margin-left: 10px;
  }
}
</style>