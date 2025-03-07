<template>
  <div class="home h-full w-full flex flex-wrap gap-15px overflow-auto">
    <div
      class="flex flex-grow-1 flex-basis-300px flex-col gap-20px overflow-auto p-15px"
    >
      <Project />
      <BatchBtn />
      <!-- 环境 -->
      <EnvConfig />
    </div>

    <!-- 依赖信息 -->
    <Dependence class="flex-grow-1 flex-basis-500px overflow-auto p-15px" />
    <!-- 依赖排行榜 -->
    <Summary class="flex-grow-1 flex-basis-400px overflow-auto p-15px" />
  </div>
</template>
<script setup lang="ts">
import Dependence from "./components/dependence/index.vue";
import EnvConfig from "./components/env/index.vue";
import Summary from "./components/summary/index.vue";
import Project from "./components/project.vue";
// 一键安装操作
import BatchBtn from "./components/batch-btn/index.vue";
</script>
