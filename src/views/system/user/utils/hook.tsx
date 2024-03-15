import "./reset.css";
import dayjs from "dayjs";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "../utils/types";
import { getKeyList, hideTextAtIndex, isAllEmpty } from "@pureadmin/utils";
import {
  addOrUpdateUser,
  deleteUser,
  deleteUsers,
  getDeptList,
  getUserList,
  updateUser
} from "@/api/system";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElMessageBox,
  ElProgress
} from "element-plus";
import {
  computed,
  h,
  onMounted,
  reactive,
  ref,
  type Ref,
  toRaw,
  watch
} from "vue";
import { REGEXP_PWD } from "@/views/system/user/utils/rule";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    // 左侧部门树的id
    warehouseId: "",
    username: "",
    phone: "",
    status: ""
  });
  const formRef = ref();
  const ruleFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "用户编号",
      prop: "id",
      width: 90
    },
    {
      label: "用户名称",
      prop: "username",
      minWidth: 130
    },
    {
      label: "性别",
      prop: "sex",
      minWidth: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.sex === 1 ? "danger" : null}
          effect="plain"
        >
          {row.sex === 1 ? "女" : "男"}
        </el-tag>
      )
    },
    {
      label: "手机号码",
      prop: "phone",
      minWidth: 90,
      formatter: ({ phone }) => hideTextAtIndex(phone, { start: 3, end: 6 })
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>用户吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message("已成功修改用户状态", {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    deleteUser(row.id).then(r => {
      if (r) {
        message(`您删除了用户编号为 ${row.id} 的这条数据`, { type: "success" });
        onSearch();
      }
    });
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    deleteUsers(getKeyList(curSelected, "id")).then(r => {
      if (!r) {
        message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
          type: "success"
        });
        onSearch();
      } else {
        message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
          type: "success"
        });
        onSearch();
      }
    });
    tableRef.value.getTableRef().clearSelection();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getUserList(
      toRaw(form),
      pagination.currentPage,
      pagination.pageSize
    );
    dataList.value = data.records;
    pagination.total = data.total;
    pagination.pageSize = data.size;
    pagination.currentPage = data.current;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.warehouseId = "";
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.warehouseId = selected ? id : "";
    onSearch();
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0 ? true : false;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          title,
          higherDeptOptions: formatHigherDeptOptions(higherDeptOptions.value),
          username: row?.username ?? "",
          password: row?.password ?? "",
          warehouseId: row?.warehouseId ?? "",
          role: row?.role ?? "",
          phone: row?.phone ?? "",
          sex: row?.sex ?? "",
          status: row?.status ?? 1,
          id: row?.id ?? ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores(r) {
          if (r) {
            message(`您${title}了用户名称为${curData.username}的这条数据`, {
              type: "success"
            });
          }
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              addOrUpdateUser(curData)
                .then(r => {
                  chores(r);
                })
                .catch(error => {
                  // 假设后端返回的错误格式为 { message: "这里是错误信息" }
                  let errorMessage = "操作失败，请重试"; // 默认错误消息
                  if (
                    error &&
                    error.response &&
                    error.response.data &&
                    error.response.data.msg
                  ) {
                    errorMessage = error.response.data.msg; // 从错误对象中提取错误消息
                  }
                  // 使用你的消息弹出库显示错误
                  message(`您${title}数据失败: ${errorMessage}`, {
                    type: "error"
                  });
                });
              // ;
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              updateUser(curData)
                .then(r => {
                  chores(r);
                })
                .catch(error => {
                  // 假设后端返回的错误格式为 { message: "这里是错误信息" }
                  let errorMessage = "操作失败，请重试"; // 默认错误消息
                  if (
                    error &&
                    error.response &&
                    error.response.data &&
                    error.response.data.msg
                  ) {
                    errorMessage = error.response.data.msg; // 从错误对象中提取错误消息
                  }
                  // 使用你的消息弹出库显示错误
                  message(`您${title}数据失败: ${errorMessage}`, {
                    type: "error"
                  });
                });
            }
          }
        });
      }
    });
  }

  /** 上传头像 */

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  /** 重置密码 */
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.username} 用户的密码`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => (
        <>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    if (value === "") {
                      callback(new Error("请输入密码"));
                    } else if (!REGEXP_PWD.test(value)) {
                      callback(
                        new Error(
                          "密码格式应为8-18位数字、字母、符号的任意两种组合"
                        )
                      );
                    } else {
                      callback();
                    }
                  },
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="mt-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        ruleFormRef.value.validate(valid => {
          if (valid) {
            updateUser({
              password: pwdForm.newPwd,
              id: row.id
            })
              .then(() => {
                message(`已成功重置 ${row.username} 用户的密码`, {
                  type: "success"
                });
              })
              .catch(error => {
                // 假设后端返回的错误格式为 { message: "这里是错误信息" }
                let errorMessage = "操作失败，请重试"; // 默认错误消息
                if (
                  error &&
                  error.response &&
                  error.response.data &&
                  error.response.data.msg
                ) {
                  errorMessage = error.response.data.msg; // 从错误对象中提取错误消息
                }
                // 使用你的消息弹出库显示错误
                message(
                  `您重置 ${row.username} 用户的密码失败: ${errorMessage}`,
                  {
                    type: "error"
                  }
                );
              });
            // 根据实际业务使用pwdForm.newPwd和row里的某些字段去调用重置用户密码接口即可
            done(); // 关闭弹框
            onSearch(); // 刷新表格数据
          }
        });
      }
    });
  }

  // /** 分配角色 */
  // async function handleRole(row) {
  //   // 选中的角色列表
  //   const ids = (await getRoleIds({ userId: row.id })).data ?? [];
  //   addDialog({
  //     title: `分配 ${row.username} 用户的角色`,
  //     props: {
  //       formInline: {
  //         username: row?.username ?? "",
  //         nickname: row?.nickname ?? "",
  //         roleOptions: roleOptions.value ?? [],
  //         ids
  //       }
  //     },
  //     width: "400px",
  //     draggable: true,
  //     fullscreenIcon: true,
  //     closeOnClickModal: false,
  //     contentRenderer: () => h(roleForm),
  //     beforeSure: (done, { options }) => {
  //       const curData = options.props.formInline as RoleFormItemProps;
  //       console.log("curIds", curData.ids);
  //       // 根据实际业务使用curData.ids和row里的某些字段去调用修改角色接口即可
  //       done(); // 关闭弹框
  //     }
  //   });
  // }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();

    // 归属部门
    const { data } = await getDeptList();
    higherDeptOptions.value = handleTree(data);
    treeData.value = handleTree(data);
    treeLoading.value = false;

    // // 角色列表
    // roleOptions.value = (await getAllRoleList()).data;
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    onTreeSelect,
    handleUpdate,
    handleDelete,
    handleReset,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
