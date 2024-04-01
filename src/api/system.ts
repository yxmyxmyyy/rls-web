import { http } from "@/utils/http";

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

/** 获取用户管理列表 */
export const getUserList = (
  data?: object,
  pageNum?: number,
  pageSize?: number
) => {
  return http.request<ResultTable>(
    "post",
    "/system/user/find?pageNum=" + pageNum + "&pageSize=" + pageSize,
    { data }
  );
};

/** 新增用户 */
export const addOrUpdateUser = (data?: object) => {
  return http.request<Result>("post", "/system/user/saveOrUpdate", {
    data
  });
};

/** 修改用户 */
export const updateUser = (data?: object) => {
  return http.request<Result>("put", "/system/user/update", { data });
};


/** 批量删除用户 */
export const deleteUsers = (data?: object) => {
  return http.request<Result>("delete", "/system/user/delete", { data });
};

/** 删除单个用户 */
export const deleteUser = id => {
  return http.request<Result>("delete", "/system/user/deleteOne/" + id, {
    withCredentials: true
  });
};

/** 获取部门管理列表 */
export const getDept = id => {
  return http.request<Result>("get", "/system/warehouse/findOne/" + id);
};

/** 获取部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result>("post", "/system/warehouse/findAll", { data });
};

/** 新增修改部门 */
export const addOrUpdateDept = (data?: object) => {
  return http.request<Result>("post", "/system/warehouse/saveOrUpdate", {
    data
  });
};

/** 删除部门 */
export const deleteDept = (data?: object) => {
  return http.request<Result>("delete", "/system/warehouse/delete", { data });
};
