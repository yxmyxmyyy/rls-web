import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  accountDelete,
  accountFind,
  accountInsert,
  accountUpdate
} from "@/api/account";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "./hooks";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { computed, h, onMounted, reactive, ref, type Ref } from "vue";

export function useAccount(tableRef: Ref) {
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const selectedNum = ref(0);
  const form = reactive({
    username: "",
    role: null,
    isActive: null
  });
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
      label: "用户账号",
      prop: "username",
      minWidth: 130
    },
    {
      label: "用户权限",
      prop: "role",
      minWidth: 130,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          // type={row.role === 0 ? "danger" : ""}
          // effect="plain"
        >
          {row.role === 0
            ? "超级管理员"
            : row.role === 1
              ? "县级"
              : row.role === 2
                ? "乡级"
                : "村级"}
        </el-tag>
      )
    },
    {
      label: "状态",
      prop: "isActive",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.isActive}
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
  const rePwd = "0192023a7bbd73250516f069df18b500";

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.isActive === 0 ? "停用" : "启用"
      }</strong><strong style="color:var(--el-color-primary)">${
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
        accountUpdate(row);
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
        row.isActive === 0 ? (row.isActive = 1) : (row.isActive = 0);
      });
  }

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    accountDelete(row.id).then(r => {
      if (r) {
        message(`您删除了用户编号为 ${row.id} 的这条数据`, { type: "success" });
        onSearch();
      }
    });
  }

  // 选择一页多少条数据
  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  // 选择到第几页
  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
    console.log(`current page: ${val}`);
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
    for (const i in curSelected) {
      accountDelete(curSelected[i].id).then(r => {
        if (!r) {
          message(`删除编号为 ${curSelected[i].id} 的数据失败`, {
            type: "success"
          });
        } else {
          message(`您删除了用户编号为 ${curSelected[i].id} 的这条数据`, {
            type: "success"
          });
        }
      });
    }
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    // message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
    //   type: "success"
    // });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { records, total } = await accountFind(
      pagination.currentPage,
      pagination.pageSize
    );
    dataList.value = records;
    pagination.total = total;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          title,
          id: row?.id ?? null,
          username: row?.username ?? "",
          role: row?.role ?? 2,
          isActive: row?.isActive ?? 1
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
          } else {
            message(`您${title}数据失败`, {
              type: "success"
            });
          }
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              accountInsert(curData).then(r => {
                chores(r);
              });
            } else {
              // 实际开发先调用编辑接口，再进行下面操作
              accountUpdate(curData).then(r => {
                chores(r);
              });
            }
          }
        });
      }
    });
  }

  /** 重置密码 */
  function handleReset(row) {
    row.password = rePwd;
    accountUpdate(row).then(r => {
      if (r)
        message(`成功重置${row.username}的密码`, {
          type: "success"
        });
    });
  }

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    buttonClass,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    handleUpdate,
    handleDelete,
    handleReset,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
