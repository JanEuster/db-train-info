<template>
  <div :class="getWrapperClass()" v-on:click="edit">
    <span>Api Login Data</span>

    <label for="api-client-id">Client Id</label>
    <input id="api-client-id" />
    <label for="api-secret-key">Client Secret Key</label>
    <input type="password" id="api-secret-key" />
    <button v-on:click="submitData" id="api-submit">Submit</button>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  setup() {
    const validCreds = ref(false);
    const wrapperClass = ref("api-login-wrapper");
    return {
      validCreds,
      wrapperClass,
    };
  },
  async mounted() {
    this.loadApiData();
    if (await this.validateApiData()) {
      this.validCreds = true;
      this.wrapperClass = "api-login-wrapper active";
      const creds = this.getApiData();
      (document.getElementById("api-client-id") as HTMLInputElement).value = creds.id;
      (document.getElementById("api-secret-key") as HTMLInputElement).value = creds.secret;
    }
  },
  methods: {
    async submitData() {
      const id = (document.getElementById("api-client-id") as HTMLInputElement).value;
      const secret = (document.getElementById("api-secret-key") as HTMLInputElement).value;
      this.$store.commit("api/set", { id, secret });
      if (await this.validateApiData()) {
        console.log("request using db api creds successfull");
        this.storeApiData();
        this.validCreds = true;
        this.wrapperClass = "api-login-wrapper active";
      }
    },
    getWrapperClass() {
      return this.wrapperClass;
    },
    edit() {
      this.wrapperClass = "api-login-wrapper";
    },
    ...mapGetters({
      getApiData: "api/get",
    }),
    ...mapMutations({
      loadApiData: "api/load",
      storeApiData: "api/store",
      setApiData: "api/set",
    }),
    ...mapActions({
      validateApiData: "api/validate",
    }),
  },
};
</script>

<style lang="scss">
.active {
  cursor: pointer;
  background: greenyellow;

  label,
  input,
  button {
    display: none;
  }
}
.api-login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: 3px solid black;
  min-width: 120px;
  min-height: 120px;
  transition: all 0.5s ease-out;

  label {
    font-size: 10px;
    margin-left: 15px;
    margin-top: 7px;
    margin-bottom: -7px;
    text-align: left;
    width: 100%;
  }
  input {
    height: 28px;
  }
  input,
  button {
    outline: 3px solid black;
    background-color: white;
    color: black;
    padding: 4px 6px;
    margin: 10px;
  }
  button:hover {
    background-color: black;
    color: white;
  }
}
</style>
