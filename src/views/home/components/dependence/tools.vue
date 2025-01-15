<template>
  <div ref="root" class="flex cursor-pointer gap-10px flex-items-center op-60">
    <!-- <el-tooltip content="升级历史">
      <i
        class="i-material-symbols-history"
        @click="handleShowPopover('history')"
      />
    </el-tooltip>
    <el-tooltip content="升级配置">
      <i class="i-ep-setting" />
    </el-tooltip> -->
    <el-tooltip content="查看依赖主页">
      <div class="b-rd-5px bg-gray-200 p-3px hover:bg-gray-400">
        <div
          class="i-material-symbols:home-outline"
          @click="handleClickTools('home')"
        />
      </div>
    </el-tooltip>
    <el-tooltip content="查看依赖关系">
      <div class="b-rd-5px bg-gray-200 p-3px hover:bg-gray-400">
        <div
          class="i-material-symbols:conversion-path"
          @click="handleClickTools('relation')"
        />
      </div>
    </el-tooltip>
    <el-tooltip content="删除依赖">
      <div
        class="b-rd-5px bg-red-200 p-3px color-error hover:bg-red-400 hover:color-white"
      >
        <div
          class="i-material-symbols:delete-outline"
          @click="handleClickTools('delete')"
        />
      </div>
    </el-tooltip>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { usePackageStore } from "@/views/home/stores/index.js";

const packageStore = usePackageStore();
const router = useRouter();
const { data = {} } = defineProps({
  data: {
    type: Object,
  },
});
const loadings = ref({
  delete: false,
});

const root = ref(null);
const handleClickTools = (type) => {
  switch (type) {
    case "home":
      window.open(data.homepage, "__blank");
      break;
    case "relation":
      router.push({ path: `/${encodeURIComponent(data.name)}/relation` });
      break;
    case "delete":
      loadings.value.delete = true;
      packageStore.deletePackage(data).then(
        () => {
          // 删除成功
          loadings.value.delete = false;
        },
        () => {
          loadings.value.delete = false;
        }
      );
      break;
    default:
  }
};
</script>
