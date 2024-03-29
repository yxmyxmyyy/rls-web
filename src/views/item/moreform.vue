<script lang="ts" setup>
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import { FormProps } from "@/views/item/utils/types";
import ReCol from "@/components/ReCol";

const formRef = ref();
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "出库",
    higherDeptOptions: [],
    productName: "",
    productId: "",
    itemId: "",
    destinationWarehouseId: "",
    lastUpdated: null,
    warehouseId: null,
    stock: null,
    weight: null
  }),
  productList: () => [],
  itemList: () => []
});
const newFormInline = ref(props.formInline);
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
  return {
    value: item.productId,
    label: item.productName,
    name: item.productName
  };
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
    <el-row :gutter="30">
      <re-col
        v-if="newFormInline.title === '出库'"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="目的地">
          <el-cascader
            v-model="newFormInline.destinationWarehouseId"
            class="w-full"
            :options="newFormInline.higherDeptOptions"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="目标仓库"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <el-form-item
        v-for="(domain, index) in items"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
      >
        <re-col :sm="24" :value="12" :xs="24">
          <el-form-item label="产品:" prop="productId">
            <el-select-v2
              ref="optionRefClass"
              v-model="domain.productId"
              :options="list1"
              clearable
              filterable
              style="width: 240px"
              @change="() => handleChangeClass(domain.productId, domain)"
            />
          </el-form-item>
        </re-col>

        <re-col :sm="24" :value="12" :xs="24">
          <el-form-item label="数量:" prop="weight">
            <el-input-number v-model="domain.weight" :max="9999" :min="1" />
          </el-form-item>
        </re-col>
        <re-col :sm="24" :value="12" :xs="24">
          <el-button type="warning" @click.prevent="removeDomain(domain)"
            >删除</el-button
          >
        </re-col>
      </el-form-item>
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item>
          <el-button type="info" @click="addDomain">新增</el-button>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
