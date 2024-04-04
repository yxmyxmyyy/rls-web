import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  username: [{ required: true, message: "账号为必填项", trigger: "blur" }],
  role: [{ required: true, message: "角色权限为必填项", trigger: "blur" }],
  isActive: [{ required: true, message: "角色状态为必填项", trigger: "blur" }]
});
