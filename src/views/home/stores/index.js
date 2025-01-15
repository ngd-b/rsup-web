import { defineStore } from "pinia";
import { ajax } from "@/ajax/index.js";
/**
 * 依赖管理
 *
 * 接口调用
 */
export const usePackageStore = defineStore("package", {
  state() {
    return {};
  },
  actions: {
    deletePackage(pkg) {
      return new Promise((resolve, reject) => {
        try {
          let params = {
            name: pkg.name,
            is_dev: pkg.is_dev,
          };
          ajax.post("/api/pkg/remove", params).then((res) => {
            if (res.success) {
              ElMessage.success("更新成功!");
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
  },
});
