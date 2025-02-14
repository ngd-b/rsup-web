<template>
  <el-dialog append-to-body :model-value="visible" v-bind="$attrs">
    <template #header>
      <slot name="header"> </slot>
    </template>

    <template #default>
      <slot></slot>
    </template>

    <template #footer>
      <div class="flex justify-center gap-20px">
        <slot name="footer"></slot>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
interface Props {
  visible: boolean;
}
defineOptions({
  name: "RsDialog",
  inheritAttrs: false,
});

const { visible } = defineProps<Props>();
</script>
