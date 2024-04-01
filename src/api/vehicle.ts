import { http } from "@/utils/http";
import type { FindResult } from "@/api/types";

type Result = {
  success: boolean;
  data?: Array<any>;
};

export const vehicleLogs = id => {
  return http.request<Result>("get", "/vehicle/VehicleLog/getVehicleLog/" + id);
};
