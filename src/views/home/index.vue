<template>
  <div class="home m-auto max-w-800">
    <div class="header">
      <h2>
        {{ data.name }}
        <el-tag type="primary">{{ data.version }}</el-tag>
      </h2>

      <p>{{ data.description }}</p>
    </div>
    <!-- <div class="mt-15 mb-15 flex gap-10">
      <el-button type="primary">主版本更新</el-button>
      <el-button type="primary">次版本更新</el-button>
      <el-button type="primary">修订版本更新</el-button>
    </div> -->
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
              class="an flex-inline animate-duration-1s animate-ease-linear animate-count-infinite flex-justify-center animate-rotate-360"
            >
              <i-ep-loading />
            </i>
            <i
              v-else
              class="flex-inline flex-justify-center flex-items-center color-blue"
            >
              <i-ep-check />
            </i>

            <span>
              {{ info.name }}
            </span>

            <el-tag type="primary">{{ info.version }}</el-tag>
            <el-tag type="success">
              latest：{{ info["dist-tags"].latest }}
            </el-tag>
            <div
              class="flex flex-items-center overflow-hidden"
              v-if="updating[info.name]"
            >
              <i
                class="animate-slide-in-up animate-duration-1s animate-count-infinite color-yellow-500"
              >
                <i-ep-top />
              </i>

              <el-tag type="primary">{{ updating[info.name].version }}</el-tag>
            </div>
          </div>
          <div class="p-l-30" v-if="info.is_finish">
            <div class="bg-current color-gray-100">
              <p class="p-10 font-size-14 color-gray-500">
                {{ info.description }}
              </p>
            </div>

            <div class="mt-10 flex flex-wrap gap-10">
              <div v-for="v in formatValues(info.versions)" :key="v.version">
                <span
                  @click="handleCopy(info, v)"
                  class="cursor-pointer border border-rd-3 border-solid border-r-none p-l-5 p-r-5 font-size-12 color-blue-500"
                  >{{ v.version }}</span
                >
                <el-popconfirm
                  title="确认升级为该版本？"
                  width="200px"
                  @confirm="() => handleUpdate(info, v, index == 1)"
                >
                  <template #reference>
                    <span
                      class="cursor-pointer border border-rd-3 border-solid p-l-5 p-r-5 font-size-12 color-yellow-500"
                      >up</span
                    >
                  </template>
                </el-popconfirm>
              </div>
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
// import useAjax from "@/ajax/useAjax.js";
import { ajax } from "@/ajax/index.js";

const appStore = useAppStore();
// 正在升级的依赖
const updating = ref({});

const data = computed(() => appStore.package);

// 开发依赖
const dependencies = computed(() => data.value.dependencies || {});
// 生产依赖
const devDependencies = computed(() => data.value.dev_dependencies || {});

const socket = new Socket();

onMounted(() => {
  initSocket();
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
// 复制当前版本
function handleCopy(info, v) {
  let name = info.name + "@" + v.version;
  navigator.clipboard.writeText(name).then(() => {
    ElMessage.success("复制成功!");
  });
}

function initSocket() {
  socket.connect(
    import.meta.env.VITE_SOCKET_URL || `ws://${window.location.host}/ws`
  );
  socket.on("onmessage", handleReceiveData);
  socket.on("onopen", () => {
    ElMessage.success("连接成功!");
    console.log("open");
  });
  socket.on("onclose", (e) => {
    ElMessage.error("服务已断开!");
    console.error(e);
  });
  socket.on("onerror", (e) => {
    ElMessage.warning("连接失败，请检查服务是否启动!");
    console.error(e);
    // 10s后重新连接
    setTimeout(() => {
      initSocket();
    }, 10 * 1000);
  });
}

/**
 * 指定更新到某个版本
 */
async function handleUpdate(info, version, is_dev) {
  if (updating.value[info.name]) {
    ElMessage.warning("正在更新，请稍后!");
    return;
  }
  try {
    let params = {
      name: info.name,
      version: version.version,
      is_dev,
    };
    updating.value[info.name] = {
      version: version.version,
    };
    let res = await ajax.post("/api/updatePkg", params);
    if (res.success) {
      ElMessage.success("更新成功!");
    } else {
      ElMessage.error("更新失败，可点击查看更新日志!");
    }
  } catch (e) {
    //
    ElMessage.error("接口调用失败!");
    console.error(e);
  } finally {
    updating.value[info.name] = null;
  }
}
</script>
