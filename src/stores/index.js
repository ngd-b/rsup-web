import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state() {
    return {
      package: {},
      // 升级记录
      upPkg: {},
      // 依赖关系数据
      // 避免重复查询
      relationPkg: {},
    };
  },
  actions: {
    updateRelationPkg({ name, relation }) {
      this.relationPkg[name] = relation;
    },
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
