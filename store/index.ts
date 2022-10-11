// store/index.ts
import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { RootState } from "./types";

export const strict = false;

const store: StoreOptions<RootState> = {
  state: {
    stateTitle: "Vue.js and TypeScript: A Complete Tutorial With Examples",
  },
  modules: {},
};
export default new Vuex.Store<RootState>(store);
