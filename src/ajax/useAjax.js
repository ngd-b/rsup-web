import { onMounted, reactive } from "vue";
import ajax from "./index.js";

export default function useAjax(url, options) {
  let loading = ref(false);
  let data = reactive(null);
  let error = ref(null);

  onMounted(() => {
    ajax({ ...options, url }).then(
      (res) => {
        if (res.success) {
          data = res.data;
        } else {
          error = res.msg;
        }
      },
      (e) => {
        error = e;
      }
    );
  });

  return {
    loading,
    data,
    error,
  };
}
