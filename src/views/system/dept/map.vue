<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import {FormProps} from "@/views/system/dept/utils/types";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import house from "@/assets/house.png";

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
const data = reactive({map: null, marker: null, auto: null});
let map;

onMounted(() => {
  AMapLoader.load({
    key: "e6c8024a88ca88d97889a2f442dc5064", // 使用您的API Key
    version: "2.0",
    plugins: ["Marker", "AMap.PlaceSearch", "AMap.AutoComplete"] // 加载Marker、Autocomplete和PlaceSearch插件
  }).then(AMap => {
    map = new AMap.Map("container", {
      zoom: 15,
      center: [newFormInline.value.lng, newFormInline.value.lat],
      resizeEnable: true
    });
    data.auto = new AMap.AutoComplete({
      input: "tipinput"
    });
    data.marker = new AMap.Marker({
      position: new AMap.LngLat(newFormInline.value.lng, newFormInline.value.lat),
      content: `<img src='${house}' style="width: 48px; height: 48px;">`, // 替换为你的房子图标URL
      offset: new AMap.Pixel(-24, -24)
    });

    data.marker.setLabel({
      direction: "bottom",
      offset: new AMap.Pixel(20, 20),
      content: `<div> ${newFormInline.value.name}</div>`
    });

    // data.marker.setMap(data.map);

    // 监听地图的点击事件
    map.on("click", function (e) {
      newFormInline.value.lng = e.lnglat.lng
      newFormInline.value.lat = e.lnglat.lat
      // 移动标记到新位置
      data.marker.setPosition(new AMap.LngLat(e.lnglat.lng, e.lnglat.lat));
    });


    let autocomplete = new AMap.AutoComplete(data.auto);
    let placeSearch = new AMap.PlaceSearch({
      map: map
    });
    autocomplete.on("select", select); //注册监听，当选中某条记录时会触发
    function select(e) {
      placeSearch.setCity(e.poi.adcode);
      placeSearch.search(e.poi.name); //关键字查询查询
    }
  }).catch(error => {
    console.error("地图加载失败", error);
  });
})
onUnmounted(() => {
  map?.destroy();
});
</script>

<template>
  <input id="tipinput" type="text" placeholder="搜索位置..."/>
  <div id="container"></div>
</template>

<style scoped lang="scss">
#container {
  width: 100%;
  height: 50vh;
}

#tipinput {
  z-index: 999;
}
</style>
