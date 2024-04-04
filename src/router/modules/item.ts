export default {
  path: "/item",
  redirect: "/item/index",
  meta: {
    icon: "ph:house",
    title: "产品库存"
  },
  children: [
    {
      path: "/item/index",
      name: "Item",
      component: () => import("@/views/item/index.vue"),
      meta: {
        title: "库存管理",
        roles: ["0", "1", "2", "3"]
      }
    },
    {
      path: "/product/index",
      name: "Product",
      component: () => import("@/views/product/index.vue"),
      meta: {
        title: "产品管理",
        roles: ["0", "1", "2", "3"]
      }
    }
  ]
};
