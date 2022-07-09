<script lang="ts" type="module">
import { defineComponent } from 'vue';
// import { parseEntities } from 'parse-entities'
import { TrainWithDetails } from '../types';
import journeyStation from './journeyStation.vue';

export default defineComponent({
  components: { journeyStation },
  props: {
    trainResult: { type: Object},
  },
  data() {
    return {
    };
  },
  methods: {
    entityReferenceToUTF8(entityString: string) {
      // fixes this bullshit the api returns; "stopName": "Berlin Hbf &#x0028;tief&#x0029;"
      // -> "Berlin HBf (tief)"
      // return parseEntities(entityString);
      // TODO: ENABLE ES MODULE IMPORTS ????? BECAUSE THAT SOMEHOW IS NOT A STANDARD FEATURE
      return entityString;
    },
    setTrain(train: TrainWithDetails) {
      if (train === undefined) {
        return false;
      }
      return true;
    },
  },
});
</script>

<template>
  <div v-if="trainResult" class="journey-details-wrapper">
    <header @train-result="setTrain($event)">
      <h1>{{ entityReferenceToUTF8(trainResult.name) }}</h1>
      <h2>
        {{ trainResult.details[0].stopName }} <span class="tight">-----</span>
        {{ trainResult.details[trainResult.details.length - 1].stopName }}
      </h2>
    </header>
    <ul>
      <journeyStation
        v-for="(station, i) in trainResult.details"
        :key="i"
        :stationDetails="station"
      />
    </ul>
  </div>
</template>

<style lang="scss">
.journey-details-wrapper {
  display: inline-block;
  border: 3px solid black;
  min-width: 300px;
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
