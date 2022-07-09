<script lang="ts" type="module">
import { defineComponent } from "vue";
// import { parseEntities } from 'parse-entities'
import { Train } from "../types";
import journeyStation from "./journeyStation.vue";

export default defineComponent({
  props: {
    train: { type: undefined, default: {} }
  },
  data() {
    return {
      trainDetails: (this.train as Train).details,
    };
  },
  methods: {
    entityReferenceToUTF8(entityString: string) {
      // fixes this bullshit the api returns; "stopName": "Berlin Hbf &#x0028;tief&#x0029;"
      // -> "Berlin HBf (tief)"
      // return parseEntities(entityString);
      // TODO: ENABLE ES MODULE IMPORTS ????? BECAUSE THAT SOMEHOW IS NOT A STANDARD FEATURE
      return entityString;
    }
  },
  components: { journeyStation }
})

</script>

<template>
  <div class="journey-details-wrapper">
    <header>
      <h1>{{ entityReferenceToUTF8(train.name) }}</h1>
      <h2>{{ train.details[0].stopName }} <span class="tight">-----</span> {{ train.details[train.details.length -
          1].stopName
      }}</h2>
    </header>
    <ul v-if="train.details !== undefined">
      <journeyStation v-for="(station, i) in train.details" v-bind:key="i" :stationDetails="station" />
    </ul>
  </div>
</template>

<style lang="scss">
.journey-details-wrapper {
  border: 3px solid black;
  margin-top: 30px;
  min-width: 100%;
  max-width: min(200%, 30vw);
  padding: 4px 8px;

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
}
</style>