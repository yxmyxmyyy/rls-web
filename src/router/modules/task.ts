export default {
  path: "/task",
  redirect: "/task/index",
  meta: {
    icon: "ph:house",
    title: "订单管理"
  },
  children: [
    {
      path: "/taskin/index",
      name: "taskin",
      component: () => import("@/views/task/in/index.vue"),
      meta: {
        title: "入库订单",
        roles: ["0"]
      }
    },
    {
      path: "/taskout/index",
      name: "taskout",
      component: () => import("@/views/task/out/index.vue"),
      meta: {
        title: "出库订单",
        roles: ["0"]
      }
    }
  ]
};
