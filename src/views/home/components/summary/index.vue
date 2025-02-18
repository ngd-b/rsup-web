<template>
  <div class="summary-relation box-border h-full w-full">
    <ModuleTree />
  </div>
</template>
<script setup lang="ts">
import { RelationPkgInfo } from "@/ajax/type";
import { useAppStore } from "@/stores/index";
//
import ModuleTree from "./moduleTree.vue";

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
