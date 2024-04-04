interface FormItemProps {
  vehicleId: string;
  licensePlate: string;
  type: string;
  capacity: number;
  status: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
