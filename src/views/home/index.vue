<template>
  <div class="home h-full w-full flex flex-wrap gap-20px">
    <!-- 环境 -->
    <EnvConfig class="flex-basis-300px overflow-auto p-x-15px" />
    <!-- 依赖信息 -->
    <Dependence class="flex-grow-1 flex-basis-500px overflow-auto p-x-15px" />
    <!-- 依赖排行榜 -->
    <Summary class="flex-basis-400px overflow-auto p-x-15px" />
  </div>
</template>
<script setup>
import Dependence from './components/dependence/index.vue'
import EnvConfig from './components/env/index.vue'
import Summary from './components/summary/index.vue'
</script>
