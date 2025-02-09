<template>
  <RsDialog :visible="visible" title="一键安装依赖" @close="handleClose">
    <template v-slot:default> </template>
    <template v-slot:footer>
      <el-button :loading="loading" @click="handleClose">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit"
        >确定</el-button
      >
    </template>
  </RsDialog>
</template>
<script setup>
import { usePackageStore } from "@/views/home/stores/index.js";
import { useAppStore } from "@/stores/index.js";
import { onMounted } from "vue";
import { ajax } from "@/ajax/index.js";
import { ElMessage } from "element-plus";
import semverSatisfies from "semver/functions/satisfies.js";
import semverCompare from "semver/functions/compare.js";

const appStore = useAppStore();
const packageStore = usePackageStore();

const { data } = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const visible = defineModel({ type: Boolean, default: false });
const loading = ref(false);

// 所有的依赖数据
const depData = computed(() =>
  Object.values(appStore.package.dependencies).concat(
    Object.values(appStore.package.dev_dependencies)
  )
);
onMounted(() => {
  // ...
});

const handleSubmit = async () => {
  try {
    let params = [];
    depData.value.forEach((dep) => {
      const [major, premajor, minor] = dep.version.split(".");

      // 确定过滤的版本
      // TODO： 这里的逻辑需要优化
      let version_range = `<${data.semver == "premajor" ? major * 1 + 1 : major}.${data.semver == "minor" ? premajor * 1 + 1 : premajor}.${minor}`;
      if (data.semver == "major") {
        let latest = dep["dist-tags"].latest;
        version_range = `<=${latest}`;
      }
      let versions = Object.keys(dep.versions).filter((v) =>
        semverSatisfies(v, `>${dep.version} ${version_range}`)
      );
      // 排序
      versions.sort((a, b) => semverCompare(a, b));
      if (versions.length) {
        params.push({
          name: dep.name,
          version: versions[versions.length - 1],
          is_dev: dep.is_dev,
          is_change: false,
        });
      }
    });
    const res = await ajax.post("/api/pkg/batchUpdate", params);
    if (res.success) {
      ElMessage.success("一键安装成功");
      handleClose();
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
const handleClose = () => {
  visible.value = false;
};
</script>
