import { system } from "@/router/enums";
export default {
  path: "/system",
  meta: {
    icon: "ri:settings-3-line",
    title: "系统管理",
    rank: system
  },
  children: [
    {
      path: "/system/user/index",
      name: "SystemUser",
      component: () => import("@/views/system/user/index.vue"),
      meta: {
        icon: "ri:admin-line",
        title: "用户管理",
        roles: ["0"]
      }
    },
    {
      path: "/system/dept/index",
      name: "SystemDept",
      component: () => import("@/views/system/dept/index.vue"),
      meta: {
        icon: "ri:git-branch-line",
        title: "部门管理",
        roles: ["0"]
      }
    }
  ]
};
