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
  <div class="welcome-container">
    <el-row type="flex" justify="center" class="header">
      <el-col :span="24">
        <h1>欢迎进入管理界面</h1>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center">
      <el-col :span="12" v-if="loading">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>{{ dept?.name }}</h3>
          </div>

          <el-descriptions bordered>
            <el-descriptions-item label="权限等级">{{ permissionLevel }}</el-descriptions-item>
            <el-descriptions-item label="部门ID">{{ dept?.id }}</el-descriptions-item>
            <el-descriptions-item label="负责人">{{ dept?.principal }}</el-descriptions-item>
            <el-descriptions-item label="联系方式">{{ dept?.phone }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.welcome-container {
  margin: 20px;
}

.header h1 {
  text-align: center;
  margin-bottom: 20px;
}

.box-card {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
