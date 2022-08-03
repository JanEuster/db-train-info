<script lang="ts">
import { defineComponent, ref } from "vue";
import { format } from "date-fns";
import { Train } from "./types";

const trains = ref<Train[]>();

const getDepartures = (url: string) => {
  console.log("get departures");

  fetch(url, {
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
      const trainResults: Array<Train> = d;
      console.log(trainResults);
      trains.value = trainResults;
    });
};

export default defineComponent({
  props: {
    departuresURL: { type: String, required: true },
  },
  setup(props) {
    getDepartures(props.departuresURL);
  },
  data() {
    return {
      trains,
      getDepartures,
      format,
    };
  },
  methods: {
    getTrainStartStation(train: Train) {
      return train.details ? train.details[0] : "NA"
    }
  },
});
</script>

<template>
  <div class="query-field" @station-result="getDepartures(departuresURL)">
    <div class="departures-wrapper">
      <div>
        <table class="departure-table">
          <tr>
            <th>Name</th>
            <th>From</th>
            <th>To</th>
            <th>At</th>
            <th>Platform</th>
          </tr>
          <tr class="table-data-row" v-for="train in trains" :key="train.detailsId">
            <td>{{ train.name }}</td>
            <td>{{ getTrainStartStation(train) }}</td>
            <td>{{ train.direction }}</td>
            <td>{{ format(new Date(train.dateTime), "HH:mm") }}</td>
            <td>{{ train.track }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.departures-wrapper {
  width: 500px;
  max-width: 100%;
  height: 500px;
  overflow: hidden;
  position: relative;

  div {
    overflow-y: scroll;
    max-height: 100%;
  }

  div::-webkit-scrollbar {
    display: none;
  }
}

div .departure-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 1px 3px;
}

.departure-table th {
  text-align: left;
  padding-left: 7px;
  padding-right: 10px;
}

.departure-table tr {
  height: 30px;
}

.table-data-row {
  cursor: pointer;
  color: white;
}

.departure-table td {
  color: inherit;
  padding-left: 8px;
  padding-right: 10px;
  margin-top: 3px;
  background: black;
}

.table-data-row:hover {
  color: #ADFF2F;
}

.departure-table td:hover {
  font-style: italic;
}
</style>
