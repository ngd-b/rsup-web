import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state() {
    return {
      package: {},
    };
  },
  actions: {
    updatePakage(payload) {
      this.package = payload;
    },
  },
});
