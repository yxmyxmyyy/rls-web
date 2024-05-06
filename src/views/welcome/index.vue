<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { getDeptByToken } from "@/api/system";

defineOptions({
  name: "Welcome"
});

const dept = ref(null);
const loading = ref(false);

async function onSearch() {
  const { data } = await getDeptByToken();
  dept.value = data;
}
function start() {
  onSearch();
  loading.value = true;
}

const permissionLevel = computed(() => {
  const typeMap = {
    1: "县级",
    2: "乡级",
    3: "村级"
  };
  return typeMap[dept.value?.type] || "未知等级";
});

onBeforeMount(() => {
  start();
});
</script>

<template>
  <div>
    <h1>欢迎进入管理界面</h1>
    <div v-if="loading">
      <el-card>
        <p>当前权限等级 {{ permissionLevel }}</p>
        <h3>当前部门信息</h3>
        <p>部门id: {{ dept?.id }}</p>
        <p>部门名: {{ dept?.name }}</p>
        <p>负责人: {{ dept?.principal }}</p>
        <p>联系方式: {{ dept?.phone }}</p>
      </el-card>
    </div>
  </div>
</template>
