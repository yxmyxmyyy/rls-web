import { dayjs, cloneDeep, getRandomIntBetween } from "./utils";
import GroupLine from "@iconify-icons/ri/group-line";
import Question from "@iconify-icons/ri/question-answer-line";
import CheckLine from "@iconify-icons/ri/chat-check-line";
import Smile from "@iconify-icons/ri/star-smile-line";
import { ref } from "vue";
import { count, findAllProductStocks, weekcount } from "@/api/task";

const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

/** 需求人数、提问数量、解决数量、用户满意度 */
const chartData = [
  {
    icon: GroupLine,
    bgColor: "#effaff",
    color: "#41b6ff",
    duration: 2200,
    name: "进行中订单",
    value: 0
  },
  {
    icon: Question,
    bgColor: "#fff5f4",
    color: "#e85f33",
    duration: 1600,
    name: "今日新增订单",
    value: 0
  },
  {
    icon: CheckLine,
    bgColor: "#eff8f4",
    color: "#26ce83",
    duration: 1500,
    name: "今日完结订单",
    value: 0
  },
  {
    icon: Smile,
    bgColor: "#eff8f4",
    color: "rgba(206,38,38,0.79)",
    duration: 1500,
    name: "异常订单",
    value: 0
  }
];

/** 分析概览 */
const barChartData = [
  {
    inProgressData: [2101, 5288, 4239, 4962, 6752, 5208, 7450],
    endProgressData: [2216, 1148, 1255, 1788, 4821, 1973, 4379]
  },
  {
    inProgressData: [2101, 3280, null, 123],
    endProgressData: [2116, 3148, 3255, 3788]
  }
];

/** 解决概率 */
const progressData = [
  {
    week: "周一",
    percentage: 85,
    duration: 110,
    color: "#41b6ff"
  },
  {
    week: "周二",
    percentage: 86,
    duration: 105,
    color: "#41b6ff"
  },
  {
    week: "周三",
    percentage: 88,
    duration: 100,
    color: "#41b6ff"
  },
  {
    week: "周四",
    percentage: 89,
    duration: 95,
    color: "#41b6ff"
  },
  {
    week: "周五",
    percentage: 94,
    duration: 90,
    color: "#26ce83"
  },
  {
    week: "周六",
    percentage: 96,
    duration: 85,
    color: "#26ce83"
  },
  {
    week: "周日",
    percentage: 100,
    duration: 80,
    color: "#26ce83"
  }
].reverse();

/** 数据统计 */
const tableData = Array.from({ length: 30 }).map((_, index) => {
  return {
    id: index + 1,
    requiredNumber: getRandomIntBetween(13500, 19999),
    questionNumber: getRandomIntBetween(12600, 16999),
    resolveNumber: getRandomIntBetween(13500, 17999),
    satisfaction: getRandomIntBetween(95, 100),
    date: dayjs().subtract(index, "day").format("YYYY-MM-DD")
  };
});

/** 最新动态 */
const latestNewsData = cloneDeep(tableData)
  .slice(0, 14)
  .map((item, index) => {
    return Object.assign(item, {
      date: `${dayjs().subtract(index, "day").format("YYYY-MM-DD")} ${
        days[dayjs().subtract(index, "day").day()]
      }`
    });
  });

export function Search() {
  const loading = ref(true);
  const houseLocation = ref();
  const loadList = ref();
  const ProductStocks = ref();

  async function onSearch() {
    loading.value = true;
    const { data } = await count();

    chartData[0].value = data.now;
    chartData[1].value = data.inProgress;
    chartData[2].value = data.endProgress;
    chartData[3].value = data.errorProgress;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function onSearch1() {
    loading.value = true;

    const { data } = await weekcount();
    barChartData[1].inProgressData = data.inProgressData;
    barChartData[1].endProgressData = data.endProgressData;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function onSearch2() {
    loading.value = true;

    const { data } = await findAllProductStocks();
    ProductStocks.value = data;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  return {
    loading,
    onSearch,
    onSearch1,
    onSearch2,
    ProductStocks,
    loadList,
    houseLocation
  };
}

export { chartData, barChartData, progressData, tableData, latestNewsData };
