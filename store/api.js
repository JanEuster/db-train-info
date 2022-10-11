export const state = () => ({
  clientId: "",
  clientSecret: "",
  valid: false,
});

export const getters = {
  get(state) {
    return { id: state.clientId, secret: state.clientSecret };
  },
  isValid(state) {
    return state.valid;
  },
};

export const mutations = {
  set(state, { id, secret }) {
    state.clientId = id;
    state.clientSecret = secret;
  },
  load(state) {
    // load stored values from local storage
    const data = JSON.parse(localStorage.getItem("db-api-data"));
    state.clientId = data.id;
    state.clientSecret = data.secret;
  },
  store(state) {
    // store state in local storage
    const data = JSON.stringify({ id: state.clientId, secret: state.clientSecret });
    localStorage.setItem("db-api-data", data);
  },
};

export const actions = {
  async validate({ state }) {
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
