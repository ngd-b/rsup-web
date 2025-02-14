import { onMounted } from "vue";
import { ajax } from "./index";
import { AxiosRequestConfig } from "axios";
/**
 * hooks - ajax
 * @param {*} url
 * @param {*} options
 * @returns
 */
export default function useAjax<T>(
  method: string,
  url: string,
  options: AxiosRequestConfig = {}
) {
  let loading = ref<boolean>(false);
  let data = ref<T>();
  let error = ref<string>();

  onMounted(() => {
    loading.value = true;
    ajax.request<T>({ method, url, ...options }).then(
      (res) => {
        const { success, data: apiData, msg } = res;
        loading.value = false;
        if (success) {
          data.value = apiData;
        } else {
          error.value = msg;
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
