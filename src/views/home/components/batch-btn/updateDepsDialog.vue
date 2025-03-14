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
      <br />
      <el-alert
        type="info"
        :closable="false"
        description="通常来说维护的依赖之间不会出现依赖冲突的问题，保持项目中依赖的及时更新，可以减少潜在问题，提升开发效率✍"
      />
      <el-empty
        v-if="up_versions.length < 1"
        description="当前没有可升级的依赖!"
      />
      <div class="flex flex-col gap-10px p-5px" v-else>
        <div class="flex items-center gap-5px">
          <el-checkbox v-model="form.reinstall">重新安装</el-checkbox>
          <el-tooltip
            content="升级时移除`package-lock.json`和`node_modules`文件后指定最新版本再安装"
          >
            <el-Icon-InfoFilled class="h-14px w-14px" />
          </el-tooltip>
        </div>
        <div class="flex flex-col gap-5px" v-if="form.reinstall">
          <span class="">选择包管理器</span>
          <RsRadio v-model="form.manager_name" :options="managerData">
          </RsRadio>
        </div>
        <el-divider class="important-m-y-10px" />
        <div
          class="flex justify-between flex-items-center"
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
import { BatchUpdate, UpdatePkg } from "@/ajax/type";
import { SelectItem } from "@/components/enum";

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
// 升级选择项
const form = reactive<Pick<BatchUpdate, "reinstall" | "manager_name">>({
  reinstall: false,
  manager_name: appStore.package.manager_name,
});

// 所有的依赖数据
const depData = computed(() =>
  Object.values(appStore.package.dependencies).concat(
    Object.values(appStore.package.dev_dependencies)
  )
);
// 包管理器列表
const managerData = computed<SelectItem[]>(() =>
  packageStore.managerData.map((item) => ({
    ...item,
    label: `${item.name}@${item.version}`,
    value: item.name,
  }))
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
  packageStore.batchUpdatePackage({ data: params, ...form });

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
