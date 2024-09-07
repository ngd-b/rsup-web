<template>
  <p>{{ data.name }}</p>
  <render-md :data="data.readme" />
</template>
<script setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/index.js";

const props = defineProps({
  is_dev: String,
  name: String,
});
const appStore = useAppStore();

const data = computed(() => {
  const { dev_dependencies, dependencies } = appStore.package;

  if (props.is_dev == "1") {
    return dev_dependencies ? dev_dependencies[props.name] : {};
  } else {
    return dependencies ? dependencies[props.name] : {};
  }
});
</script>
