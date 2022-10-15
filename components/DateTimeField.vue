<script lang="ts">
import { ref, defineComponent } from "vue";
import { daysInMonth, weekdayOfFirst, weekdayOfLast } from "./functions";

export default defineComponent({
  setup() {
    const today = new Date();
    const months = [
      "January",
      "Febuary",
      "March",
      "April",
      "May",
      "June",
      "Juli",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const selectedDay = ref(today.getUTCDate());
    const selectedMonthIndex = today.getUTCMonth();
    const selectedMonth = ref(months[today.getUTCMonth()]);
    const monthDays = daysInMonth(today.getUTCMonth(), today.getUTCFullYear());
    const weekday = weekdayOfFirst(today.getUTCMonth(), today.getUTCFullYear());
    const weekdayLast = weekdayOfLast(today.getUTCMonth(), today.getUTCFullYear());

    return {
      selectedDay,
      selectedMonthIndex,
      selectedMonth,
      monthDays,
      weekday,
      weekdayLast,
    };
  },
  data() {
    return {
      date: "2022-10-14",
      time: "14:45",
      isOpen: true,
      days: 30,
      yearMax: new Date().getUTCFullYear(),
    };
  },
  mounted() {
    this.$refs.month.selectedIndex = this.selectedMonthIndex;
  },
  methods: {
    selectDay(day: number) {
      this.selectedDay = day;
    },
  },
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
      <input type="number" min="2000" :max="yearMax" name="year" :value="yearMax" />
      <select ref="month" name="month" class="calender-month">
        <option value="January">January</option>
        <option value="Febuary">Febuary</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="Juli">Juli</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>
      <div class="calender-dates">
        <div v-for="i in weekday - 0" class="other-month"><div></div></div>
        <div v-for="i in monthDays" v-if="i == selectedDay">
          <div class="selected">{{ i }}</div>
        </div>
        <div v-else>
          <div @click="selectDay(i)">{{ i }}</div>
        </div>
        <div v-for="i in 6 - weekdayLast" class="other-month"><div></div></div>
      </div>
      <div class="bottom-row">
        <input type="time" name="time" value="14:45" />
        <button name="ok-button" @click="isOpen = false">Ok</button>
      </div>
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: left;
  top: calc(100% + 3px);
  left: 50%;
  width: 250px;
  // height: 300px;
  padding: 10px;
  background: white;
  border: 3px solid black;
  z-index: 99999;
  transform: translateX(-50%);

  input,
  select {
    border: 1px solid black;
    margin-bottom: 10px;
    border-radius: 5px;
    padding: 10px 0;
    height: 35px;
  }
  input[name="year"] {
    width: 95px;
    font-size: 25px;
    padding: 5px;
    margin-bottom: 10px;
  }
  select[name="month"] {
    background: white;
    padding: 5px 2px;
  }
  .calender-dates {
    width: 100%;
    aspect-ratio: 1.35;
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(7, auto);
    grid-template-rows: repeat(5, auto);
    & > div > div {
      width: 100%;
      height: 100%;
      font-size: 12px;
      font-weight: bold;
      color: black;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      border: 1px solid black;
      cursor: pointer;

      &:hover {
        background: rgba(0, 0, 0, 0.75);
        color: white;
      }
    }
    .selected {
      background: black;
      color: white;
    }
    .other-month > div {
      border: 0;
      background: rgba(0, 0, 0, 0.55);
    }
  }
  .bottom-row {
    height: 35px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
    margin-top: 10px;
  }
  input[type="time"] {
    text-align: center;
    width: 140px;
    height: 100%;
    font-size: 22px;
    padding: 0;
    margin: 3px 0;
  }
  button[name="ok-button"] {
    padding: 5px 10px;
    font-size: 17px;
    font-weight: bold;
  }
}
</style>
