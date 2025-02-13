import { defineStore } from "pinia";
import { Pkg, PkgInfo } from "@/ajax/type/pkg";

interface Store {
  package: Pkg;
  relationPkg: Map<string, PkgInfo | null>;
}

export const useAppStore = defineStore("app", {
  state: (): Store => {
    return {
      package: {
        path: "",
        // 绝对路径
        absolute_path: "",
        name: "",
        version: "",
        description: "",
        scripts: {},
        // 当前项目的管理工具
        manager_name: "",
        dependencies: {},
        dev_dependencies: {},
      },
      // // 依赖关系数据
      // // 避免重复查询
      relationPkg: new Map<string, PkgInfo | null>(),
    };
  },
  actions: {
    updateRelationPkg({
      name,
      relation,
    }: {
      name: string;
      relation: PkgInfo | null;
    }) {
      this.relationPkg.set(name, relation);
    },
    updatePackage(payload: Pkg) {
      this.package = payload;
    },
  },
});
