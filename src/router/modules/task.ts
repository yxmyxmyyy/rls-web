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
    },
    {
      path: "/mqtt/index",
      name: "mqtt",
      component: () => import("@/views/task/detail/mqtt.vue"),
      meta: {
        title: "测试",
        roles: ["0"]
      }
    },
    {
      path: "/split1/index",
      name: "split1",
      component: () => import("@/views/task/detail/split-pane.vue"),
      meta: {
        title: "测试1",
        roles: ["0"]
      }
    }
  ]
};
