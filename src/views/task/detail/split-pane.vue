<script setup lang="ts">
import { ContextProps } from "@/components/ReSplitPane";
import { reactive } from "vue";
import Amap from "./map";

defineOptions({
  name: "split1"
});

const settingTB: ContextProps = reactive({
  minPercent: 20,
  defaultPercent: 40,
  split: "horizontal"
});
</script>

<template>
  <el-card>
    <div><Amap /></div>
  </el-card>



  <!--  <el-card shadow="never">-->
<!--    <div class="split-pane">-->
<!--      <splitpane :splitSet="settingTB">-->
<!--        <template #paneL>-->
<!--          <el-scrollbar-->
<!--            ><div class="dv-b"><map /></div-->
<!--          ></el-scrollbar>-->
<!--        </template>-->
<!--        <template #paneR>-->
<!--          <el-scrollbar>-->
<!--            <div class="dv-c">C</div>-->
<!--          </el-scrollbar>-->
<!--        </template>-->
<!--      </splitpane>-->
<!--    </div>-->
<!--  </el-card>-->
</template>

<style lang="scss" scoped>
.split-pane {
  width: 100%;
  height: calc(100vh - 200px);
  font-size: 50px;
  text-align: center;
  border: 1px solid #e5e6eb;

  .dv-a {
    padding-top: 30vh;
    color: rgba($color: dodgerblue, $alpha: 80%);
  }

  .dv-b {
    padding-top: 10vh;
    color: rgba($color: #000, $alpha: 80%);
  }

  .dv-c {
    padding-top: 18vh;
    color: rgba($color: #ce272d, $alpha: 80%);
  }
}
</style>
