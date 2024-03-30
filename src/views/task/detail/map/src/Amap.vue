<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { deviceDetection } from "@pureadmin/utils";
import { getCurrentInstance, onBeforeMount, onUnmounted, reactive } from "vue";

defineOptions({
  name: "Amap"
});

let map = null;

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

onBeforeMount(() => {
  const options = {
    viewMode: "3D",
    zoom: 18,
    center: [116.368904, 39.913423],
    resizeEnable: true
  };
  AMapLoader.load({
    key: "e6c8024a88ca88d97889a2f442dc5064", // 使用您的API Key
    version: "2.0",
    plugins: ["Marker"]
  })
    .then(AMap => {
      map = new AMap.Map(instance.refs.container, options);

      // 绘制行程路径
      var path = [
        [116.368904, 39.913423],
        [116.382122, 39.901176],
        [116.387271, 39.912501],
        [116.398258, 39.904600]
      ];
      var polyline = new AMap.Polyline({
        path: path,
        borderWeight: 2, // 线条宽度，默认为 1
        strokeColor: 'blue', // 线条颜色
        lineJoin: 'round' // 折线拐点连接处样式
      });
      map.add(polyline);

      // 更新当前位置
      var marker = new AMap.Marker({
        position: path[0], // 初始位置
        map: map
      });

      // 假设这是从MQTT获得的实时位置数据
      var newPosition = [117.397428, 39.90923];
      path.push(newPosition); // 更新路径
      marker.setPosition(newPosition); // 更新位置

      complete();
    })
    .catch(error => {
      console.error("地图加载失败", error);
    });
});
onUnmounted(() => {
  if (map) {
    // 销毁地图实例
    map.destroy() && map.clearEvents("click");
  }
});
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
