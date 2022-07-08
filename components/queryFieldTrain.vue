
<script lang="ts">
import Fuse from "fuse.js";
import { ref, reactive, defineComponent } from "vue";
import { format } from 'date-fns'

type TrainDetails = {

}
type Train = {
  boardId: number,
  dateTime: string,
  detailsId: string,
  direction: string,
  name: string,
  stopId: number,
  stopName: string,
  track: string,
  type: string,
  details?: any,
}

let data = reactive({
  inputRef: "",
  recommendations: <Array<Train>>[],
  // showRecommendations: true,
  selected: <Train | false>false,
});
let inputRef = ref("")

const getSpecific = (url: string, name: string) => {
  return fetch(url, {
    method: 'GET',
    headers: <HeadersInit>{
      'Content-Type': 'application/json',
      'DB-Client-Id': process.env.NUXT_ENV_DB_CLIENT,
      'DB-API-Key': process.env.NUXT_ENV_DB_API_KEY,
    }
  })
    .then(res => res.json())
    .then(items => {
      const fuse = new Fuse(items, { keys: ['name', 'type', 'direction'], distance: 5 });
      const results = fuse.search(name);
      return results[0].item;
    });
}

export default defineComponent({
  data() {
    return {
      data,
      showRecommendations: false,
      endpoint: "fahrplan/v1/departureBoard/{id}?date",
    }
  },
  props: {
    isActive: { type: Boolean, required: true },
    fetchURL: { type: String, required: true },
  },
  computed: {
    time() {
      console.log(data.selected)
      return data.selected ? format(new Date(data.selected.dateTime), "HH:mm") : null;
    },
    direction() {
      return data.selected ? data.selected.direction : null;
    },
  },
  methods: {
    getDetails(id: string) {

    },
    setSelected(value: Train | false) {
      if (value) {
        value.details = this.getDetails(value.detailsId);
        (this.$refs.inputRef as HTMLInputElement).value = value.name;
      }
      data.selected = value;
      this.$emit("train-result", value);
    },
    getRecommendations(e: Event) {
      const value = (e.target as HTMLInputElement)?.value;
      data.selected = false;

      if (value.length > 0) {

        fetch(this.fetchURL, {
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
            const trainResults: Array<any> = d;
            const fuse = new Fuse(trainResults, { keys: ['name', 'type', 'direction'], distance: 5 });
            const results = fuse.search(value);
            data.recommendations = results.map(r => r.item).slice(0, 10);
            console.log(results);

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
      (this.$refs.inputRef as HTMLInputElement).value = String(value);
      getSpecific(this.fetchURL, value).then(selection => {
        console.log("selection", selection)
        this.setSelected(selection);
      });
    },
    setShowRecommendations(view: boolean) {
      setTimeout(() => this.showRecommendations = view, 200);
    },
    isCorrect(selected: any): string | null {
      console.log("selected", selected)
      return selected ? 'correct' : null
    },

    showDate(datetime: string) {
      return format(new Date(datetime), "HH:mm")
    }
  }
});

</script>

<template>
  <div class="query-field">
    <label>Train:</label>
    <div class="query-field-input-big">
      <input :disabled="!isActive" type="text" :class="isCorrect(data.selected)" @input="getRecommendations($event)"
        v-on:focus="setShowRecommendations(true)" v-on:blur="setShowRecommendations(false)" ref="inputRef" />
      <span>
        <sup ref="datetime" v-if="data.selected">{{ time }}</sup>
        <sub ref="direction" v-if="data.selected"><span>--></span> {{ direction }}</sub>
        <label>{{ endpoint }}</label>
      </span>
      <ul>
        <li v-if="showRecommendations" v-for="rec in data.recommendations" v-bind:key="rec.detailsId">
          <h4>{{ rec.name }}</h4>
          <sup>{{ showDate(rec.dateTime) }}</sup>
          <sub><span>--></span> {{ rec.direction }}</sub>
          <div @click.stop="select($event)" :title="rec.name"></div>
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

.query-field-input-big {
  position: relative;

  input {
    border: 2px solid black;
    padding: 0px 4px;
    padding-bottom: 30px;
    width: 190px;
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
      letter-spacing: -4px;
      font-weight: bolder;
      font-size: 15px;
    }
  }

  span>sup {
    top: 16px;
    right: 7px;
  }

  span>sub {
    bottom: 27px;
    left: 6px;
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
      height: 40px;

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