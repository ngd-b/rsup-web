<template>
  <div class="batch-btn flex flex-col gap-15px p-x-20px">
    <template v-if="!data.manager_name">
      <el-button type="primary" @click="handleClick(Type.Quick)">
        <span>一键安装</span>
      </el-button>
      <el-alert
        type="warning"
        :closable="false"
        description="当前项目未安装依赖，可一键安装☝"
      />
    </template>

    <template v-else>
      <el-tooltip :show-after="1000" content="建议升级，解决一些潜在的bug">
        <el-button
          type="primary"
          @click="handleClick(Type.Update, { semver: 'patch' })"
          >一键版本(patch)升级</el-button
        >
      </el-tooltip>

      <el-tooltip
        :show-after="1000"
        content="谨慎升级，会带来一些新的特性，可能会有一些不兼容"
      >
        <el-button
          type="warning"
          @click="handleClick(Type.Update, { semver: 'minor' })"
          >一键版本(minor)升级</el-button
        >
      </el-tooltip>

      <el-tooltip
        :show-after="1000"
        content="不建议升级，可能会带来一些破坏性的改变"
      >
        <el-button
          type="danger"
          @click="handleClick(Type.Update, { semver: 'major' })"
          >一键版本(major)升级</el-button
        >
      </el-tooltip>
    </template>
  </div>
  <template v-if="dialog.visible">
    <component
      :is="dynamicComponent"
      v-model="dialog.visible"
      :data="dialog.data"
    />
  </template>
</template>
<script setup lang="ts">
import { useAppStore } from "@/stores/index.js";
//
import QuickInstll from "./quickInstallDialog.vue";
import UpdateDeps from "./updateDepsDialog.vue";

enum Type {
  Quick = "quick",
  Update = "update",
}
type DialogData = Partial<{
  semver: string;
}>;
const TypeMapComponent: Record<Type, Component> = {
  quick: QuickInstll,
  update: UpdateDeps,
};
const appStore = useAppStore();
const data = computed(() => appStore.package);
const dialog = reactive<{ type: Type; visible: boolean; data?: DialogData }>({
  type: Type.Quick,
  visible: false,
  data: {},
});

const dynamicComponent = computed<Component>(() => {
  return TypeMapComponent[dialog.type];
});
const handleClick = (type: Type, data?: DialogData) => {
  dialog.type = type;
  dialog.visible = true;
  dialog.data = data;
  // 版本批量升级
};
</script>
<style lang="less" scoped>
.batch-btn {
  .el-button + .el-button {
    margin: 0;
  }
}
</style>
