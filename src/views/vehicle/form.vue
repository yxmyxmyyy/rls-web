<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

//TODO 表单信息
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    licensePlate: "",
    type: "",
    capacity: "",
    status: 1
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="车牌号：" prop="licensePlate">
      <el-input
        v-model="newFormInline.licensePlate"
        clearable
        placeholder="请输入账号"
      />
    </el-form-item>
    <el-form-item label="载货量：" prop="capacity">
      <el-input
        v-model="newFormInline.capacity"
        clearable
        placeholder="请输入载货量"
      />
    </el-form-item>
  </el-form>
</template>
