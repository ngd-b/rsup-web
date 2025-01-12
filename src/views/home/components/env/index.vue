<template>
    <div class="home-env p-x-20px p-t-50px">
        <div class="env-item">
            <div class="env-item-title flex gap-5px flex-items-center b-rd-5px bg-gray-200 p-x-15px p-y-5px">
                <span>Node</span>
                <el-tooltip content="当前系统Node版本">
                    <i-ep-question-filled class="h-14px w-14px op-80" />
                </el-tooltip>
            </div>
            <div class="env-item-content p-15px op-70">
                <span>{{ envData.node?.version }}</span>
            </div>
        </div>
        <div class="env-item">
            <div class="env-item-title b-rd-5px bg-gray-200 p-x-15px p-y-5px">
                <span>依赖管理工具</span>
            </div>
            <div class="env-item-content flex flex-col gap-10px p-15px op-70">
                <div class="env-item flex justify-between b-rd-5px p-x-5px p-y-5px"
                    :class="data.manager_name == item.name ? 'bg-gray-100' : ''" v-for="item in npmEnvData"
                    :key="item.name">
                    <span>{{ item.name }}@{{ item.version }}</span>

                    <el-tag v-if="data.manager_name == item.name">当前项目</el-tag>
                </div>
            </div>
        </div>

    </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { ajax } from "@/ajax/index.js";
import { useAppStore } from "@/stores/index.js";

const appStore = useAppStore();
const loading = ref(false);
const envData = ref({})

const data = computed(() => appStore.package);

const npmEnvData = computed(() => Object.keys(envData.value).filter(key => key != 'node').map(key => envData.value[key]))

onMounted(() => {
    getEnvData();
})

async function getEnvData() {
    loading.value = true;
    try {
        let res = await ajax.get("/api/env/get");
        if (res.success) {
            envData.value = { ...res.data }
        } else {
            ElMessage.error("获取系统环境数据失败，请查看日志!");
        }
    } catch (e) {
        //
        ElMessage.error("接口调用失败!");
        console.error(e);
    } finally {
        loading.value = false;
    }
}
</script>