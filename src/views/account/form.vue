<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

//TODO 表单信息
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    username: "",
    role: 2,
    isActive: 1
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
    <el-form-item label="账号：" prop="username">
      <el-input
        v-model="newFormInline.username"
        clearable
        placeholder="请输入账号"
      />
    </el-form-item>

    <el-form-item label="权限：" prop="role">
      <el-select
        v-model="newFormInline.role"
        placeholder="请选择权限"
        clearable
      >
        <el-option label="管理员" :value="0" />
        <el-option label="教师" :value="1" />
        <el-option label="学生" :value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态：" prop="isActive">
      <el-select
        v-model="newFormInline.isActive"
        placeholder="请选择状态"
        clearable
      >
        <el-option label="启用" :value="1" />
        <el-option label="停用" :value="0" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
