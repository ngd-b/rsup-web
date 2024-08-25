<template>
  <router-view v-slot="{ Component }">
    <Transition mode="out-in">
      <el-config-provider size="small" :z-index="3000">
        <component :is="Component" />
      </el-config-provider>
    </Transition>
  </router-view>
</template>
<script>
import { ElConfigProvider } from "element-plus";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    ElConfigProvider,
  },
  setup() {
    return {};
  },
});
</script>
