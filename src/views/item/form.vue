<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

//TODO 表单信息
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    subjectNameId: null,
    subjectName: "",
    teacherId: null,
    teacherName: "",
    classId: null,
    className: ""
  }),
  classList: null,
  teacherList: null,
  subjectnameList: null
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const states1 = ref(props.subjectnameList);
const states2 = ref(props.teacherList);
const states3 = ref(props.classList);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });

//远程查询
interface ListItem {
  value: string;
  label: string;
}

const list1 = states1.value.map((item): ListItem => {
  return {
    value: item.id,
    label: item.label
  };
});

const list2 = states2.value.map((item): ListItem => {
  return {
    value: item.id,
    label: item.name
  };
});

const list3 = states3.value.map((item): ListItem => {
  return {
    value: item.id,
    label: item.name
  };
});

const optionRefSubject = ref();
const optionRefTeacher = ref();
const optionRefClass = ref();

function handleChangeSubject() {
  newFormInline.value.subjectName = optionRefSubject.value.currentPlaceholder;
}
function handleChangeTeacher() {
  newFormInline.value.teacherName = optionRefTeacher.value.currentPlaceholder;
}
function handleChangeClass() {
  newFormInline.value.className = optionRefClass.value.currentPlaceholder;
}
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="92px"
  >
    <el-form-item label="学科:" prop="subjectNameId">
      <el-select-v2
        v-model="newFormInline.subjectNameId"
        style="width: 240px"
        filterable
        clearable
        :options="list1"
        ref="optionRefSubject"
        @change="handleChangeSubject"
        placeholder="请输入学科"
      />
    </el-form-item>

    <el-form-item label="老师:" prop="teacherId">
      <el-select-v2
        v-model="newFormInline.teacherId"
        style="width: 240px"
        filterable
        clearable
        :options="list2"
        ref="optionRefTeacher"
        @change="handleChangeTeacher"
        placeholder="请输入老师"
      />
    </el-form-item>

    <el-form-item label="班级:" prop="classId">
      <el-select-v2
        v-model="newFormInline.classId"
        style="width: 240px"
        filterable
        clearable
        :options="list3"
        ref="optionRefClass"
        @change="handleChangeClass"
        placeholder="请输入班级"
      />
    </el-form-item>
  </el-form>
</template>

<style>
.el-form-item__label {
  font-weight: 700;
}
</style>
