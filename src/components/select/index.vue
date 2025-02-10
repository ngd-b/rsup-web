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
<script setup>
import * as Enums from "@/components/enum.js";
import { watch } from "less";
import { watchEffect } from "vue";

defineOptions({
  name: "RsSelect",
  inheritAttrs: false,
});
const { code } = defineProps({ code: { type: String, required: true } });

const data = ref([]);

watchEffect(() => {
  data.value = Enums[code] || [];
});
</script>
