import { defineStore } from "pinia";
import { LockPkg, Pkg, RelationPkgInfo } from "@/ajax/type";
import { ajax } from "@/ajax/index";

interface Store {
  // 项目依赖包信息
  package: Pkg;
  relationPkg: Record<string, RelationPkgInfo>;
  lockPackage: LockPkg;
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
      lockPackage: {
        name: "",
        version: 0,
        packages: {},
      },
    };
  },
  actions: {
    updateRelationPkg({
      name,
      relation,
    }: {
      name: string;
      relation?: RelationPkgInfo;
    }) {
      if (relation) {
        this.relationPkg[name] = relation;
      } else {
        Reflect.deleteProperty(this.relationPkg, name);
      }
    },
    updatePackage(payload: Pkg) {
      this.package = payload;
    },
    /**
     * 加载所有的依赖关系数据
     *
     * 太耗时了，数据没必要
     *
     * @returns
     */
    async loadPkgRelation() {
      try {
        ajax
          .get<Record<string, RelationPkgInfo>>("/api/pkg/realtion")
          .then((res) => {
            if (res.success) {
              Object.keys(res.data).forEach((name) => {
                this.relationPkg[name] = res.data[name];
              });
            } else {
              ElMessage.error("重新加载失败，可点击查看更新日志!");
            }
          });
      } catch (e) {
        //
        ElMessage.error("接口调用失败!");
        console.error(e);
      }
    },
    /**
     * 加载依赖lock文件
     */
    async loadLockPkgData() {
      try {
        ajax.get<LockPkg>("/api/pkg/lock").then((res) => {
          if (res.success) {
            this.lockPackage = res.data;
          } else {
            ElMessage.error("重新加载失败，可点击查看更新日志!");
          }
        });
      } catch (e) {
        //
        ElMessage.error("接口调用失败!");
        console.error(e);
      }
    },
  },
});
