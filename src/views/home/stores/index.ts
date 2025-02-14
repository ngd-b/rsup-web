import { defineStore } from "pinia";
import { ajax } from "@/ajax/index.js";
import { useAppStore } from "@/stores/index.js";
import { EnvConfig, UpdatePkg, RemovePkg } from "@/ajax/type/index";

type Updating = Pick<UpdatePkg, "name" | "version">;

interface Store {
  env: EnvConfig;
  updating: Record<string, Partial<Updating> | null>;
}
/**
 * 依赖管理
 *
 * 接口调用
 */
export const usePackageStore = defineStore("package", {
  state: (): Store => {
    return {
      // 环境变量
      env: {},
      // 正在升级的依赖
      updating: {},
    };
  },
  actions: {
    updateUpdating(name: string, payload: Partial<Updating> | null) {
      this.updating[name] = payload;
    },
    updateBatchUpdating(payload: Updating[], loading = true) {
      payload.forEach((item) => {
        this.updating[item.name] = loading ? item : null;
      });
    },
    /**
     * 获取当前系统环境列表
     * @returns
     */
    updateEnvData(payload: Partial<EnvConfig>) {
      this.env = payload;
    },
    /**
     * 重新加载当前项目的依赖
     */
    reloadPackage() {
      return new Promise((resolve, reject) => {
        try {
          ajax.post<string, null>("/api/pkg/reload").then((res) => {
            if (res.success) {
              resolve(res);
            } else {
              ElMessage.error("重新加载失败，可点击查看更新日志!");
              reject();
            }
          });
        } catch (e) {
          //
          ElMessage.error("接口调用失败!");
          console.error(e);
          reject();
        }
      });
    },
    /**
     * 批量升级依赖
     *
     */
    batchUpdatePackage(params: UpdatePkg[]) {
      const appStore = useAppStore();

      this.updateBatchUpdating(params);
      return new Promise((resolve, reject) => {
        ajax.post<string[], UpdatePkg[]>("/api/pkg/batchUpdate", params).then(
          (res) => {
            this.updateBatchUpdating(params, false);
            if (res.success) {
              // ElMessage.success("依赖安装更新成功!");
              // 升级成功的需要清除之前缓存的依赖关系图
              res.data.forEach((name) => {
                appStore.updateRelationPkg({ name, relation: null });
              });
              ElNotification({
                type: "success",
                message: `成功安装依赖${res.data.length}个，失败${params.length - res.data.length}个，详情查看升级日志！`,
              });
              resolve(res);
            } else {
              ElMessage.error("依赖安装失败，可点击查看更新日志!");
              reject();
            }
          },
          (e) => {
            ElMessage.error("接口调用失败!");
            console.error(e);
            this.updateBatchUpdating(params, false);
            reject();
          }
        );
      });
    },
    /**
     * 删除指定依赖
     * @param {*} pkg
     * @returns
     */
    deletePackage(pkg: RemovePkg) {
      return new Promise((resolve, reject) => {
        const params = {
          name: pkg.name,
          is_dev: pkg.is_dev,
        };
        ajax.post("/api/pkg/remove", params).then(
          (res) => {
            if (res.success) {
              ElMessage.success("依赖删除更新成功!");
              resolve(res);
            } else {
              ElMessage.error("删除失败，可点击查看更新日志!");
              reject();
            }
          },
          (e) => {
            ElMessage.error("接口调用失败!");
            console.error(e);
            reject();
          }
        );
      });
    },
    /**
     * 安装依赖
     * @param {*} pkg
     * @returns
     */
    installPackage(pkg: UpdatePkg) {
      return new Promise((resolve, reject) => {
        ajax.post("/api/pkg/update", pkg).then(
          (res) => {
            if (res.success) {
              ElMessage.success("依赖安装更新成功!");
              resolve(res);
            } else {
              ElMessage.error("依赖安装失败，可点击查看更新日志!");
              reject();
            }
          },
          (e) => {
            ElMessage.error("接口调用失败!");
            console.error(e);
            reject();
          }
        );
      });
    },
  },
});
