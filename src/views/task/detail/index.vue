<script setup lang="ts">
import { useDetail } from "./hooks";
import { onBeforeMount, onMounted, onUnmounted, reactive, ref } from "vue";
import Amap from "@/views/task/detail/map";
import { useMqtt } from "@/views/task/detail/mqtt";
import { deviceDetection } from "@pureadmin/utils";

defineOptions({
  name: "taskDetail"
});
const { client, location, createConnection, doSubscribe } = useMqtt();
const { initToDetail, getParameter, onSearch, dataList, locationSearch, houseLocation } = useDetail();
initToDetail("query");

let origin = [];
let destination = [];
let loading = ref(false);

async function start() {
  createConnection();
  doSubscribe(getParameter.id);
  await onSearch(<string>getParameter.id);
  await change(getParameter.o,origin);
  await change(getParameter.d,destination);
  loading.value = true;
}

async function change(id,object) {
  await locationSearch(id);
  object.value = { ...houseLocation };
}

onUnmounted(() => {
  try {
    if (client.value.end) {
      client.value.end();
      console.log("disconnected successfully");
    }
  } catch (error) {
    console.log(error);
  }
});
onBeforeMount(() => {
  try {
    start();
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <el-card>
    <div v-if="loading">
      <Amap :location="location" :dataList="dataList" :origin="origin" :destination="destination" />
    </div>
  </el-card>
</template>
