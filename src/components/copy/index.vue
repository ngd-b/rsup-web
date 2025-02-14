<template>
  <div @click="copy(text)">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

interface Props {
  text: string;
}
defineOptions({
  name: "RsCopy",
  inheritAttrs: false,
});

const { text } = defineProps<Props>();
const { copy, copied } = useClipboard({ source: text });

watch(copied, (newValue) => {
  if (newValue) {
    ElMessage.success("复制成功");
  }
});
</script>
