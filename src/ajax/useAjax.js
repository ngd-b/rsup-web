import { onMounted } from "vue";
import { ajax } from "./index.js";

/**
 * hooks - ajax
 * @param {*} url
 * @param {*} options
 * @returns
 */
export default function useAjax(method, url, options = {}) {
  let loading = ref(false);
  let data = ref(null);
  let error = ref(null);

  onMounted(() => {
    loading.value = true;
    ajax({ method, url, ...options }).then(
      (res) => {
        loading.value = false;
        if (res.success) {
          data.value = res.data;
        } else {
          error.value = res.msg;
        }
      },
      (e) => {
        loading.value = false;
        error.value = e;
        ElMessage.error("接口调用失败!");
      }
    );
  });

  return {
    loading,
    data,
    error,
  };
}
