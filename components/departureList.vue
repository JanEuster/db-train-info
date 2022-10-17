<script lang="ts">
import { defineComponent, ref } from "vue";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { format } from "date-fns";
import { Train, TrainDetails, ApiCredentials } from "./types";
import { HTMLEntityStringToUTF8 as toUTF8 } from "./functions";

export default defineComponent({
  props: {
    stationId: Number,
    date: Date,
  },
  setup() {
    const trains = ref<Train[] | undefined>();
    const isLoading = ref(false);
    return {
      trains,
      isLoading,
    };
  },
  data() {
    return {
      format,
    };
  },
  mounted() {
    const apiCreds = this.getApiCreds() as ApiCredentials;
    this.isLoading = true;
    this.getDepartures(apiCreds, this.stationId, this.date);
  },
  methods: {
    async getDetails(apiCreds: ApiCredentials, id: string): Promise<TrainDetails> {
      return await fetch(
        "https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/journeyDetails/" + id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "DB-Client-Id": apiCreds.id,
            "DB-API-Key": apiCreds.secret,
          } as HeadersInit,
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.error(res.status + " " + res.statusText);
          }
        })
        .then((json) => json as TrainDetails);
    },
    getAllDetails(apiCreds: ApiCredentials, trains: Train[]) {
      return new Promise<Train[]>((resolve, reject) => {
        const trainResults: Array<Train> = trains;
        for (const train of trainResults) {
          this.getDetails(apiCreds, train.detailsId).then((d) => {
            train.details = d;
          });
        }
        setTimeout(() => {
          resolve(trainResults);
        }, 2000);
      });
    },
    async getDepartures(apiCreds: ApiCredentials, stationId: number) {
      const dateStr = format(this.date, "yyyy-MM-dd") + "T" + format(this.date, "HH:mm");
      await fetch(
        `https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/departureBoard/${stationId}?date=${dateStr}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "DB-Client-Id": apiCreds.id,
            "DB-API-Key": apiCreds.secret,
          } as HeadersInit,
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.error(res.status + " " + res.statusText);
          }
        })
        .then((d) => {
          this.getAllDetails(apiCreds, d).then((trainResults: Train[]) => {
            this.trains = trainResults;
            this.isLoading = false;
          });
        });
    },
    longDate(dateTime: string) {
      return format(new Date(dateTime), "PPPP");
    },
    getFromStationName(train: Train) {
      return train.details ? toUTF8(train.details[0].stopName) : "";
    },
    setTrain(train: Train) {
      const apiCreds = this.getApiCreds();
      this.$emit("train-result", undefined);
      if (train) {
        this.getDetails(apiCreds, train.detailsId).then((d) => {
          train.details = d;

          this.$emit("train-result", train);
        });
      }
    },
    ...mapGetters({
      getApiCreds: "api/get",
    }),
  },
});
</script>

<template>
  <div class="query-field" @station-result="getDepartures(departuresURL)">
    <div class="departures-wrapper">
      <h2>Departure Board</h2>
      {{ longDate(date) }}
      <div>
        <table v-if="trains && trains.length > 0" class="departure-table">
          <tr>
            <th>Name</th>
            <th>From</th>
            <th>To</th>
            <th>At</th>
            <th>Platform</th>
          </tr>
          <tr
            v-for="train in trains"
            :key="train.detailsId"
            class="table-data-row"
            @click="setTrain(train)"
          >
            <td>{{ train.name }}</td>
            <td>{{ getFromStationName(train) }}</td>
            <td>{{ train.direction }}</td>
            <td>{{ format(new Date(train.dateTime), "HH:mm") }}</td>
            <td>{{ train.track }}</td>
          </tr>
        </table>
        <table v-else-if="isLoading" class="departure-table">
          <tr class="table-data-row">
            <td>Loading...Results</td>
          </tr>
        </table>
        <table v-else class="departure-table">
          <tr class="table-data-row">
            <td>No Results for this Date.</td>
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
  color: #adff2f;
}

.departure-table td:hover {
  font-style: italic;
}
</style>
