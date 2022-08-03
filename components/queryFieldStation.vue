<script lang="ts">
import { ref, reactive, defineComponent } from "vue";
import { Station } from "./types";

let data = reactive({
  inputRef: "",
  recommendations: [] as Station[],
  // showRecommendations: true,
  selected: false as Station | false,
});
let inputRef = ref("");

const getSpecific = (url: string) => {
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "DB-Client-Id": process.env.NUXT_ENV_DB_CLIENT,
      "DB-API-Key": process.env.NUXT_ENV_DB_API_KEY,
    } as HeadersInit,
  })
    .then((res) => res.json())
    .then((items) => {
      return items[0];
    });
};

export default defineComponent({
  emits: ["reset-train-result", "station-result"],
  data() {
    return {
      data,
      showRecommendations: false,
      fetchURL: "https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/location/",
      endpoint: "fahrplan/v1/location/{name}",
    };
  },
  methods: {
    setSelected(value: Station | false) {
      data.selected = value;
      this.$emit("station-result", false);
      this.$emit("station-result", value);
    },
    getRecommendations(e: Event) {
      // emit event so train field can be reset
      this.$emit("reset-train-result", true);

      const value = (e.target as HTMLInputElement)?.value;

      if (value.length > 0) {
        fetch(this.fetchURL + value, {
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
            const stationResults: Array<Station> = d;
            data.recommendations = stationResults.slice(0, 10);

            if (value.toLowerCase() === data.recommendations[0].name.toLowerCase()) {
              this.setSelected(data.recommendations[0]);
              (this.$refs.inputRef as HTMLInputElement).value = data.recommendations[0].name;
            } else {
              this.$emit("reset-train-result", true);
            }
          })
          .catch((err) => console.warn(err));
      } else {
        data.recommendations = [];
      }
    },
    select(e: Event) {
      const value = (e.target as HTMLLIElement).title;

      (this.$refs.inputRef as HTMLInputElement).value = String(value);
      getSpecific(this.fetchURL + value).then((selection) => {
        this.setSelected(selection);
      });
    },
    setShowRecommendations(view: boolean) {
      setTimeout(() => {
        this.showRecommendations = view;
      }, 200);
    },
    isCorrect(selected: any): string | null {
      return selected ? "correct" : null;
    },
  },
});
</script>

<template>
  <div class="query-field">
    <label>Station:</label>
    <div class="query-field-input">
      <input ref="inputRef" type="text" :class="isCorrect(data.selected)" @input="getRecommendations($event)"
        @focus="setShowRecommendations(true)" @blur="setShowRecommendations(false)" />
      <label>{{ endpoint }}</label>
      <ul>
        <div v-if="showRecommendations">
          <li v-for="rec in data.recommendations" :key="rec.id" :title="rec.name" @click="select($event)">
            {{ rec.name }}
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
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
