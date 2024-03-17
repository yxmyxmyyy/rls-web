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

/** 分页库存产品 */
export const itemFind = (
  data?: object,
  pageNum?: number,
  pageSize?: number
) => {
  return http.request<ResultTable>(
    "post",
    "/item/item/find?pageNum=" + pageNum + "&pageSize=" + pageSize,
    { data }
  );
};

/** 新增修改库存 */
export const addOrUpdateItem = (data?: object) => {
  return http.request<Result>("post", "/item/item/saveOrUpdate", {
    data
  });
};

/** 扣减库存  */
export const deductStockItem = (data?: object) => {
  return http.request<Result>("put", "/item/item/deductStock", {
    data
  });
};

/** 批量删除库存 */
export const deleteItems = (data?: object) => {
  return http.request<Result>("delete", "/item/item/delete", { data });
};

/** 删除单个库存 */
export const deleteItem = id => {
  return http.request<Result>("delete", "/item/item/deleteOne/" + id, {
    withCredentials: true
  });
};

/** 查询全部库存 */
export const itemFindAll = () => {
  return http.request<Result>("get", "/item/item/findAll");
};

/** 分页查询产品 */
export const productFind = (
  data?: object,
  pageNum?: number,
  pageSize?: number
) => {
  return http.request<ResultTable>(
    "post",
    "/item/product/find?pageNum=" + pageNum + "&pageSize=" + pageSize,
    { data }
  );
};

/** 新增修改产品 */
export const addOrUpdateProduct = (data?: object) => {
  return http.request<Result>("post", "/item/product/saveOrUpdate", {
    data
  });
};

/** 批量删除产品 */
export const deleteProducts = (data?: object) => {
  return http.request<Result>("delete", "/item/product/delete", { data });
};

/** 删除单个产品 */
export const deleteProduct = id => {
  return http.request<Result>("delete", "/item/product/deleteOne/" + id, {
    withCredentials: true
  });
};

/** 查询全部产品 */
export const productFindAll = () => {
  return http.request<Result>("get", "/item/product/findAll");
};
