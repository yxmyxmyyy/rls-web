import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { isPhone } from "@pureadmin/utils";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "部门名称为必填项", trigger: "blur" }],
  type: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (value === 1 || value === 2 || value === 3) {
          callback();
        } else {
          callback(new Error("类型只能为县,乡,村"));
        }
      },
      trigger: "click"
    }
  ],
  phone: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isPhone(value)) {
          callback(new Error("请输入正确的手机号码格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
      // trigger: "click" // 如果想在点击确定按钮时触发这个校验，trigger 设置成 click 即可
    }
  ]
});
