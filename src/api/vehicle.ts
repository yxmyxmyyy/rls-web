import { http } from "@/utils/http";
import type { FindResult } from "@/api/types";

type Result = {
  success: boolean;
  data?: Array<any>;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    records: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    size?: number;
    /** 当前页数 */
    current?: number;
  };
};

export const vehicleLogs = id => {
  return http.request<Result>("get", "/vehicle/VehicleLog/getVehicleLog/" + id);
};

export const getVehicleList = (
  data?: object,
  pageNum?: number,
  pageSize?: number
) => {
  return http.request<ResultTable>(
    "post",
    "/vehicle/Vehicle/find?pageNum=" + pageNum + "&pageSize=" + pageSize,
    { data }
  );
};

/** 新增 */
export const addOrUpdateVehicle = (data?: object) => {
  return http.request<Result>("post", "/vehicle/Vehicle/insert", {
    data
  });
};

/** 删除 */
export const deleteVehicle = (id: string) => {
  return http.request<Result>("delete", "/vehicle/Vehicle/delete/" + id);
};
