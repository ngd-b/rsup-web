<template>
  <div class="home m-auto max-w-800">
    <div class="header">
      <h2>
        <el-link>{{ data.name }}</el-link>
        <el-tag type="primary">{{ data.version }}</el-tag>
      </h2>

      <p>{{ data.description }}</p>
    </div>
    <!-- <div class="mt-15 mb-15 flex gap-10">
      <el-button type="primary">主版本更新</el-button>
      <el-button type="primary">次版本更新</el-button>
      <el-button type="primary">修订版本更新</el-button>
    </div> -->
    <div class="version-list">
      <template
        :key="index"
        v-for="(dep, index) in [dependencies, devDependencies]"
      >
        <h3>
          {{ index ? "devDependencies" : "dependencies" }}
        </h3>
        <div
          class="version-item mb-10"
          v-for="info in formatValues(dep, false)"
          :key="info.name"
        >
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

            <el-link @click="handleViewReadme(info, index)">
              {{ info.name }}
            </el-link>

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

              <el-tag type="primary">{{ updating[info.name].version }}</el-tag>
            </div>
          </div>
          <div class="p-l-30" v-if="info.is_finish">
            <div class="bg-current color-gray-100">
              <p class="p-10 font-size-14 color-gray-500">
                {{ info.description }}
              </p>
            </div>

            <div class="mt-10 flex flex-wrap gap-10">
              <div
                v-for="v in formatValues(info.versions, true)"
                :key="v.version"
              >
                <span
                  @click="handleCopy(info, v)"
                  class="cursor-pointer border border-rd-3 border-solid border-r-none p-l-5 p-r-5 font-size-12 color-blue-500"
                  >{{ v.version }}</span
                >
                <el-popconfirm
                  title="确认升级为该版本？"
                  width="200px"
                  @confirm="() => handleUpdate(info, v, index == 1)"
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
      </template>
    </div>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/index.js";

// import useAjax from "@/ajax/useAjax.js";
import { ajax } from "@/ajax/index.js";
import semverCompare from "semver/functions/compare.js";
import { useRouter } from "vue-router";

const router = useRouter();
const appStore = useAppStore();
// 正在升级的依赖
const updating = ref({});

const data = computed(() => appStore.package);

// 开发依赖
const dependencies = computed(() => data.value.dependencies || {});
// 生产依赖
const devDependencies = computed(() => data.value.dev_dependencies || {});

// 查看依赖包的readme
function handleViewReadme(info, is_dev) {
  let name = encodeURIComponent(info.name);
  router.push({ path: `/${is_dev ? 1 : 0}/${name}/readme` });
}

function formatValues(obj, is_compare) {
  let res = Object.values(obj);

  if (is_compare) {
    res.sort((a, b) => semverCompare(a.version, b.version));
  }

  return res;
}
// 复制当前版本
function handleCopy(info, v) {
  let name = info.name + "@" + v.version;
  navigator.clipboard.writeText(name).then(() => {
    ElMessage.success("复制成功!");
  });
}

/**
 * 指定更新到某个版本
 */
async function handleUpdate(info, version, is_dev) {
  if (updating.value[info.name]) {
    ElMessage.warning("正在更新，请稍后!");
    return;
  }
  try {
    let params = {
      name: info.name,
      version: version.version,
      is_dev,
    };
    updating.value[info.name] = {
      version: version.version,
    };
    let res = await ajax.post("/api/updatePkg", params);
    if (res.success) {
      ElMessage.success("更新成功!");
    } else {
      ElMessage.error("更新失败，可点击查看更新日志!");
    }
  } catch (e) {
    //
    ElMessage.error("接口调用失败!");
    console.error(e);
  } finally {
    updating.value[info.name] = null;
  }
}
</script>
