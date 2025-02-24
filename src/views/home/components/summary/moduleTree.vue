<template>
  <div class="flex flex-col gap-5px">
    <div
      class="h-32px flex gap-20px flex-items-center b-rd-5px bg-gray-100 p-l-15px"
    >
      <div class="flex flex-basis-200px gap-5px flex-items-center">
        <span class="font-bold">Modules({{ data.length }})</span>
        <el-tooltip content="深层次依赖，根据路径可以看到是被谁依赖">
          <i-ep-QuestionFilled />
        </el-tooltip>
      </div>

      <el-input
        class="flex-1 overflow-hidden"
        v-model="searchForm.name"
        :suffix-icon="Search"
        placeholder="搜索依赖"
      />
    </div>
    <div
      v-for="pkgs in data"
      :key="pkgs[0].name"
      class="relative flex flex-col cursor-pointer p-l-15px"
    >
      <div
        v-if="pkgs.length > 1"
        class="absolute left--5px top-3px"
        @click="handleCollapsedChange(pkgs[0])"
      >
        <i-ep-ArrowDown
          class="transition-duration-100"
          :class="{ 'rotate--90 ': collapsed[pkgs[0].name] }"
        />
      </div>
      <div
        @click="handleCollapsedChange(pkgs[0])"
        class="h-28px flex gap-10px flex-items-center b-rd-5px bg-gray-100 p-x-10px"
      >
        <span class="text-ellipsis">{{ pkgs[0].name }}</span>
        <template v-if="pkgs.length < 2">
          <el-tag type="primary">{{ pkgs[0].version }}</el-tag>
        </template>
        <template v-else>
          <span class="color-red-400 font-bold">v+{{ pkgs.length }}</span>
        </template>
      </div>
      <template v-if="pkgs.length > 1 && !collapsed[pkgs[0].name]">
        <div
          v-for="pkg in pkgs"
          :key="`${pkg.name}@${pkg.version}`"
          class="m-l-15px m-t-5px h-28px flex gap-10px flex-items-center b-rd-5px bg-gray-100 p-x-10px"
        >
          <el-tooltip :show-after="300" :content="pkg.path">
            <span class="text-ellipsis">{{ pkg.name }}</span>
          </el-tooltip>

          <el-tag type="primary">{{ pkg.version }}</el-tag>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RelationPkgInfo } from "@/ajax/type";
import { useAppStore } from "@/stores/index";
import { Search } from "@element-plus/icons-vue";

const appStore = useAppStore();
// 记录映射所有资源/区分版本
const pkgMap = reactive<Record<string, RelationPkgInfo[]>>({});
const data = computed(() => {
  const data = Object.values(pkgMap);
  // 过滤
  const { name } = searchForm.value;
  if (!name) {
    return data;
  }
  return data.filter((item) => item[0].name.includes(name));
});
const collapsed = reactive<Record<string, boolean>>({});
// 搜索
const searchForm = ref({
  name: "",
});
// 项目依赖
const depsMap = computed(() => {
  const { dependencies, dev_dependencies } = appStore.package;

  return Object.values(dependencies)
    .concat(Object.values(dev_dependencies))
    .map((item) => `${item.name}@${item.version}`);
});

watch(
  () => appStore.lockPackage,
  () => {
    formatLockPkgData();
  },
  { immediate: true, deep: true }
);
onMounted(() => {
  // formatLockPkgData();
});
function formatLockPkgData() {
  const data = appStore.lockPackage.packages;

  for (const key in data) {
    if (!key) {
      continue;
    }
    const names = key.split(/\/{0,1}node_modules\//);
    const pkg = data[key];
    pkg.name = names[names.length - 1];
    pkg.path = key;
    // 过滤项目直接依赖
    if (depsMap.value.includes(`${pkg.name}@${pkg.version}`)) {
      continue;
    }

    const pkgs = pkgMap[pkg.name] || [];
    // 是否已经存在
    const index = pkgs.findIndex((item) => item.path == key);
    if (index < 0) {
      pkgs.push(pkg);
      pkgMap[pkg.name] = pkgs;
    }
  }
}
/**
 * 切换折叠
 */
const handleCollapsedChange = (pkg: RelationPkgInfo) => {
  collapsed[pkg.name] = !collapsed[pkg.name];
};
</script>
