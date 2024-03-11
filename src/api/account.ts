import { http } from "@/utils/http";
import { FindResult } from "@/api/types";

// 分页查询
export const accountFind = (pageNum?: number, pageSize?: number) => {
  return http.request<FindResult>(
    "get",
    "/system/user/find?pageNum=" + pageNum + "&pageSize=" + pageSize
  );
};
// 新增
export const accountInsert = (data?: object) => {
  return http.request("post", "/system/user/insert", { data });
};
// 删除
export const accountDelete = id => {
  return http.request("delete", "/system/user/delete/" + id, {
    withCredentials: true
  });
};

// 修改
export const accountUpdate = (data?: object) => {
  return http.request(
    "put",
    "/system/user/update",
    { data },
    {
      withCredentials: true
    }
  );
};

// 权限验证
export const accountRoles = (data?: object) => {
  return http.request("post", "/system/user/roles", { data });
};
