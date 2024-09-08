<template>
  <div class="readme-view m-auto max-w-800">
    <div class="title flex gap-5 flex-items-center">
      <i class="flex cursor-pointer flex-items-center" @click="handleClose">
        <i-ep-arrowLeftBold />
      </i>

      <p>{{ data.name }}</p>
    </div>

    <render-md :data="data.readme" />
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/index.js";
import { useRouter } from "vue-router";

const router = useRouter();
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

function handleClose() {
  router.back();
}
</script>
