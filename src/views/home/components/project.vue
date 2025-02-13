<template>
  <div class="b-rd-5px p-x-15px p-y-5px shadow">
    <div class="flex gap-15px flex-items-center">
      <h2 class="flex gap-5px flex-items-center">
        <span>{{ data.name }}</span>
        <el-tag type="primary">{{ data.version }}</el-tag>
      </h2>
      <div class="flex gap-5px flex-items-center">
        <el-tooltip content="重新加载">
          <div
            class="cursor-pointer b-rd-5px bg-primary bg-op-20 p-3px color-primary hover:bg-op-60"
          >
            <div class="i-material-symbols:refresh" @click="handleReload" />
          </div>
        </el-tooltip>
        <el-tooltip :content="data.absolute_path">
          <div
            class="cursor-pointer b-rd-5px bg-primary bg-op-20 p-3px color-primary hover:bg-op-60"
          >
            <RsCopy :text="data.absolute_path">
              <div class="i-material-symbols:drive-file-move-rounded"></div>
            </RsCopy>
          </div>
        </el-tooltip>
      </div>
    </div>
    <p class="p-x-10px p-y-5px">{{ data.description }}</p>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from "@/stores/index.js";
import { usePackageStore } from "@/views/home/stores/index";
import { ElMessage } from "element-plus";
import { ref } from "vue";

const appStore = useAppStore();
const packageStore = usePackageStore();
const data = computed(() => appStore.package);
const isReload = ref(false);
const handleReload = () => {
  if (isReload.value) {
    ElMessage.warning("重新加载中，请稍后!");
    return;
  }
  isReload.value = true;
  packageStore.reloadPackage().then(
    () => {
      isReload.value = false;
    },
    () => {
      isReload.value = false;
    }
  );
};
</script>
