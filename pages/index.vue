
<script lang="ts">
import Vue, { ref } from 'vue'

type Station = {
  name: String;
  lon: number;
  lat: number;
  id: number;
}
type StationArray = Array<Station>;

let stationInputRef = ref<string>("");
let stationRecommendations = ref<StationArray>([]);
let selectedStation = ref<Station | false>(false);
let showStationRecommendations = ref<Boolean>(true);

const getSpecificStation = (name: string) => {
  return fetch(`https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/location/${name}`, {
    method: 'GET',
    headers: <HeadersInit>{
      'Content-Type': 'application/json',
      'DB-Client-Id': process.env.NUXT_ENV_DB_CLIENT,
      'DB-API-Key': process.env.NUXT_ENV_DB_API_KEY,
    }
  })
    .then(res => res.json())
    .then(data => { return data[0] })
}

export default Vue.extend({
  name: 'IndexPage',
  data() {
    return {
      stationRecommendations,
      selectedStation,
      showStationRecommendations,
    }
  },
  methods: {
    getStationRecommentations(e: Event) {
      const qName = (e.target as HTMLInputElement)?.value;

      console.log(qName)
      if (qName.length > 0) {

        fetch(`https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/location/${qName}`, {
          method: 'GET',
          headers: <HeadersInit>{
            'Content-Type': 'application/json',
            'DB-Client-Id': process.env.NUXT_ENV_DB_CLIENT,
            'DB-API-Key': process.env.NUXT_ENV_DB_API_KEY,
          }
        })
          .then(res => {
            if (res.ok) {
              return res.json();
            } else {
              console.error(res.status);
            }
          })
          .then((data) => {
            const stationResults: StationArray = data;
            stationRecommendations.value = stationResults.slice(0, 5);
            console.log(stationRecommendations.value[0].name);

            if (qName.toLowerCase() === stationRecommendations.value[0].name.toLowerCase()) {
              selectedStation.value = stationRecommendations.value[0]
            }
          })
          .catch(err => console.error(err))
      } else {
        stationRecommendations.value = [];
      }
    },
    selectStation(e: Event) {
      const qName = (e.target as HTMLLIElement)?.innerText;
      console.log(qName)
      this.$refs.stationInputRef.value = qName;
      getSpecificStation(qName).then(station => selectedStation.value = station);
    },
    toogleShowStationRecommendations(view: Boolean) {
      setTimeout(() => showStationRecommendations.value = view, 200);
    }
  }
})
</script>


<template>
  <div>
    <div class="query-field">
      <label>Station:</label>
      <div class="query-field-input">
        <input ref="stationInputRef" type="text" @input="getStationRecommentations($event)"
          :class="selectedStation ? 'correct' : null" v-on:focus="toogleShowStationRecommendations(true)"
          v-on:blur="toogleShowStationRecommendations(false)" />
        <ul>
          <li v-if="showStationRecommendations" v-for="station in stationRecommendations" v-bind:key="station.id"
            @click="selectStation($event)" value="abc">
            {{ station.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="query-field">
      <label>Train:</label>
      <div class="query-field-input">
        <input type="text" />
        <ul>
          <li v-if="" v-for="" v-bind:key="" @click="">
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.query-field {
  display: inline-block;
  padding: 12px;
  border: 3px solid black;
}

.correct {
  background: greenyellow;
}

.query-field-input {
  position: relative;

  input {
    border: 2px solid black;
    padding: 2px 4px;
  }

  input:hover {
    outline: 1px solid black;
  }

  input:focus {
    outline: 1px solid black;
  }

  ul {
    position: absolute;
    left: 0;
    top: calc(100% + 5px);
    width: 100%;
    background: white;
    z-index: 9999;
    border: 2px solid black;


    &::before {
      position: absolute;
      content: "";
      background: black;
      top: -10px;
      left: 0;
      width: 100%;
      height: 10px;
      z-index: 99999;
    }
  }

  li {
    outline: 1px solid black;
    cursor: pointer;
    user-select: none;

    &:hover {
      outline: 3px solid black;
    }
  }
}
</style>