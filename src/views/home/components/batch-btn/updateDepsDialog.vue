<template>
  <RsDialog
    :visible="visible"
    :title="`一键安装(${data.semver})依赖`"
    @close="handleClose"
  >
    <template v-slot:default>
      <el-alert
        type="warning"
        :closable="false"
        description="确保对当前升级的依赖更新有了解，避免升级后项目运行出错!🥸"
      />
      <el-empty
        v-if="up_versions.length < 1"
        description="当前没有可升级的依赖!"
      />
      <div class="flex flex-col gap-10px" v-else>
        <div
          class="flex justify-between flex-items-center p-5px"
          v-for="item in up_versions"
          :key="item.name"
        >
          <div class="flex gap-10px flex-items-center">
            <el-checkbox v-model="item.is_up">
              {{ item.name }}
            </el-checkbox>
          </div>
          <div class="flex gap-10px flex-items-center">
            <span>{{ item.oldVersion }}</span>
            <el-tag type="success">-></el-tag>
            <span>{{ item.version }}</span>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <el-button :loading="loading" @click="handleClose">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit"
        >确定</el-button
      >
    </template>
  </RsDialog>
</template>
<script setup lang="tsx">
import { usePackageStore } from "@/views/home/stores/index";
import { useAppStore } from "@/stores/index";
import { onMounted } from "vue";
import { ElMessage } from "element-plus";
import semverSatisfies from "semver/functions/satisfies";
import semverMinVersion from "semver/ranges/min-version";
import sermverMaxSatisfying from "semver/ranges/max-satisfying";
import sermverValidRange from "semver/ranges/valid";
import { UpdatePkg } from "@/ajax/type";

type DialogData = Partial<{
  semver: string;
}>;

type Update = UpdatePkg & { oldVersion: string; is_up: boolean };
interface Props {
  data: DialogData;
}
const appStore = useAppStore();
const packageStore = usePackageStore();

const { data } = defineProps<Props>();
const up_versions = ref<Update[]>([]);
const visible = defineModel<boolean>({ default: false });
const loading = ref<boolean>(false);

// 所有的依赖数据
const depData = computed(() =>
  Object.values(appStore.package.dependencies).concat(
    Object.values(appStore.package.dev_dependencies)
  )
);
onMounted(() => {
  // 计算当前可升级的依赖
  up_versions.value = [];
  collectUpVersions();
});

function collectUpVersions() {
  const up_data: Update[] = [];

  depData.value
    .filter((dep) => {
      return sermverValidRange(dep.version);
    })
    .forEach((dep) => {
      const { major, minor } = semverMinVersion(dep.version) || {};
      // 确定过滤的版本
      let range = `*.*.*`;
      switch (data.semver) {
        case "patch":
          range = `${major}.${minor}.*`;
          break;
        case "minor":
          range = `${major}.*.*`;
          break;
        default:
      }
      const versions = Object.keys(dep.versions).filter((v) =>
        semverSatisfies(v, range)
      );
      // 选择最新的版本
      const latest = sermverMaxSatisfying(versions, range)!;
      if (versions.length) {
        up_data.push({
          name: dep.name,
          version: latest,
          oldVersion: dep.version,
          is_dev: dep.is_dev,
          is_change: false,
          is_up: true,
        });
      }
    });
  up_versions.value = up_data;
}
const handleSubmit = () => {
  const params = up_versions.value.filter((item) => item.is_up);
  if (params.length < 1) {
    ElMessage.warning("没有可升级的依赖");
    return;
  }
  // 更新当前升级状态
  packageStore.batchUpdatePackage(params);

  ElNotification({
    message: "依赖升级中,依赖中可查看升级状态",
    type: "info",
  });
  handleClose();
};
const handleClose = () => {
  visible.value = false;
};
</script>
