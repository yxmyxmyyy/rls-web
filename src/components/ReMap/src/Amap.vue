<script setup lang="ts">
import { reactive, getCurrentInstance, onBeforeMount, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import car from "@/assets/car.png"; // 确保这个路径与你的项目结构相匹配

export interface MapConfigureInter {
  on: Fn;
  destroy?: Fn;
  clearEvents?: Fn;
  addControl?: Fn;
  setCenter?: Fn;
  setZoom?: Fn;
  plugin?: Fn;
  add?: (overlay: any) => void;
}

let MarkerCluster;
let map: MapConfigureInter;

const instance = getCurrentInstance();

const mapSet = reactive({
  loading: true
});

// 地图创建完成(动画关闭)
const complete = (): void => {
  if (map) {
    map.on("complete", () => {
      mapSet.loading = false;
    });
  }
};

onBeforeMount(() => {
  if (!instance) return;

  // 假设这里是你的地图配置
  const options = {
    zoom: 11,
    center: [116.397428, 39.90923] // 默认中心点坐标，可以根据需要调整
  };

  AMapLoader.load({
    key: "e6c8024a88ca88d97889a2f442dc5064", // 使用提供的key
    version: "2.0",
    plugins: ["AMap.MarkerCluster"]
  })
    .then(AMap => {
      map = new AMap.Map(instance.refs.mapview, options);

      map.plugin(["AMap.ToolBar", "AMap.MapType"], () => {
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.MapType());
      });

      // 这里直接使用静态数据代替原来的mapJson获取
      const points = [
        {
          lnglat: [33.397428, 39.90923], // 这里是车辆的位置
          driver: "司机名字",
          plateNumber: "车牌号",
          orientation: 60 // 方向，可以根据实际调整
        }
      ];

      // 创建一个标记点
      let marker = new AMap.Marker({
        position: points[0].lnglat,
        content: `<img style="transform: scale(1) rotate(${360 - Number(points[0].orientation)}deg);" src='${car}' />`,
        offset: new AMap.Pixel(-18, -10)
      });

      marker.setLabel({
        direction: "bottom",
        offset: new AMap.Pixel(-4, 0),
        content: `<div> ${points[0].plateNumber}(${points[0].driver})</div>`
      });

      // 将地图中心点设置为汽车的位置
      map.setCenter(points.map(item => item.lnglat));

      map.add(marker);

      complete();
    })
    .catch(() => {
      mapSet.loading = false;
      throw new Error("地图加载失败，请重新加载");
    });
});

onUnmounted(() => {
  if (map) {
    map.destroy();
    map.clearEvents();
  }
});
</script>

<template>
  <div id="mapview" ref="mapview" v-loading="mapSet.loading" />
</template>

<style lang="scss" scoped>
#mapview {
  height: calc(100vh - 86px);
}

:deep(.amap-marker-label) {
  border: none !important;
}
</style>
