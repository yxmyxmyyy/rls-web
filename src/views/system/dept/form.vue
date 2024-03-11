<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicHooks } from "../hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    higherDeptOptions: [],
    parentId: 0,
    name: "",
    principal: "",
    phone: "",
    sort: 0,
    status: 1,
    remark: "",
    type: 1
  })
});


const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

const parentId1 = ref(0);
// 定义处理Cascader变化的方法
function handleCascaderChange(selectedPath) {
  let type = 1;
  // 获取最后一个选中的项
  if (selectedPath != null) {
    const lastSelectedItem = selectedPath.length;
    if (lastSelectedItem == 1) {
      type = 2;
    } else if (lastSelectedItem == 2) {
      type = 3;
    } else if (lastSelectedItem == 3) {
      type = 4;
    }
  }
  newFormInline.value.type = type;
  newFormInline.value.parentId = selectedPath[selectedPath.length - 1];
}

const convertTypeToText = type => {
  switch (type) {
    case 1:
      return "县级";
    case 2:
      return "乡级";
    case 3:
      return "村级";
    default:
      return ""; // 默认情况下返回一个空字符串或者你可以指定一个默认值
  }
};

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="上级部门">
          <el-cascader
            v-model="parentId1"
            class="w-full"
            :options="newFormInline.higherDeptOptions"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: true,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级部门"
            @change="handleCascaderChange"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="类型" prop="type">
          <!-- 使用:value绑定转换后的文本 -->
          <el-input
            :value="convertTypeToText(newFormInline.type)"
            readonly
            placeholder="类型"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入部门名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门负责人">
          <el-input
            v-model="newFormInline.principal"
            clearable
            placeholder="请输入部门负责人"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="newFormInline.phone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="排序">
          <el-input-number
            v-model="newFormInline.sort"
            class="!w-full"
            :min="0"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门状态">
          <el-switch
            v-model="newFormInline.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="备注">
          <el-input
            v-model="newFormInline.remark"
            placeholder="请输入备注信息"
            type="textarea"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
