<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import { FormProps } from "@/views/item/utils/types";

const formRef = ref();
// const dynamicValidateForm = reactive<{
//   domains: DomainItem[];
// }>({
//   domains: [
//     {
//       key: 1,
//       productId: "",
//       weight: 0
//     }
//   ]
// });

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    Item: []
  }),
  productList: null
});

// const dynamicValidateForm = reactive<{
//   domains: props.formInline.Item;
// }>({
//   domains: [
//     {
//       key: 1,
//       productId: "",
//       weight: 0
//     }
//   ]
// });

const dynamicValidateForm = reactive<{
  domains: props.formInline.Item;
}>({
  domains: [
    {
      key: 1,
      productId: "",
      weight: 0
    }
  ]
});

const states = ref(props.productList);

function getRef() {
  console.log(dynamicValidateForm.domains);
  console.log(props.formInline);
  return formRef.value;
}
interface DomainItem {
  key: number;
  productId: string;
  weight: number;
}

const removeDomain = (item: DomainItem) => {
  const index = dynamicValidateForm.domains.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.domains.splice(index, 1);
  }
};

const addDomain = () => {
  dynamicValidateForm.domains.push({
    key: Date.now(),
    productId: "",
    weight: 0
  });
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      getRef();
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
</script>

<template>
  <el-form
    ref="formRef"
    :model="dynamicValidateForm"
    class="demo-dynamic"
    label-width="auto"
    style="max-width: 600px"
  >
    <el-form-item
      v-for="(domain, index) in dynamicValidateForm.domains"
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
