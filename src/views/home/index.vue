<template>
  <div class="home">
    <div class="header">
      <h2>{{ data.name }}</h2>

      <el-tag type="primary">{{ data.version }}</el-tag>
      <p>{{ data.description }}</p>
    </div>

    <div class="version-list">
      <h3>dependencies</h3>
      <div
        class="version-item"
        v-for="name in formatValues(dependencies)"
        :key="name"
      >
        <div class="name">{{ name }}</div>

        <div
          class="version"
          v-for="info in dependencies[name].versions"
          :key="info.version"
        >
          <el-tag type="success">{{ info.version }}</el-tag>
        </div>
      </div>
      <h3>devDependencies</h3>
      <div
        class="version-item"
        v-for="info in formatValues(devDependencies)"
        :key="info.name"
      >
        <div class="name">
          <span>{{ info.name }}</span>
          <el-tag type="primary">{{ info.version }}</el-tag>
        </div>
        <div
          class="version"
          v-for="v in formatValues(info.versions)"
          :key="v.version"
        >
          <el-tag type="success">{{ v.version }}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/index.js";
import { computed, onMounted } from "vue";
import Socket from "@/stores/socket.js";
import { ElMessage } from "element-plus";

const appStore = useAppStore();

const data = computed(() => appStore.package);

// 开发依赖
const dependencies = computed(() => data.value.dependencies || {});
// 生产依赖
const devDependencies = computed(() => data.value.dev_dependencies || {});

const socket = new Socket();

onMounted(() => {
  socket.connect("ws://127.0.0.1:8080/ws");
  socket.on("onmessage", handleReceiveData);
  socket.on("onopen", () => {
    ElMessage.success("连接成功!");
    console.log("open");
  });
  socket.on("onerror", (e) => {
    ElMessage.warning("连接失败，请检查服务是否启动!");
    console.error(e);
  });
});

/**
 * 接收到数据
 */
function handleReceiveData(data) {
  data = JSON.parse(data.data);

  console.log(data);
  appStore.updatePakage(data);
}

function formatValues(obj) {
  return Object.values(obj);
}
</script>
