<template>
  <el-radio-group v-bind="$attrs">
    <el-radio v-for="item in data" :key="item.value" :value="item.value">
      <slot :data="item">
        <span>{{ item.label }}</span>
      </slot>
    </el-radio>
  </el-radio-group>
</template>
<script setup lang="ts">
import DicMap from "@/components/enum";
import type { SelectItem } from "@/components/enum.ts";
import { watchEffect } from "vue";

interface Props {
  code?: string;
  options?: SelectItem[];
}

defineOptions({
  name: "RsRadio",
  inheritAttrs: false,
});
const { code = "", options = [] } = defineProps<Props>();

const data = ref<SelectItem[]>([]);

watchEffect(() => {
  data.value = DicMap[code] || options;
});
</script>
