<template>
  <div class="h-full w-full">
    <div :key="index" v-for="(dep, index) in [dependencies, devDependencies]">
      <h3>
        {{ index ? "devDependencies" : "dependencies" }} ({{
          formatValues(dep, false).length
        }})
      </h3>
      <div
        class="version-item mb-10"
        v-for="info in formatValues<PkgInfo>(dep, false)"
        :key="info.name"
      >
        <div class="flex flex-col">
          <div class="flex gap-10 flex-items-center">
            <i
              v-if="!info.is_finish"
              class="flex-inline animate-duration-1s animate-ease-linear animate-count-infinite flex-justify-center animate-rotate-360"
            >
              <i-ep-loading />
            </i>
            <i
              v-else
              class="flex-inline flex-justify-center flex-items-center color-blue"
            >
              <i-ep-check />
            </i>

            <el-tooltip content="点击查看依赖 README.md" :show-after="300">
              <el-link @click="handleViewReadme(info, index)">
                {{ info.name }}
              </el-link>
            </el-tooltip>
            <template v-if="info.is_del">
              <el-tooltip content="当前依赖已删除">
                <el-tag type="danger">deleted</el-tag>
              </el-tooltip>
            </template>

            <el-tag type="primary">{{ info.version }}</el-tag>
            <el-tag type="success">
              latest：{{ info["dist-tags"].latest }}
            </el-tag>
            <div
              class="flex flex-items-center overflow-hidden"
              v-if="updating[info.name]"
            >
              <i
                class="animate-slide-in-up animate-duration-1s animate-count-infinite color-yellow-500"
              >
                <i-ep-top />
              </i>

              <el-tag type="primary">{{ updating[info.name]?.version }}</el-tag>
            </div>
          </div>
          <!-- 操作 -->
          <Tools class="m-l-30px m-t-10px" :data="info" />
        </div>

        <div class="p-l-30" v-if="info.is_finish">
          <div class="b-rd-5px bg-current color-gray-100">
            <p class="p-10 font-size-14 color-gray-500">
              {{ info.description }}
            </p>
          </div>

          <div class="mt-10 flex flex-wrap gap-10">
            <div
              v-for="v in formatValues<VersionInfo>(info.versions, true)"
              :key="v.version"
            >
              <el-tooltip content="点击复制版本号" :show-after="300">
                <RsCopy
                  class="inline-block"
                  :text="`${info.name}@${v.version}`"
                >
                  <span
                    class="cursor-pointer border border-rd-3 border-solid border-r-none p-l-5 p-r-5 font-size-12 color-blue-500"
                    >{{ v.version }}</span
                  >
                </RsCopy>
              </el-tooltip>

              <el-popconfirm
                title="确认升级为该版本？"
                width="200px"
                @confirm="() => handleUpdate(info, v)"
              >
                <template #reference>
                  <span
                    class="cursor-pointer border border-rd-3 border-solid p-l-5 p-r-5 font-size-12 color-yellow-500"
                    >up</span
                  >
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from "@/stores/index";
import { usePackageStore } from "@/views/home/stores/index";

import semverCompare from "semver/functions/compare";
import { useRouter } from "vue-router";
//
import Tools from "./tools.vue";
import { PkgInfo, VersionInfo } from "@/ajax/type";

const router = useRouter();
const packageStore = usePackageStore();
const appStore = useAppStore();
// 正在升级的依赖
// const updating = ref({});
const updating = computed(() => packageStore.updating);

const data = computed(() => appStore.package);

// 开发依赖
const dependencies = computed(() => data.value.dependencies);
// 生产依赖
const devDependencies = computed(() => data.value.dev_dependencies);

// 查看依赖包的readme
function handleViewReadme(info: PkgInfo, is_dev: number) {
  const name = encodeURIComponent(info.name);
  router.push({ path: `/${is_dev ? 1 : 0}/${name}/readme` });
}

// 对象转数组遍历
// is_compare： 单个依赖的版本信息格式
function formatValues<T extends PkgInfo | VersionInfo>(
  obj: Record<string, T>,
  is_compare: boolean
): T[] {
  const res = Object.values(obj);

  if (is_compare) {
    res.sort((a, b) => semverCompare(a.version, b.version));
  }

  return res;
}
// 复制当前版本
// function handleCopy(info, v) {
//   let name = info.name + "@" + v.version;
//   navigator.clipboard.writeText(name).then(() => {
//     ElMessage.success("复制成功!");
//   });
// }

/**
 * 指定更新到某个版本
 */
function handleUpdate(info: PkgInfo, version: VersionInfo) {
  if (updating.value[info.name]) {
    ElMessage.warning("正在更新，请稍后!");
    return;
  }

  packageStore.updateUpdating(info.name, {
    version: version.version,
  });
  packageStore.installPackage({ ...info, version: version.version }).then(
    () => {
      // 删除成功
      packageStore.updateUpdating(info.name, null);
      // 更新成功后，之前查询的依赖关系图
      appStore.updateRelationPkg({ name: info.name, relation: null });
    },
    () => {
      packageStore.updateUpdating(info.name, null);
    }
  );
}
</script>
