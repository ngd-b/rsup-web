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
      <div
        class="b-rd-5px bg-primary bg-op-20 p-3px color-primary hover:bg-op-60"
      >
        <div
          class="i-material-symbols:home-outline"
          @click="handleClickTools(ToolsType.Home)"
        />
      </div>
    </el-tooltip>
    <el-tooltip content="查看依赖关系">
      <div
        class="b-rd-5px bg-primary bg-op-20 p-3px color-primary hover:bg-op-60"
      >
        <div
          class="i-material-symbols:conversion-path"
          @click="handleClickTools(ToolsType.Relation)"
        />
      </div>
    </el-tooltip>
    <template v-if="!data.is_del">
      <el-tooltip
        :content="
          data.is_dev ? '转换为dependencies依赖' : '转换为devDependencies依赖'
        "
      >
        <div
          class="b-rd-5px bg-primary bg-op-20 p-3px color-primary hover:bg-op-60"
        >
          <div
            class="i-material-symbols:transform"
            @click="handleClickTools(ToolsType.Transfer)"
          />
        </div>
      </el-tooltip>
    </template>
    <template v-if="data.is_del">
      <el-tooltip content="重新安装依赖，也可以选择下面最新版本进行安装">
        <div
          class="b-rd-5px bg-warning bg-op-20 p-3px color-warning hover:bg-op-60"
        >
          <div
            class="i-material-symbols:restore-page-outline"
            @click="handleClickTools(ToolsType.Restore)"
          />
        </div>
      </el-tooltip>
    </template>
    <template v-if="!data.is_del">
      <el-tooltip content="删除依赖">
        <div
          class="b-rd-5px bg-red-200 p-3px color-error hover:bg-red-400 hover:color-white"
        >
          <div
            class="i-material-symbols:delete-outline"
            @click="handleClickTools(ToolsType.Delete)"
          />
        </div>
      </el-tooltip>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { usePackageStore } from "@/views/home/stores/index.js";
import { PkgInfo } from "@/ajax/type";

interface Props {
  data: PkgInfo;
}
enum ToolsType {
  Home = "home",
  Relation = "relation",
  Delete = "delete",
  Restore = "restore",
  Transfer = "transfer",
}

const packageStore = usePackageStore();
const router = useRouter();
const { data } = defineProps<Props>();
const loadings = ref<Partial<Record<ToolsType, boolean>>>({
  delete: false,
  restore: false,
  transfer: false,
});

const root = ref(null);
const handleClickTools = (type: ToolsType) => {
  switch (type) {
    case ToolsType.Home:
      window.open(data.homepage, "__blank");
      break;
    case ToolsType.Relation:
      router.push({ path: `/${encodeURIComponent(data.name)}/relation` });
      break;
    case ToolsType.Delete:
      if (loadings.value.delete) {
        ElMessage.warning("正在删除，请稍后!");
        return;
      }
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
    case ToolsType.Restore:
      if (loadings.value.restore) {
        ElMessage.warning("正在恢复安装，请稍后!");
        return;
      }
      // 恢复安装
      loadings.value.restore = true;
      packageStore.installPackage(data).then(
        () => {
          // 删除成功
          loadings.value.restore = false;
        },
        () => {
          loadings.value.restore = false;
        }
      );
      break;
    case ToolsType.Transfer:
      if (loadings.value.transfer) {
        ElMessage.warning("正在切换安装，请稍后!");
        return;
      }
      // 恢复安装
      loadings.value.transfer = true;
      packageStore.installPackage({ ...data, is_change: true }).then(
        () => {
          // 删除成功
          loadings.value.transfer = false;
        },
        () => {
          loadings.value.transfer = false;
        }
      );
      break;
    default:
  }
};
</script>
