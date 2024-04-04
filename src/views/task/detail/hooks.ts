import { isString, isEmpty } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import {
  useRouter,
  useRoute,
  type LocationQueryRaw,
  type RouteParamsRaw
} from "vue-router";
import { ref } from "vue";
import { vehicleLogs } from "@/api/vehicle";
import { getDept } from "@/api/system";
import { findByTaskId } from "@/api/task";

export function useDetail() {
  const route = useRoute();
  const router = useRouter();
  const getParameter = isEmpty(route.params) ? route.query : route.params;
  const dataList = ref();
  const loading = ref(true);
  const houseLocation = ref();
  const loadList = ref();

  async function onSearch(taskId: string) {
    loading.value = true;
    const { data } = await vehicleLogs(taskId);
    dataList.value = data;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function LoadSearch(id) {
    loading.value = true;
    const { data } = await findByTaskId(id);
    loadList.value = data;
    console.log(loadList.value);

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function locationSearch(id) {
    loading.value = true;
    const {
      data: { lat, lng }
    } = await getDept(id);
    houseLocation.value = [lng, lat];

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function toDetail(
    parameter: LocationQueryRaw | RouteParamsRaw,
    model: "query" | "params"
  ) {
    // ⚠️ 这里要特别注意下，因为vue-router在解析路由参数的时候会自动转化成字符串类型，比如在使用useRoute().route.query或useRoute().route.params时，得到的参数都是字符串类型
    // 所以在传参的时候，如果参数是数字类型，就需要在此处 toString() 一下，保证传参跟路由参数类型一致都是字符串，这是必不可少的环节！！！
    Object.keys(parameter).forEach(param => {
      if (!isString(parameter[param])) {
        parameter[param] = parameter[param].toString();
      }
    });
    if (model === "query") {
      // 保存信息到标签页
      useMultiTagsStoreHook().handleTags("push", {
        path: `/task/detail`,
        name: "taskDetail",
        query: parameter,
        meta: {
          title: `No.${parameter.id} - 详情信息`,
          // 如果使用的是非国际化精简版title可以像下面这么写
          // title: `No.${index} - 详情信息`,
          // 最大打开标签数
          dynamicLevel: 3
        }
      });
      // 路由跳转
      router.push({ name: "taskDetail", query: parameter });
    } else if (model === "params") {
      useMultiTagsStoreHook().handleTags("push", {
        path: `/tabs/params-detail/:id`,
        name: "TabParamsDetail",
        params: parameter,
        meta: {
          title: {
            zh: `No.${parameter.id} - 详情信息`,
            en: `No.${parameter.id} - DetailInfo`
          }
          // 如果使用的是非国际化精简版title可以像下面这么写
          // title: `No.${index} - 详情信息`,
        }
      });
      router.push({ name: "TabParamsDetail", params: parameter });
    }
  }

  // 用于页面刷新，重新获取浏览器地址栏参数并保存到标签页
  const initToDetail = (model: "query" | "params") => {
    if (getParameter) toDetail(getParameter, model);
  };

  return {
    toDetail,
    initToDetail,
    getParameter,
    router,
    dataList,
    loading,
    onSearch,
    LoadSearch,
    loadList,
    locationSearch,
    houseLocation
  };
}
