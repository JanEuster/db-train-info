import { ApiState } from "./types";

export const state = () => ({
  clientId: "",
  clientSecret: "",
  valid: false,
});

export const getters = {
  get(state: ApiState) {
    return { id: state.clientId, secret: state.clientSecret };
  },
  isValid(state: ApiState) {
    return state.valid;
  },
};

export const mutations = {
  set(state: ApiState, { id, secret }: { id: string; secret: string }) {
    state.clientId = id;
    state.clientSecret = secret;
  },
  load(state: ApiState) {
    // load stored values from local storage
    try {
      const data = JSON.parse(localStorage.getItem("db-api-data") ?? "");
      state.clientId = data.id;
      state.clientSecret = data.secret;
    } catch (error) {
      state.clientId = "";
      state.clientSecret = "";
    }
  },
  store(state: ApiState) {
    // store state in local storage
    const data = JSON.stringify({ id: state.clientId, secret: state.clientSecret });
    localStorage.setItem("db-api-data", data);
  },
};

export const actions = {
  async validate({ state }: { state: ApiState }) {
    // if this request to the api works as it should the client id & secret are valid
    return await fetch(
      "https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/location/berlin",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "DB-Client-Id": state.clientId,
          "DB-API-Key": state.clientSecret,
        },
      }
    ).then((res) => {
      state.valid = res.ok;
      return res.ok;
    });
  },
};
