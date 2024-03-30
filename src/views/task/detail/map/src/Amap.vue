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
    center: [114, 30],
    resizeEnable: true
  };
  AMapLoader.load({
    key: "e6c8024a88ca88d97889a2f442dc5064", // 使用您的API Key
    version: "2.0",
    plugins: ["Marker", "AMap.PlaceSearch", "AMap.AutoComplete"] // 加载Marker、Autocomplete和PlaceSearch插件
  })
    .then(AMap => {
      map = new AMap.Map(instance.refs.container, options);

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
    <input id="autocomplete-input" type="text" placeholder="搜索位置..." />
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
