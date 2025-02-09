<template>
  <div class="batch-btn flex flex-col gap-15px p-x-20px">
    <template v-if="!data.manager_name">
      <el-button type="primary" @click="handleClick('quick')">
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
          @click="handleClick('update', { semver: 'minor' })"
          >一键版本(minor)升级</el-button
        >
      </el-tooltip>

      <el-tooltip
        :show-after="1000"
        content="谨慎升级，会带来一些新的特性，可能会有一些不兼容"
      >
        <el-button
          type="warning"
          @click="handleClick('update', { semver: 'premajor' })"
          >一键版本(premajor)升级</el-button
        >
      </el-tooltip>

      <el-tooltip
        :show-after="1000"
        content="不建议升级，可能会带来一些破坏性的改变"
      >
        <el-button
          type="danger"
          @click="handleClick('update', { semver: 'major' })"
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
<script setup>
import { useAppStore } from "@/stores/index.js";
//
import QuickInstll from "./quickInstallDialog.vue";
import UpdateDeps from "./updateDepsDialog.vue";

const TypeMapComponent = {
  quick: QuickInstll,
  update: UpdateDeps,
};
const appStore = useAppStore();
const data = computed(() => appStore.package);
const dialog = reactive({
  type: "",
  visible: false,
  data: {},
});

const dynamicComponent = computed(() => {
  return TypeMapComponent[dialog.type];
});
const handleClick = (type, data) => {
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
