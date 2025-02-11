import { defineStore } from "pinia";
import { ajax } from "@/ajax/index.js";
import { useAppStore } from "@/stores/index.js";
/**
 * 依赖管理
 *
 * 接口调用
 */
export const usePackageStore = defineStore("package", {
  state() {
    return {
      // 环境变量
      env: {},
      // 正在升级的依赖
      updating: {},
    };
  },
  actions: {
    updateUpdating(name, payload) {
      this.updating[name] = payload;
    },
    updateBatchUpdating(payload, loading = true) {
      payload.forEach((item) => {
        this.updating[item.name] = loading ? item : null;
      });
    },
    /**
     * 获取当前系统环境列表
     * @returns
     */
    updateEnvData(payload) {
      this.env = payload;
    },
    /**
     * 重新加载当前项目的依赖
     */
    reloadPackage() {
      return new Promise((resolve, reject) => {
        try {
          ajax.post("/api/pkg/reload").then((res) => {
            if (res.success) {
              resolve();
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
    batchUpdatePackage(params) {
      const appStore = useAppStore();

      this.updateBatchUpdating(params);
      return new Promise((resolve, reject) => {
        ajax.post("/api/pkg/batchUpdate", params).then(
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
              resolve();
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
    deletePackage(pkg) {
      return new Promise((resolve, reject) => {
        let params = {
          name: pkg.name,
          is_dev: pkg.is_dev,
        };
        ajax.post("/api/pkg/remove", params).then(
          (res) => {
            if (res.success) {
              ElMessage.success("依赖删除更新成功!");
              resolve();
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
    installPackage(pkg) {
      return new Promise((resolve, reject) => {
        let params = {
          name: pkg.name,
          version: pkg.version,
          is_dev: pkg.is_dev,
          is_change: pkg.is_change,
        };
        ajax.post("/api/pkg/update", params).then(
          (res) => {
            if (res.success) {
              ElMessage.success("依赖安装更新成功!");
              resolve();
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
