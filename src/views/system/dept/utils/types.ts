interface FormItemProps {
  higherDeptOptions: Record<string, unknown>[];
  id: number;
  parentId: number;
  name: string;
  principal: string;
  phone: string | number;
  sort: number;
  status: number;
  remark: string;
  type: number;
  lng: number;
  lat: number;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
