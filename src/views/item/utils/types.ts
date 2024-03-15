interface FormItemProps {
  /** 编号 */
  itemId: string;
  /** 学科名称 */
  warehouseId: number;
  /** 学科id */
  productId: string;
  /** 老师名称 */
  productName: string;
  /** 老师id */
  stock: string;
  /** 班级名称 */
  lastUpdated: Date;
}

interface FormProps {
  formInline: FormItemProps;
  classList: Array<any>;
  teacherList: Array<any>;
  subjectnameList: Array<any>;
}

export type { FormItemProps, FormProps };
