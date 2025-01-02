<template>
  <div class="h-180px w-160px b-rd-10px bg-#fff p-15px">
    <el-empty v-if="versions.length < 1" description="暂无升级历史" />

    <div v-else class="flex flex-col gap-5px">
      <div
        class="flex cursor-pointer flex-items-center b-rd-5px p-y-10px p-l-15px transition-all hover:bg-gray-200"
        :class="data.version == item ? 'bg-gray-200' : ''"
        v-for="item in versions"
        :key="item"
      >
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/index.js";
import { computed } from "vue";
const { data = {} } = defineProps({
  data: Object,
});

const store = useAppStore();

const versions = computed(() => store.upPkg[data.name] || []);
</script>
