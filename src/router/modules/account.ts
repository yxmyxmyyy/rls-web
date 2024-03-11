export default {
  path: "/account",
  redirect: "/account/index",
  meta: {
    icon: "bookAccount",
    title: "账号管理"
  },
  children: [
    {
      path: "/account/index",
      name: "Account",
      component: () => import("@/views/account/index.vue"),
      meta: {
        title: "账号管理",
        roles: ["0"]
      }
    }
  ]
};
