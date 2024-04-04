<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { deviceDetection } from "@pureadmin/utils";
import {
  getCurrentInstance,
  onBeforeMount,
  onUnmounted,
  reactive,
  defineProps,
  watch,
  ref,
  toRaw
} from "vue";
import car from "@/assets/car.png";

defineOptions({
  name: "Amap"
});

const props = defineProps({
  location: Array,
  dataList: Array,
  destination: Object,
  origin: Object
});

let list = ref(props.dataList);
let map = null;
let polyline = null;
let arrowMarker = null;
let driving = null;
const startLngLat = props.origin.value._rawValue; //起始点坐标
const endLngLat = props.destination.value._rawValue; //终点坐标

const instance = getCurrentInstance();

const mapSet = reactive({
  loading: deviceDetection() ? false : true
});

// 地图创建完成(动画关闭)
const complete = (): void => {
  if (map) {
    map.on("complete", () => {
      mapSet.loading = false;
    });
  }
};

const createDrivingRoute = () => {
  if (map && props.origin && props.destination) {
    if (driving) {
      driving.clear();
    }
    driving = new AMap.Driving({
      map: map
    });
    // Search for a route from origin to destination
    driving.search(startLngLat, endLngLat, (status, result) => {
      if (status === "complete" && result.routes && result.routes.length) {
        console.log("Driving route created successfully");
      } else {
        console.error("Failed to create driving route");
      }
    });
  }
};

const updateMapLocation = newLocation => {
  // 确保地图和新位置都存在
  if (map && newLocation && newLocation.length >= 3) {
    // 确认包含温度信息
    const location = [newLocation[0], newLocation[1]]; // 提取经纬度
    const temperature = newLocation[2]; // 提取温度

    // 更新地图中心点到新位置
    map.setCenter(location);

    list.value.push(newLocation); // 现在保存包含温度的完整数据

    // 更新箭头标记位置和温度标签
    if (arrowMarker) {
      arrowMarker.setPosition(location);
      arrowMarker.setContent(
        `<div><img src='${car}'><div style="text-align: center">${temperature}°C</div></div>`
      ); // 更新内容包含温度
    } else {
      arrowMarker = new AMap.Marker({
        position: location,
        content: `<div><img src='${car}'><div style="text-align: center">${temperature}°C</div></div>`, // 初始化内容包含温度
        offset: new AMap.Pixel(-12, -12)
      });
      map.add(arrowMarker);
    }

    // 如果存在折线，则更新路径（只使用经纬度）
    if (polyline) {
      const path = list.value.map(item => [item[0], item[1]]); // 仅提取经纬度用于路径
      polyline.setPath(path);
    } else {
      const path = props.dataList.map(item => [item[0], item[1]]); // 初始化路径，仅提取经纬度
      polyline = new AMap.Polyline({
        path: path,
        strokeColor: "#3366FF",
        strokeOpacity: 1,
        strokeWeight: 5,
        strokeStyle: "solid",
        zIndex: 101
      });
      map.add(polyline);
    }
  }
};

onBeforeMount(() => {
  const options = {
    viewMode: "3D",
    zoom: 18,
    center: list.value[list.value.length - 1],
    resizeEnable: true
  };
  AMapLoader.load({
    key: "e6c8024a88ca88d97889a2f442dc5064",
    version: "2.0",
    plugins: ["Marker", "AMap.Driving"]
  })
    .then(AMap => {
      map = new AMap.Map(instance.refs.container, options);
      createDrivingRoute();

      updateMapLocation(list.value[list.value.length - 1]);

      complete();
    })
    .catch(error => {
      console.error("地图加载失败", error);
    });
});
onUnmounted(() => {
  if (map) {
    map.destroy() && map.clearEvents("click");
  }
});
watch(
  () => props.location,
  newLocation => {
    updateMapLocation(newLocation);
  },
  { deep: true }
);
</script>

<template>
  <div>
    <div id="container" ref="container" v-loading="mapSet.loading" />
  </div>
</template>

<style scoped lang="scss">
#container {
  width: 100%;
  height: 70vh;
}

#autocomplete-input {
  z-index: 299;
}
</style>
