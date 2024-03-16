<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { FormProps } from "@/views/system/dept/utils/types";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import house from "@/assets/house.png";
import { usePublicHooks } from "@/views/system/hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    higherDeptOptions: [],
    id: 0,
    parentId: 0,
    name: "",
    principal: "",
    phone: "",
    sort: 0,
    status: 1,
    remark: "",
    type: 1,
    lat: 0,
    lng: 0
  })
});
const newFormInline = ref(props.formInline);

function getRef() {
  return selectedPosition.value;
}

let map = null;
let marker = null; // 定义marker变量
let selectedPosition = ref({
  lng: newFormInline.value.lng,
  lat: newFormInline.value.lat
}); // 用于保存选中的位置

defineExpose({ getRef });

onMounted(() => {
  AMapLoader.load({
    key: "e6c8024a88ca88d97889a2f442dc5064", // 使用您的API Key
    version: "2.0",
    plugins: ["Marker", "AMap.PlaceSearch", "AMap.AutoComplete"] // 加载Marker、Autocomplete和PlaceSearch插件
  })
    .then(AMap => {
      map = new AMap.Map("container", {
        viewMode: "3D",
        zoom: 18,
        center: [newFormInline.value.lng || 114, newFormInline.value.lat || 30],
        resizeEnable: true
      });

      // 如果一开始就有数据，则创建标记
      if (newFormInline.value.lng && newFormInline.value.lat) {
        marker = createMarker(newFormInline.value.lng, newFormInline.value.lat);
      }

      // 监听地图的点击事件
      map.on("click", function (e) {
        selectedPosition.value = {
          lng: e.lnglat.lng,
          lat: e.lnglat.lat
        };

        // 如果标记不存在，创建标记；否则，移动现有标记到新位置
        if (!marker) {
          marker = createMarker(e.lnglat.lng, e.lnglat.lat);
        } else {
          marker.setPosition(new AMap.LngLat(e.lnglat.lng, e.lnglat.lat));
        }
      });

      // 创建标记的函数
      function createMarker(lng, lat) {
        const newMarker = new AMap.Marker({
          position: new AMap.LngLat(lng, lat),
          content: `<img src='${house}' style="width: 48px; height: 48px;">`, // 替换为你的房子图标URL
          offset: new AMap.Pixel(-24, -24)
        });

        newMarker.setLabel({
          direction: "bottom",
          offset: new AMap.Pixel(0, 0),
          content: `<div> ${newFormInline.value.name || "Selected Location"}</div>` // 如果没有名称，则显示默认文本
        });

        newMarker.setMap(map);
        return newMarker;
      }

      // 实例化自动完成插件
      let autoOptions = {
        input: "autocomplete-input" // 绑定到自动完成输入框的ID
      };

      let autocomplete = new AMap.AutoComplete(autoOptions);
      let placeSearch = new AMap.PlaceSearch({
        map: map
      });
      autocomplete.on("select", select); //注册监听，当选中某条记录时会触发
      function select(e) {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name); //关键字查询查询
      }
    })
    .catch(error => {
      console.error("地图加载失败", error);
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
  <div>
    <input id="autocomplete-input" type="text" placeholder="搜索位置..." />
    <div id="container" />
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
