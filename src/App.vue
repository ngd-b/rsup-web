<template>
  <div
    class="fixed right-10px top-15px flex cursor-pointer gap-10px flex-items-center b-rd-15px p-x-15px p-y-5px shadow"
  >
    <div
      @click="handleViewGithub"
      class="i-simple-icons:github h-20px w-20px"
    ></div>
  </div>
  <el-config-provider size="small" :z-index="3000" :locale="locale">
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <Transition mode="out-in" name="el-fade-in">
          <Suspense>
            <component :is="Component" />
            <template #fallback> Loading... </template>
          </Suspense>
        </Transition>
      </template>
    </router-view>
  </el-config-provider>
</template>
<script>
import { ElConfigProvider } from "element-plus";
import { defineComponent, ref } from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import Socket from "@/stores/socket.js";
import { useAppStore } from "@/stores/index.js";

export default defineComponent({
  components: {
    ElConfigProvider,
  },
  setup() {
    let socket = ref(null);
    socket.value = new Socket();

    // store 实例
    const appStore = useAppStore();

    return {
      locale: zhCn,
      socket,
      appStore,
    };
  },
  mounted() {
    // 发起socket通信
    this.initSocket();
  },
  methods: {
    handleViewGithub() {
      window.open("https://github.com/ngd-b/rsup.git");
    },
    /**
     * 接收到数据
     */
    handleReceiveData(data) {
      data = JSON.parse(data.data);

      this.appStore.updatePackage(data);
    },

    initSocket() {
      this.socket.connect(
        import.meta.env.VITE_SOCKET_URL || `ws://${window.location.host}/ws`
      );
      this.socket.on("onmessage", this.handleReceiveData);
      this.socket.on("onopen", () => {
        ElMessage.success("连接成功!");
        console.log("open");
      });
      this.socket.on("onclose", (e) => {
        ElMessage.error("服务已断开!");
        console.error(e);
      });
      this.socket.on("onerror", (e) => {
        ElMessage.warning("连接失败，请检查服务是否启动!");
        console.error(e);
        // 10s后重新连接
        setTimeout(() => {
          this.initSocket();
        }, 10 * 1000);
      });
    },
  },
});
</script>
