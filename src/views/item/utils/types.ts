interface FormItemProps {
  higherDeptOptions: Record<string, unknown>[];
  productName: string;
  productId: string;
  itemId: string;
  destinationWarehouseId: string;
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
