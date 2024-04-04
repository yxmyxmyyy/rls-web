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
const { initToDetail, getParameter, onSearch, dataList, locationSearch, houseLocation, LoadSearch, loadList } = useDetail();
initToDetail("query");

let origin = [];
let destination = [];
let loading = ref(false);

async function start() {
  createConnection();
  doSubscribe(getParameter.id);
  await onSearch(<string>getParameter.id);
  await LoadSearch(<string>getParameter.id);
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
    <div v-if="loadList && loadList.length > 0">
      <el-table
        :data="loadList"
        style="width: 100%"
        row-key="vehicleId"
      >
        <el-table-column
          prop="vehicleId"
          label="车辆id"
          >
        </el-table-column>
        <el-table-column
          prop="licensePlate"
          label="车牌号"
          >
        </el-table-column>
        <el-table-column
          prop="type"
          label="车辆类型"
          >
        </el-table-column>
        <el-table-column
          prop="capacity"
          label="容量"
          >
        </el-table-column>

        <!-- 展开行功能 -->
        <el-table-column
          type="expand"
        >
          <template #default="props">
            <el-table
              :data="props.row.products"
              style="width: 100%"
            >
              <el-table-column
                prop="productName"
                label="产品名称"
                >
              </el-table-column>
              <el-table-column
                prop="weight"
                label="重量"
                >
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>
