<template>
  <div ref="chartRef" style="width: 100%; height: 365px" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { useDark } from "@pureadmin/utils";

const props = defineProps({
  ProductStocks: {
    type: Array,
    required: true
  }
});

const chartRef = ref(null);
const { isDark } = useDark();

// 初始化图表
const initChart = () => {
  // 对ProductStocks按库存量进行降序排序并截取前六个
  const sortedAndLimitedStocks = [...props.ProductStocks]
    .slice(0, 6) // 截取排序后的前六个元素
    .sort((a, b) => a.stock - b.stock);

  const chart = echarts.init(chartRef.value, isDark.value ? "dark" : "light");
  chart.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: "category",
      // 使用排序并限制后的数据设置y轴
      data: sortedAndLimitedStocks.map(item => item.productName)
    },
    series: [
      {
        type: "bar",
        // 使用排序并限制后的数据设置系列数据
        data: sortedAndLimitedStocks.map(item => item.stock),
        itemStyle: {
          borderRadius: 4
        }
      }
    ]
  });
};

onMounted(() => {
  initChart();
});
</script>
