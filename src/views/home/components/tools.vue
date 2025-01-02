<template>
  <div ref="root" class="flex cursor-pointer gap-10px flex-items-center op-60">
    <el-tooltip content="升级历史">
      <i
        class="i-material-symbols-history"
        @click="handleShowPopover('history')"
      />
    </el-tooltip>
    <el-tooltip content="升级配置">
      <i class="i-ep-setting" />
    </el-tooltip>
  </div>
  <el-popover ref="popoverRef" :virtual-ref="root" virtual-triggering>
    <component :is="dynamicComponent" :data="data" />
  </el-popover>
</template>
<script setup>
import History from "./history.vue";

const TypeMapComponent = {
  history: History,
  setting: null,
};
const { data = {} } = defineProps({
  data: {
    type: Object,
  },
});

const root = ref(null);
const activeType = ref(null);
const dynamicComponent = computed(() => TypeMapComponent[activeType.value]);

const handleShowPopover = (type) => {
  activeType.value = type;
};
</script>
