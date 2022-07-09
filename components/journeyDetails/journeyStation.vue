<script lang="ts">
import { PropType } from 'vue'
import { StationDetails } from '../types'

export default {
  props: {
    stationDetails: undefined,
  },
  data() {
    return {}
  },
}
</script>

<template>
  <div>
    {{ stationDetails.stopName }}
  </div>
</template>

<style lang=""></style>
