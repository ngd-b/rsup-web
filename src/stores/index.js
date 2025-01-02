import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state() {
    return {
      package: {},
      // 升级记录
      upPkg: {},
    };
  },
  actions: {
    updatePackage(payload) {
      this.package = payload;
    },
    updateUpPkg({ name, version }) {
      if (!this.uppkg[name]) {
        this.uppkg[name] = [];
      }
      this.uppkg[name].push(version);
    },
  },
});
