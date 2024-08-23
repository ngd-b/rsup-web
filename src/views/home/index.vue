<template>
  <div class="home">
    <div class="header">
      <h2>{{ data.name }}</h2>

      <el-tag type="primary">{{ data.version }}</el-tag>
      <p>{{ data.description }}</p>
    </div>

    <div class="version-list">
      <template
        :key="index"
        v-for="(dep, index) in [dependencies, devDependencies]"
      >
        <h3>{{ index ? "devDependencies" : "dependencies" }}</h3>
        <div
          class="version-item mb-10"
          v-for="info in formatValues(dep)"
          :key="info.name"
        >
          <div class="flex gap-10 flex-items-center">
            <i
              v-if="!info.is_finish"
              class="is-loading flex-inline flex-justify-center"
            >
              <i-ep-loading />
            </i>
            <i
              v-else
              class="flex-inline flex-justify-center flex-items-center color-blue"
            >
              <i-ep-check />
            </i>

            <span>{{ info.name }}</span>
            <el-tag type="primary">{{ info.version }}</el-tag>
          </div>
          <div class="mt-10 flex flex-wrap gap-10">
            <div v-for="v in formatValues(info.versions)" :key="v.version">
              <el-tag type="success">{{ v.version }}</el-tag>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/index.js";
import Socket from "@/stores/socket.js";

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
