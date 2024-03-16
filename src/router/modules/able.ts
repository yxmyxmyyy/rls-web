import { able } from "@/router/enums";

export default {
  path: "/able",
  meta: {
    icon: "ri:ubuntu-fill",
    title: "地图",
    rank: able
  },
  children: [
    {
      path: "/able/map",
      name: "MapPage",
      component: () => import("@/views/system/map/map.vue"),
      meta: {
        title: "地图",
        icon: "ri:git-branch-line"
      }
    }
  ]
};
