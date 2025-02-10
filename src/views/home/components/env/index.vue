<template>
  <div class="home-env">
    <div class="env-item">
      <div
        class="env-item-title flex gap-5px flex-items-center b-rd-5px bg-gray-200 p-x-15px p-y-5px"
      >
        <span>Node</span>
        <el-tooltip content="当前系统Node版本">
          <i-ep-question-filled class="h-14px w-14px op-80" />
        </el-tooltip>
      </div>
      <div class="env-item-content p-15px op-70">
        <span>{{ envData.node?.version }}</span>
      </div>
    </div>
    <div class="env-item">
      <div class="env-item-title b-rd-5px bg-gray-200 p-x-15px p-y-5px">
        <span>依赖管理工具</span>
      </div>
      <div class="env-item-content flex flex-col gap-10px p-15px op-70">
        <div
          class="env-item flex cursor-pointer justify-between b-rd-5px bg-gray-100 p-x-5px p-y-5px hover:bg-gray-200"
          :class="data.manager_name == item.name ? 'bg-gray-300' : ''"
          v-for="item in npmEnvData"
          :key="item.name"
        >
          <span>{{ item.name }}@{{ item.version }}</span>

          <el-tag v-if="data.manager_name == item.name">当前项目</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
// import { ajax } from "@/ajax/index.js";
import useAjax from "@/ajax/useAjax.js";
import { useAppStore } from "@/stores/index.js";
import { usePackageStore } from "@/views/home/stores/index.js";

const appStore = useAppStore();
const packageStore = usePackageStore();
// const loading = ref(false);
const envData = ref({});

const data = computed(() => appStore.package);

const npmEnvData = computed(() =>
  Object.keys(envData.value)
    .filter((key) => key != "node")
    .map((key) => envData.value[key])
);

const { loading, data: apiData } = useAjax("get", "/api/env/get");

watch([loading, apiData], ([loading, data]) => {
  if (!loading && data) {
    envData.value = { ...data };
    packageStore.updateEnvData(data);
  }
});
onMounted(() => {
  //
});
</script>
