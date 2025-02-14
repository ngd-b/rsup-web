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
<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "@/stores/index";
import { useRouter } from "vue-router";
import { PkgInfo } from "@/ajax/type";

interface Props {
  is_dev: string;
  name: string;
}
const router = useRouter();
const props = defineProps<Props>();
const appStore = useAppStore();

const data = computed<PkgInfo>(() => {
  const { dev_dependencies, dependencies } = appStore.package;

  if (props.is_dev == "1") {
    return dev_dependencies[props.name];
  } else {
    return dependencies[props.name];
  }
});

function handleClose() {
  router.back();
}
</script>
