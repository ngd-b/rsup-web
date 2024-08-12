<template>
  <div class="home">
    <div class="header">
      <h2>{{ data.name }}</h2>

      <el-tag type="primary">{{ data.version }}</el-tag>
      <p>{{ data.description }}</p>
    </div>

    <div class="version-list">
      <h3>dependencies</h3>
      <div class="version-item" v-for="name in dependencies" :key="name">
        <div class="name">{{ name }}</div>
        <div
          class="version"
          v-for="info in ata.dependencies[name]"
          :key="info.version"
        >
          <el-tag type="success">{{ info.version }}</el-tag>
        </div>
      </div>
      <h3>devDependencies</h3>
      <div class="version-item" v-for="name in devDependencies" :key="name">
        <div class="name">{{ name }}</div>
        <div
          class="version"
          v-for="info in ata.dependencies[name]"
          :key="info.version"
        >
          <el-tag type="success">{{ info.version }}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/index.js";
import { computed } from "vue";

const appStore = useAppStore();

const data = computed(() => appStore.package);

// 开发依赖
const dependencies = computed(() => data.value.dependencies || {});
// 生产依赖
const devDependencies = computed(() => data.value.dev_dependencies || {});
</script>
