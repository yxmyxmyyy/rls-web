export default {
  path: "/item",
  redirect: "/item/index",
  meta: {
    icon: "bookAccount",
    title: "学科信息管理"
  },
  children: [
    {
      path: "/item/index",
      name: "Item",
      component: () => import("@/views/item/index.vue"),
      meta: {
        title: "库存管理",
        roles: ["0"]
      }
    },
    {
      path: "/product/index",
      name: "Product",
      component: () => import("@/views/product/index.vue"),
      meta: {
        title: "产品管理",
        roles: ["0"]
      }
    }
  ]
};
