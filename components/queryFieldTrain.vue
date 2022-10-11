<script lang="ts">
import Fuse from "fuse.js";
import { ref, reactive, defineComponent } from "vue";
import { format } from "date-fns";
import { Train, TrainWithDetails, ApiCredentials } from "./types";
import JourneyDetails from "./journeyDetails/journeyDetails.vue";
import { mapMutations, mapActions, mapGetters } from "vuex";

let inputRef = ref("");
let recommendations = ref<Train[]>([]);

const getSpecific = async (apiCreds: ApiCredentials, url: string, name: string) => {
  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "DB-Client-Id": apiCreds.id,
      "DB-API-Key": apiCreds.secret,
    } as HeadersInit,
  })
    .then((res) => res.json())
    .then((items: Array<Train>) => {
      const fuse = new Fuse(items, {
        keys: ["name", "type", "direction"],
        distance: 5,
      });
      const results = fuse.search(name);
      return results[0].item;
    });
};

export default defineComponent({
  props: {
    isActive: { type: Boolean, required: true },
    fetchURL: { type: String, required: true },
    selected: { type: Object },
  },
  emits: ["train-result"],
  data() {
    return {
      recommendations,
      showRecommendations: false,
      endpoint: "fahrplan/v1/departureBoard/{id}?date",
    };
  },
  methods: {
    getDetails(id: string) {
      const apiCreds = this.getApiCreds();
      return fetch(
        "https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/journeyDetails/" + id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "DB-Client-Id": apiCreds.id,
            "DB-API-Key": apiCreds.secret,
          } as HeadersInit,
        }
      ).then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.error(res.status + " " + res.statusText);
        }
      });
    },
    setSelected(value: Train | undefined) {
      this.$emit("train-result", undefined);
      if (value) {
        this.getDetails(value.detailsId).then((d) => {
          value.details = d;

          this.$emit("train-result", value);
        });
        (this.$refs.inputRef as HTMLInputElement).value = value.name;
      }
    },
    getRecommendations() {
      const value = (this.$refs.inputRef as HTMLInputElement)?.value;
      this.$emit("train-result", undefined);
      if (value.length > 0) {
        const apiCreds = this.getApiCreds();
        fetch(this.fetchURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "DB-Client-Id": apiCreds.id,
            "DB-API-Key": apiCreds.secret,
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
            const trainResults: Array<any> = d;
            const fuse = new Fuse(trainResults, {
              keys: ["name", "type", "direction"],
              distance: 7,
            });
            const results = fuse.search(value);
            recommendations.value = results.map((r) => r.item).slice(0, 10);
            if (value.toLowerCase() === recommendations.value[0].name.toLowerCase()) {
              this.setSelected(recommendations.value[0]);
              (this.$refs.inputRef as HTMLInputElement).value = recommendations.value[0].name;
            } else {
              this.setSelected(undefined);
            }
          })
          .catch((err) => console.warn(err));
      } else {
        recommendations.value = [];
        this.setSelected(undefined);
      }
    },
    select(e: Event) {
      const value = (e.target as HTMLLIElement).title;
      (this.$refs.inputRef as HTMLInputElement).value = String(value);
      const apiCreds = this.getApiCreds();
      getSpecific(apiCreds, this.fetchURL, value).then((selection) => {
        this.setSelected(selection);
      });
    },
    setShowRecommendations(view: boolean) {
      setTimeout(() => {
        this.showRecommendations = view;
      }, 200);
    },
    isCorrect() {
      // console.log(this.selected);
      return this.selected ? "correct" : null;
    },
    showTime(datetime: string) {
      console.log(datetime);
      return format(new Date(datetime), "HH:mm");
    },
    ...mapGetters({
      getApiCreds: "api/get",
    }),
  },
});
</script>

<template>
  <div class="query-field">
    <label>Train:</label>
    <div class="query-field-input-big">
      <input
        ref="inputRef"
        :disabled="!isActive"
        type="text"
        :class="selected ? 'correct' : null"
        @input="getRecommendations()"
        @focus="setShowRecommendations(true)"
        @blur="setShowRecommendations(false)"
      />
      <span v-if="selected">
        <sup ref="datetime">{{ showTime(selected.dateTime) }}</sup>
        <sub ref="direction"><span class="tight">--></span> {{ selected.direction }}</sub>
      </span>
      <label>{{ endpoint }}</label>
      <ul>
        <div v-if="showRecommendations">
          <li v-for="rec in recommendations" :key="rec.detailsId">
            <h4>{{ rec.name }}</h4>
            <sup>{{ showTime(rec.dateTime) }}</sup>
            <sub><span class="tight">--></span> {{ rec.direction }}</sub>
            <div :title="rec.name" @click.stop="select($event)"></div>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.query-field-input-big {
  position: relative;

  input {
    border: 2px solid black;
    padding: 0px 4px;
    padding-bottom: 30px;
    width: 100%;
    height: 60px;
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

  sup {
    position: absolute;
    top: 10px;
    right: 5px;
    font-size: 14px;
  }

  sub {
    position: absolute;
    bottom: 11px;
    left: 3px;
    font-style: italic;
    font-weight: bolder;

    span {
      font-weight: bolder;
      font-size: 15px;
    }
  }

  span > sup {
    top: 16px;
    right: 7px;
  }

  span > sub {
    bottom: 27px;
    left: 6px;
    word-wrap: break-word;
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
      min-height: 40px;

      position: relative;

      &:hover {
        outline: 3px solid black;
      }

      div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
      }
    }
  }
}
</style>
