export default {
  path: "/task",
  redirect: "/task/index",
  meta: {
    icon: "ph:house",
    title: "订单管理"
  },
  children: [
    {
      path: "/task/in",
      name: "taskin",
      component: () => import("@/views/task/in/index.vue"),
      meta: {
        title: "入库订单",
        roles: ["0"]
      }
    },
    {
      path: "/task/out",
      name: "taskout",
      component: () => import("@/views/task/out/index.vue"),
      meta: {
        title: "出库订单",
        roles: ["0"]
      }
    },
    {
      path: "/task/detail",
      name: "taskDetail",
      component: () => import("@/views/task/detail/index.vue"),
      meta: {
        // 不在menu菜单中显示
        showLink: false,
        activePath: "/task/detail",
        roles: ["2"]
      }
    }
  ]
};
