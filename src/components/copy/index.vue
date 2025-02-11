<template>
  <div @click="copy(text)">
    <slot></slot>
  </div>
</template>
<script setup>
import { useClipboard } from "@vueuse/core";
defineOptions({
  name: "RsCopy",
  inheritAttrs: false,
});

const { text } = defineProps({
  text: {
    type: String,
    default: "",
  },
});
const { copy, copied } = useClipboard(text);

watch(copied, (newValue) => {
  if (newValue) {
    ElMessage.success("复制成功");
  }
});
</script>
