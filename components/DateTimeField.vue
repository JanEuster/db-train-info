<script>
import { ref, defineComponent } from "vue";

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
    const selectedDay = ref(today.getUTCDate());
    const selectedMonth = ref(months[today.getUTCMonth()]);
    console.log(selectedMonth);
    return {
      selectedDay,
      selectedMonth,
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
      <select name="month" class="calender-month">
        <option value="January">January</option>
        <option value="Febuary">Febuary</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="Juli">Juli</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>
      <div class="calender-dates">
        <p>1</p>
        <p>2</p>
        <p>3</p>
        <p>4</p>
        <p>5</p>
        <p>6</p>
        <p>7</p>
        <p>8</p>
        <p>9</p>
        <p>10</p>
        <p>11</p>
        <p>12</p>
        <p>13</p>
        <p>14</p>
        <p>15</p>
        <p>16</p>
        <p>17</p>
        <p>18</p>
        <p>19</p>
        <p>20</p>
        <p>21</p>
        <p>22</p>
        <p>23</p>
        <p>24</p>
        <p>25</p>
        <p>26</p>
        <p>27</p>
        <p>28</p>
        <p>29</p>
        <p>30</p>
      </div>
      <div>
        <input type="time" name="time" value="14:45" />
      </div>
      <button name="ok-button" @click="isOpen = false">Ok</button>
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
  }
  input[name="year"] {
    width: 95px;
    font-size: 25px;
    height: 30px;
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
    p {
      font-size: 12px;
      font-weight: bold;
      color: black;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      border: 1px solid black;
    }
  }
  input[type="time"] {
    font-size: 23px;
    height: 30px;
    margin: 5px 0;
    margin-top: 10px;
  }
  button[name="ok-button"] {
    text-align: right;
    width: 100%;
    padding: 5px 10px;
  }
}
</style>
