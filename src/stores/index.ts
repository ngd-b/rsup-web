import { defineStore } from "pinia";
import { Pkg, RelationPkgInfo } from "@/ajax/type";

interface Store {
  package: Pkg;
  relationPkg: Record<string, RelationPkgInfo | null>;
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
      relationPkg: {},
    };
  },
  actions: {
    updateRelationPkg({
      name,
      relation,
    }: {
      name: string;
      relation: RelationPkgInfo | null;
    }) {
      this.relationPkg[name] = relation;
    },
    updatePackage(payload: Pkg) {
      this.package = payload;
    },
  },
});
