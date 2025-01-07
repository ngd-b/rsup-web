<template>
  <Handle type="target" position="left" :connectable="false" />
  <Handle type="source" position="right" :connectable="false" />
  <div
    class="relation-node b-gray-200 b-rd-5px border-solid bg-#fff p-x-20px p-b-10px shadow"
  >
    <div class="flag flex justify-end gap-10px flex-items-center p-y-5px">
      <el-tooltip :content="data.is_peer ? 'peerDependencies' : 'dependencies'">
        <span
          class="inline-block h-15px w-15px border-rd-50% bg-primary"
        ></span>
      </el-tooltip>
      <template v-if="data.is_loop">
        <el-tooltip content="循环依赖">
          <span
            class="inline-block h-15px w-15px border-rd-50% bg-error"
          ></span>
        </el-tooltip>
      </template>
    </div>
    <div class="label nodrag flex items-center gap-10px">
      <span>{{ data.label }}</span>
      <span class="font font-size-12px" font="size-12px" text="color-#67c23a"
        >(v{{ data.version }})</span
      >
    </div>
  </div>
</template>
<script setup>
import { Handle } from "@vue-flow/core";
const { data } = defineProps({
  data: Object,
});
</script>
