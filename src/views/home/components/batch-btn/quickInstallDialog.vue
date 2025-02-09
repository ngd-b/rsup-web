<template>
  <RsDialog :visible="visible" title="一键安装依赖" @close="handleClose">
    <!-- <div class="flex flex-col gap-10px">
      <div class="">
        <span>选择工具</span>
      </div>
      <div class="flex gap-10px flex-wrap">
        <div
          class="flex cursor-pointer b-rd-6px flex-items-center gap-3px p-x-10px p-y-5px bg-gray-200"
          :class="[params.manager_name == item.name ? 'bg-primary' : '']"
          v-for="item in npmEnvData"
          :key="item.name"
        >
          <span>{{ item.name }}</span>
          <el-tag>{{ item.version }}</el-tag>
        </div>
      </div>
    </div> -->
    <template v-slot:default>
      <el-form ref="formRef" :rules="rules" label-position="top" :model="form">
        <el-form-item label="选择工具" prop="manager_name">
          <el-radio-group v-model="form.manager_name">
            <el-radio
              v-for="item in npmEnvData"
              :key="item.name"
              :value="item.name"
            >
              {{ item.name }}@{{ item.version }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设置依赖源" prop="is_registry">
          <div class="w-full flex gap-15px flex-items-center">
            <el-checkbox v-model="form.is_registry">自定义</el-checkbox>
            <!-- <el-input
              class="flex-basis-300px"
              v-if="form.is_registry"
              v-model="form.registry"
              placeholder="请输入依赖源"
            /> -->
            <RsSelect
              filterable
              allow-create
              default-first-option
              class="flex-basis-300px"
              code="RegistryType"
              v-if="form.is_registry"
              v-model="form.registry"
            />
          </div>
        </el-form-item>
        <!-- <template v-if="form.manager_name">
          <el-form-item label="设置参数" prop="is_registry"> </el-form-item>
        </template> -->
      </el-form>
    </template>
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
import { onMounted } from "vue";
import { ajax } from "@/ajax/index.js";
import { ElMessage } from "element-plus";

const packageStore = usePackageStore();
const form = ref({
  manager_name: "",
  is_registry: false,
  registry: "",
  params: [],
});
const rules = ref({
  manager_name: [
    {
      required: true,
      message: "请选择工具",
      trigger: "change",
    },
  ],
});
const formRef = ref(null);
const loading = ref(false);
const npmEnvData = computed(() =>
  Object.keys(packageStore.env)
    .filter((key) => key != "node")
    .map((key) => packageStore.env[key])
);

const visible = defineModel({ type: Boolean, default: false });

onMounted(() => {
  // ...
});

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;

    const res = await ajax.post("/api/pkg/quickInstall", form.value);
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
