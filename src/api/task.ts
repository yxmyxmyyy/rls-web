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

/** 入库查询 */
export const Transportin = (
  data?: object,
  pageNum?: number,
  pageSize?: number
) => {
  return http.request<ResultTable>(
    "post",
    "/task/Transport/findin?pageNum=" + pageNum + "&pageSize=" + pageSize,
    { data }
  );
};

export const deleteTask = id => {
  return http.request<Result>("delete", "/task/Transport/deleteOne/" + id, {
    withCredentials: true
  });
};

/** 结算订单 */
export const end = id => {
  return http.request<Result>("put", "/task/Transport/end/" + id, {
    withCredentials: true
  });
};

export const newTransport = (data?: object) => {
  return http.request<Result>("post", "/task/Transport/new", { data });
};

/** 出库查询 */
export const Transportout = (
  data?: object,
  pageNum?: number,
  pageSize?: number
) => {
  return http.request<ResultTable>(
    "post",
    "/task/Transport/findout?pageNum=" + pageNum + "&pageSize=" + pageSize,
    { data }
  );
};
