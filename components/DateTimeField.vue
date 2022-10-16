<script lang="ts">
import { ref, defineComponent } from "vue";
import { format } from "date-fns";

const MONTHS = [
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
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default defineComponent({
  setup() {
    const date = ref(new Date());

    return {
      date,
    };
  },
  data() {
    return {
      isOpen: true,
      days: 30,
      yearMax: new Date().getUTCFullYear(),
    };
  },
  computed: {
    dateDisplay() {
      return format(this.date, "yyyy-MM-dd");
    },
    time() {
      return format(this.date, "HH:mm");
    },
    daysAfter() {
      const weekdayFirst = new Date(
        this.date.getUTCFullYear(),
        this.date.getUTCMonth(),
        1
      ).getDay();
      return (7 + weekdayFirst) % 7;
    },
    daysBefore() {
      const weekdayLast = new Date(
        this.date.getUTCFullYear(),
        this.date.getUTCMonth() + 1,
        0
      ).getDay();
      return (6 - weekdayLast) % 7;
    },
  },
  mounted() {
    if (this.isOpen) {
      this.open();
    } else {
      this.close();
    }
  },
  updated() {
    if (this.isOpen) {
      this.open();
    } else {
      this.close();
    }
  },
  methods: {
    open() {
      console.log("open");
      this.selectDay(this.date.getDate() - 1);
      this.$refs.month.selectedIndex = this.date.getMonth();
      this.$refs.year.value = this.date.getUTCFullYear();
    },
    close() {
      console.log("close");
    },
    daysInMonth() {
      // last day of prior month + 1 month
      return new Date(this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, 0).getDate();
    },
    selectDay(day: number) {
      const all = document.getElementsByClassName("calender-day");
      for (let i = 0; i < all.length; i++) {
        const day = all.item(i);
        (day as HTMLDataElement).dataset.selected = "false";
      }
      const current = document.getElementsByName("calender-day-" + String(day + 1))[0];
      current.dataset.selected = "true";
    },
    setYear(e: any) {
      const year = e.target.value;
      const newDate = new Date(this.date);
      newDate.setFullYear(year);
      this.date = new Date(newDate);

      if (this.date.getDay() >= this.daysInMonth()) {
        (this.date as Date).setDate(1);
      }
    },
    setMonth(e: any) {
      const month = MONTHS.findIndex((value) => {
        if (value === e.target.value) return true;
        return false;
      });
      const newDate = new Date(this.date);
      newDate.setMonth(month);
      this.date = new Date(newDate);

      if (this.date.getDay() >= this.daysInMonth()) {
        (this.date as Date).setDate(1);
      }
    },
    setTime(e: any) {
      const time = e.target.value as string;
      const [hours, minutes] = time.split(":", 2);
      const newDate = new Date(this.date);
      newDate.setHours(Number(hours), Number(minutes));
      this.date = new Date(newDate);
    },
  },
});
</script>

<template>
  <div class="query-field">
    <div class="date-time-display" @click="isOpen = !isOpen">
      <p>{{ dateDisplay }}</p>
      <hr />
      <p>{{ time }}</p>
    </div>
    <div v-if="isOpen" class="date-time-picker">
      <input
        ref="year"
        type="number"
        min="2000"
        :max="yearMax"
        name="year"
        :value="yearMax"
        @change="setYear($event)"
      />
      <select ref="month" name="month" class="calender-month" @change="setMonth($event)">
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
      <div ref="calender_dates" class="calender-dates">
        <div v-for="i in daysBefore" :key="'before-' + i" class="other-month"><div></div></div>
        <div v-for="i in daysInMonth()" :key="i">
          <div class="calender-day" :name="'calender-day-' + i" @click="selectDay(i - 1)">
            {{ i }}
          </div>
        </div>
        <div v-for="i in daysAfter" :key="'after-' + i" class="other-month"><div></div></div>
      </div>
      <div class="bottom-row">
        <input type="time" name="time" :value="time" @change="setTime($event)" />
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
    & > div > div[data-selected="true"] {
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
