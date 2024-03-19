export default {
  path: "/task",
  redirect: "/task/index",
  meta: {
    icon: "ph:house",
    title: "订单管理"
  },
  children: [
    {
      path: "/task/index",
      name: "task",
      component: () => import("@/views/task/index.vue"),
      meta: {
        title: "入库订单",
        roles: ["0"]
      }
    },
    {
      path: "/product/index",
      name: "Product",
      component: () => import("@/views/product/index.vue"),
      meta: {
        title: "出库订单",
        roles: ["0"]
      }
    }
  ]
};
