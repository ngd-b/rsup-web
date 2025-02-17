<template>
  <div class="summary-relation box-border h-full w-full p-t-50px">
    <div class="flex flex-col">
      <div class="h-32px flex flex-items-center b-rd-5px bg-gray-100 p-l-15px">
        <span class="font-bold">Modules({{ total }})</span>
      </div>
      <div class="flex flex-1 flex-col gap-10px overflow-auto p-y-5px p-l-5px">
        <div
          class="realtion-item b-rd-5px bg-gray-100"
          v-for="item in summaryData"
          :key="item.name"
        >
          <div class="h-28px flex gap-5px flex-items-center p-x-10px">
            <span>{{ item.name }}</span>
            <template v-if="item.versions.length < 2">
              <el-tag type="primary">{{ item.version }}</el-tag>
            </template>
          </div>
          <template v-if="item.versions.length > 1">
            <div
              v-for="info in item.versions"
              :key="`${item.name}@${info.version}`"
              class="m-l-15px m-t-5px h-28px p-x-10px"
            >
              <span>{{ info.name }}@{{ info.version }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RelationPkgInfo } from "@/ajax/type";
import { useAppStore } from "@/stores/index";

// 统计数据对象不需要嵌套的关系
type SummaryRelation = Omit<RelationPkgInfo, "relations"> & {
  count: number;
  versions: SummaryRelation[];
  // 记录父级节点的path
  parent?: string;
};

const appStore = useAppStore();

const data = computed(() => appStore.relationPkg);
const summaryData = reactive<Record<string, SummaryRelation>>({});
const total = computed(() => {
  return Object.keys(summaryData).length;
});

onMounted(() => {});

watch(
  data,
  () => {
    // 格式统计模块
    summaryRelation(Object.values(data.value));
    //
    console.log(summaryData);
  },
  { immediate: true, deep: true }
);

/**
 * 统计依赖关系
 */
function summaryRelation(data: RelationPkgInfo[], parent?: string) {
  data.forEach((item) => {
    const summary = summaryData[item.name] || {
      ...item,
      count: 0,
      versions: [],
      parent,
    };

    // 总的使用量+1
    summary.count++;
    // 确定版本
    const index = summary.versions.findIndex(
      (info) => info.version == item.version
    );
    if (index > -1) {
      summary.versions[index].count++;
    } else {
      summary.versions.push({
        ...item,
        versions: [],
        count: 1,
        parent,
      });
    }
    // 递归自己关系
    if (item.relations && item.relations.length) {
      summaryRelation(item.relations, item.path);
    }
    // 赋值
    summaryData[item.name] = summary;
  });
}
</script>
<style lang="less" scoped>
.summary-relation {
  .realtion-item {
    &:nth-of-type(2n + 1) {
      // @apply bg-gray-200;
    }
  }
}
</style>
