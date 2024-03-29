<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import ReCol from "@/components/ReCol";

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
  }),
  productList: null
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const states = ref(props.productList);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });

//远程查询
interface ListItem {
  value: string;
  label: string;
  name: string;
}

const list1 = states.value.map((item): ListItem => {
  const displayText = `${item.productId} - ${item.productName}`;
  return { value: item.productId, label: displayText, name: item.productName };
});

const optionRefClass = ref();
function handleChangeClass() {
  list1.map(item => {
    if (item.value === newFormInline.value.productId) {
      newFormInline.value.productName = item.name;
    }
  });
}
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <re-col :value="12" :xs="24" :sm="24">
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="newFormInline.phone"
          clearable
          placeholder="请输入手机号"
        />
      </el-form-item>
    </re-col>
    <el-form-item label="产品:" prop="productId">
      <el-select-v2
        ref="optionRefClass"
        v-model="newFormInline.productId"
        style="width: 240px"
        filterable
        clearable
        :options="list1"
        @change="handleChangeClass"
      />
    </el-form-item>

    <el-form-item label="数量:" prop="stock">
      <el-input-number v-model="newFormInline.weight" :min="1" :max="9999" />
    </el-form-item>
  </el-form>
</template>
