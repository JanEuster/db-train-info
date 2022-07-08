
<script lang="ts">
import { ref, reactive, defineComponent } from "vue";


type Station = {
  name: string;
  lon: number;
  lat: number;
  id: number;
}

let data = reactive({
  inputRef: "",
  recommendations: <Array<Station>>[],
  // showRecommendations: true,
  selected: <Station | false>false,
});
let inputRef = ref("")

const getSpecific = (url: string) => {
  return fetch(url, {
    method: 'GET',
    headers: <HeadersInit>{
      'Content-Type': 'application/json',
      'DB-Client-Id': process.env.NUXT_ENV_DB_CLIENT,
      'DB-API-Key': process.env.NUXT_ENV_DB_API_KEY,
    }
  })
    .then(res => res.json())
    .then(items => { return items[0] });
}

export default defineComponent({
  data() {
    return {
      data,
      showRecommendations: false,
      fetchURL: "https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/location/",
      endpoint: "fahrplan/v1/location/{name}",
    }
  },
  methods: {
    setSelected(value: Station | false) {
      data.selected = value;
      this.$emit("station-result", value);
    },
    getRecommendations(e: Event) {
      const value = (e.target as HTMLInputElement)?.value;
      this.setSelected(false);

      if (value.length > 0) {

        fetch(this.fetchURL + value, {
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
              console.error(res.status + " " + res.statusText);
            }
          })
          .then((d) => {
            const stationResults: Array<Station> = d;
            data.recommendations = stationResults.slice(0, 10);
            (data.recommendations[0].name);

            if (value.toLowerCase() === data.recommendations[0].name.toLowerCase()) {
              this.setSelected(data.recommendations[0]);
              (this.$refs.inputRef as HTMLInputElement).value = data.recommendations[0].name;
            }
          })
          .catch(err => console.warn(err))
      } else {
        data.recommendations = [];
      }
    },
    select(e: Event) {
      const value = (e.target as HTMLLIElement).title;
      console.log(e);
      (this.$refs.inputRef as HTMLInputElement).value = String(value);
      getSpecific(this.fetchURL + value).then(selection => {
        this.setSelected(selection);
      });
    },
    setShowRecommendations(view: boolean) {
      setTimeout(() => this.showRecommendations = view, 200);
    },
    isCorrect(selected: any): string | null {
      return selected ? 'correct' : null
    }
  }
});

</script>

<template>
  <div class="query-field">
    <label>Station:</label>
    <div class="query-field-input">
      <input type="text" :class="isCorrect(data.selected)" @input="getRecommendations($event)"
        v-on:focus="setShowRecommendations(true)" v-on:blur="setShowRecommendations(false)" ref="inputRef" />
      <label>{{ endpoint }}</label>
      <ul>
        <li v-if="showRecommendations" v-for="rec in data.recommendations" v-bind:key="rec.id" @click="select($event)"
          :title="rec.name">
          {{ rec.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
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
    padding-bottom: 14px;
    width: 240px;
    height: 45px;
  }

  input:hover {
    outline: 1px solid black;
  }

  input:focus {
    outline: 1px solid black;
  }

  label {
    position: absolute;
    color: black;
    font-size: 10px;
    left: 5px;
    bottom: 4px;
    z-index: 9999;
  }

  ul {
    position: absolute;
    left: 0;
    top: calc(100% + 5px);
    width: 100%;
    background: white;
    z-index: 999;
    border: 2px solid black;


    &::before {
      position: absolute;
      content: "";
      background: black;
      top: -10px;
      left: 0;
      width: 100%;
      height: 10px;
      z-index: 9999;
    }

    li {
      outline: 1px solid black;
      cursor: pointer;
      user-select: none;
      padding: 0 3px;
      height: 28px;

      &:hover {
        outline: 3px solid black;
      }
    }
  }


}
</style>