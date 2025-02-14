<template>
  <el-select placeholder="请选择" clearable v-bind="$attrs">
    <el-option
      v-for="item in data"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
<script setup lang="ts">
import DicMap from "@/components/enum";
import type { SelectItem } from "@/components/enum.ts";
import { watchEffect } from "vue";

interface Props {
  code: string;
}
defineOptions({
  name: "RsSelect",
  inheritAttrs: false,
});
const { code } = defineProps<Props>();

const data = ref<SelectItem[]>([]);

watchEffect(() => {
  data.value = DicMap[code] || [];
});
</script>
