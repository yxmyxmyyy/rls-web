interface FormItemProps {
  productName: string;
  productId: string;
  itemId: string;
  lastUpdated: Date;
  warehouseId: number;
  stock: number;
  weight: number;
}

interface FormProps {
  formInline: FormItemProps;
  productList: Array<any>;
  itemList: Array<any>;
}

export type { FormItemProps, FormProps };
