export default {
  path: "/count",
  redirect: "/count/index",
  meta: {
    icon: "ph:house",
    title: "统计数据"
  },
  children: [
    {
      path: "/count/index",
      name: "Count",
      component: () => import("@/views/count/index.vue"),
      meta: {
        title: "统计数据",
        roles: ["0", "1"]
      }
    }
  ]
};
