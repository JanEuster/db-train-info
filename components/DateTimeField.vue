<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      date: "2022-10-14",
      time: "14:45",
      isOpen: false,
    };
  },
  setup() {},
});
</script>

<template>
  <div class="query-field">
    <div class="date-time-display" @click="isOpen = !isOpen">
      <p>{{ date }}</p>
      <hr />
      <p>{{ time }}</p>
    </div>
    <div v-if="isOpen" class="date-time-picker">
      <div></div>
    </div>
  </div>
</template>

<style lang="scss">
.date-time-display {
  min-width: 100px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  letter-spacing: 2;
  font-weight: bold;
  color: white;
  background: black;
  padding: 5px;
  cursor: pointer;
  hr {
    width: 100%;
  }
}
.date-time-picker {
  position: absolute;
  top: calc(100% + 3px);
  left: 50%;
  width: 250px;
  height: 300px;
  background: white;
  border: 3px solid black;
  z-index: 99999;
  transform: translateX(-50%);
}
</style>
