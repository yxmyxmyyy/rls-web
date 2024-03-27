<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

//TODO 表单信息
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    itemId: "",
    productId: "",
    productName: "",
    warehouseId: null,
    stock: null,
    lastUpdated: null,
    weight: null
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
    <el-form-item label="数量:" prop="stock">
      <el-input-number v-model="newFormInline.weight" :min="1" :max="9999" />
    </el-form-item>
  </el-form>
</template>
