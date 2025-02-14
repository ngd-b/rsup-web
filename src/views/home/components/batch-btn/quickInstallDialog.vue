<template>
  <RsDialog :visible="visible" title="一键安装依赖" @close="handleClose">
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
<script setup lang="ts">
import { usePackageStore } from "@/views/home/stores/index";
import { onMounted } from "vue";
import { ajax } from "@/ajax/index";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { Env, EnvType } from "@/ajax/type";

interface FormProps {
  manager_name: string;
  is_registry: boolean;
  registry: string;
  params: string[];
}
const packageStore = usePackageStore();
const form = ref<FormProps>({
  manager_name: "",
  is_registry: false,
  registry: "",
  params: [],
});
const rules = ref<FormRules>({
  manager_name: [
    {
      required: true,
      message: "请选择工具",
      trigger: "change",
    },
  ],
});
const formRef = ref<FormInstance>();
const loading = ref<boolean>(false);
const npmEnvData = computed<Env[]>(() => {
  const npms = [EnvType.Npm, EnvType.Pnpm, EnvType.Yarn].filter(
    (key) => packageStore.env[key]
  );

  const data = npms.map((key) => packageStore.env[key]);
  return data as Env[];
});

const visible = defineModel({ type: Boolean, default: false });

onMounted(() => {
  // ...
});

const handleSubmit = async () => {
  try {
    await formRef.value!.validate();
    loading.value = true;

    const res = await ajax.post<null, FormProps>(
      "/api/pkg/quickInstall",
      form.value
    );
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
