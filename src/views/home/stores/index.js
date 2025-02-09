import { defineStore } from "pinia";
import { ajax } from "@/ajax/index.js";
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
    };
  },
  actions: {
    /**
     * 获取当前系统环境列表
     * @returns
     */
    updateEnvData(payload) {
      this.env = payload;
    },
    /**
     * 删除指定依赖
     * @param {*} pkg
     * @returns
     */
    deletePackage(pkg) {
      return new Promise((resolve, reject) => {
        try {
          let params = {
            name: pkg.name,
            is_dev: pkg.is_dev,
          };
          ajax.post("/api/pkg/remove", params).then((res) => {
            if (res.success) {
              ElMessage.success("依赖删除更新成功!");
              resolve();
            } else {
              ElMessage.error("删除失败，可点击查看更新日志!");
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
     * 安装依赖
     * @param {*} pkg
     * @returns
     */
    installPackage(pkg) {
      return new Promise((resolve, reject) => {
        try {
          let params = {
            name: pkg.name,
            version: pkg.version,
            is_dev: pkg.is_dev,
            is_change: pkg.is_change,
          };
          ajax.post("/api/pkg/update", params).then((res) => {
            if (res.success) {
              ElMessage.success("依赖安装更新成功!");
              resolve();
            } else {
              ElMessage.error("依赖安装失败，可点击查看更新日志!");
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
  },
});
