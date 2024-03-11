interface FormItemProps {
  /** 角色编号 */
  id: string;
  /** 账号 */
  username: string;
  /** 权限 */
  role: number;
  /** 状态 */
  isActive: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
