<template>
  <div class="relative h-full w-full">
    <VueFlow :nodes="nodes" :edges="edges" :connection-mode="ConnectionMode.Strict">
      <Background />
      <!-- 自定义节点 -->
      <template #node-relation="props">
        <Node v-bind="props" />
      </template>
    </VueFlow>
    <div class="absolute left-20px top-20px">
      <el-button type="primary" @click="handleBack">
        <i class="i-material-symbols:chevron-left h-20px w-20px"></i>
        返回
      </el-button>
    </div>
  </div>
</template>
<script setup lang="js">
import {
  VueFlow,
  useVueFlow,
  useNodesInitialized,
  Position,
  ConnectionMode,
} from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { ajax } from "@/ajax/index.js";
import { onMounted, reactive, watch } from "vue";
import dagre from "@dagrejs/dagre";
import { useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";
// 自定义
import Node from "./components/node.vue";

const router = useRouter();
const props = defineProps({
  name: String,
});
let relationData = reactive({});
const loading = ref(false);
// 节点、线
const nodes = reactive([]);
const edges = reactive([]);
const { findNode, updateNode } = useVueFlow();

onMounted(() => {
  getRelationData();
});

const rendered = useNodesInitialized();

watch(rendered, (val) => {
  if (val) {
    optimizeLayout();
  }
});
/**
 * 格式化流程节点、线数据
 *
 */
const formatFlowData = (data) => {
  const { id, name, relations, is_peer, version, is_loop } = data;

  // 使用name+version 作为唯一标识
  // let id = `${name}_v${version}`;
  nodes.push({
    id,
    type: "relation",
    data: {
      label: name,
      is_peer,
      is_loop,
      is_parent: `${name}@${version}` == `${relationData.name}@${relationData.version}` && !is_loop,
      is_leaf: relations.length < 1,
      version,
    },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    position: { x: Math.random() * 100, y: Math.random() * 100 },
  });
  relations.forEach((item) => {
    item.id = uuidv4();
    edges.push({
      source: id,
      target: item.id,
      style: {
        stroke: item.is_loop ? "#f56c6c" : "#409eff",
      },
    });
    // 递归
    formatFlowData(item);
  });
};
/**
 * 优化布局
 */
const optimizeLayout = () => {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: "LR",
    align: "UL",
    nodesep: 40,
    ranksep: 60,
    ranker: "tight-tree",
    marginx: 30,
    marginy: 200,
  });

  nodes.forEach((node) => {
    const { width, height } = findNode(node.id).dimensions;
    graph.setNode(node.id, { width, height });
  });
  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);
  // 根据层级设置位置
  const rankMap = {};
  for (const node of nodes) {
    const { rank, width, height } = graph.node(node.id);

    if (!rankMap[rank]) {
      rankMap[rank] = {
        ...node,
        width,
        height,
      };
    } else {
      if (rankMap[rank].position.y > node.position.y)
        rankMap[rank] = {
          ...node,
          width,
          height,
        };
    }
  }

  // 更新位置
  for (const node of nodes) {
    const newNode = graph.node(node.id);

    // 同位置需要计算层级关系
    // node.position = {
    //   x: newNode.x - newNode.width / 2,
    //   y: newNode.y - newNode.height / 2 + rankMap[newNode.rank].height / 2,
    // };
    updateNode(node.id, {
      position: {
        x: newNode.x - newNode.width / 2,
        y: newNode.y - newNode.height / 2 + rankMap[newNode.rank].height / 2,
      },
    });
  }
};
/**
 * 请求获取依赖关系数据
 */
async function getRelationData() {
  loading.value = true;
  try {
    let params = {
      name: props.name,
    };
    let res = await ajax.get("/api/pkg/graph", { params });
    if (res.success) {
      ElMessage.success("获取成功!");
      // 存储当前节点数据
      relationData = { ...res.data };
      // 格式化节点、线
      formatFlowData({ ...res.data, id: uuidv4() });
      // 优化布局
      // optimizeLayout();
    } else {
      ElMessage.error("获取依赖关系图失败，请检查日志!");
    }
  } catch (e) {
    //
    ElMessage.error("接口调用失败!");
    console.error(e);
  } finally {
    loading.value = false;
  }
}
const handleBack = () => {
  router.back();
};
</script>
