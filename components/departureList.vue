<script lang="ts">
import { defineComponent, ref } from "vue";
import { Train } from "./types";

const trains = ref<Train[]>()

const getDepartures = (url: string) => {
  console.log("get departures")

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "DB-Client-Id": process.env.NUXT_ENV_DB_CLIENT,
      "DB-API-Key": process.env.NUXT_ENV_DB_API_KEY,
    } as HeadersInit,
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.error(res.status + " " + res.statusText);
      }
    })
    .then((d) => {
      const trainResults: Array<Train> = d;
      console.log(trainResults);
      trains.value = trainResults;
    });
}

export default defineComponent({
  props: {
    departuresURL: { type: String, required: true }
  },
  setup(props) {
    getDepartures(props.departuresURL)
  },
  data() {
    return {
      trains,
      getDepartures,
    };
  },
  methods: {
  },
})
</script>

<template>
  <div class="query-field" @station-result="getDepartures(departuresURL)">
    <div v-for="train in trains" :key="train.detailsId">
      {{ train.name }}

    </div>
  </div>
</template>

<style lang="scss">
.departures-wrapper {
  width: 500px;
  height: 300px;
}
</style>