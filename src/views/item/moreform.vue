<script lang="ts" setup>
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import { FormProps } from "@/views/item/utils/types";

const formRef = ref();
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    productName: "",
    productId: "",
    itemId: "",
    lastUpdated: null,
    warehouseId: null,
    stock: null,
    weight: null
  }),
  productList: () => [],
  itemList: () => []
});
const items = ref(props.itemList);
const states = ref(props.productList);

function getRef() {
  return formRef.value;
}

interface DomainItem {
  key: number;
  productId: string;
  weight: number;
  productName: string;
}

const removeDomain = (item: DomainItem) => {
  const index = items.value.indexOf(item);
  if (index !== -1) {
    items.value.splice(index, 1);
  }
};

const addDomain = () => {
  items.value.push({
    key: Date.now(),
    productId: "",
    weight: 0,
    productName: ""
  });
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
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

const handleChangeClass = (productId: string, domainItem: DomainItem) => {
  const selectedItem = props.productList.find(
    item => item.productId === productId
  );
  if (selectedItem) {
    domainItem.productName = selectedItem.productName;
  }
};
</script>

<template>
  <el-form
    ref="formRef"
    :model="items"
    class="demo-dynamic"
    label-width="auto"
    style="max-width: 600px"
  >
    <el-form-item
      v-for="(domain, index) in items"
      :key="domain.key"
      :label="'Domain' + index"
      :prop="'domains.' + index + '.value'"
    >
      <el-form-item label="产品:" prop="productId">
        <el-select-v2
          ref="optionRefClass"
          v-model="domain.productId"
          style="width: 240px"
          filterable
          clearable
          :options="list1"
          @change="() => handleChangeClass(domain.productId, domain)"
        />
      </el-form-item>

      <el-form-item label="数量:" prop="weight">
        <el-input-number v-model="domain.weight" :min="1" :max="9999" />
      </el-form-item>
      <el-button class="mt-2" @click.prevent="removeDomain(domain)"
        >Delete
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
      <el-button @click="addDomain">New domain</el-button>
      <el-button @click="resetForm(formRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>
