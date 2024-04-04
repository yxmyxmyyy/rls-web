import editForm from "../form.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { computed, h, onMounted, reactive, ref, type Ref, toRaw } from "vue";
import { deleteProducts, productFindAll } from "@/api/item";
import { getKeyList } from "@pureadmin/utils";
import {
  addOrUpdateVehicle,
  deleteVehicle,
  getVehicleList
} from "@/api/vehicle";

export function useAccount(tableRef: Ref) {
  const itemList = ref();
  const productList = ref();
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const form = reactive({
    licensePlate: "",
    type: "",
    capacity: "",
    status: ""
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
      label: "车辆id",
      prop: "vehicleId",
      minWidth: 130
    },
    {
      label: "牌照",
      prop: "licensePlate",
      minWidth: 130
    },
    {
      label: "类型",
      prop: "type",
      minWidth: 130
    },
    {
      label: "载货量",
      prop: "capacity",
      minWidth: 60
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 60,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 1 ? "info" : null}
          effect="plain"
        >
          {row.status === 1 ? "空闲" : "使用中"}
        </el-tag>
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
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

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    deleteVehicle(row.vehicleId).then(r => {
      if (r) {
        message(`您删除了车辆编号为 ${row.vehicleId} 的这条数据`, {
          type: "success"
        });
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
    deleteProducts(getKeyList(curSelected, "vehicleId")).then(r => {
      if (!r) {
        message(
          `已删除产品编号为 ${getKeyList(curSelected, "vehicleId")} 的数据`,
          {
            type: "success"
          }
        );
        onSearch();
      } else {
        message(
          `已删除产品编号为 ${getKeyList(curSelected, "vehicleId")} 的数据`,
          {
            type: "success"
          }
        );
        onSearch();
      }
    });
    tableRef.value.getTableRef().clearSelection();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getVehicleList(
      toRaw(form),
      pagination.currentPage,
      pagination.pageSize
    );
    dataList.value = data.records;
    pagination.total = data.total;
    pagination.pageSize = data.size;
    pagination.currentPage = data.current;

    await productFindAll().then(r => {
      productList.value = r.data;
    });

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
      title: `${title}车辆`,
      props: {
        formInline: {
          title,
          vehicleId: row?.vehicleId ?? null,
          licensePlate: row?.licensePlate ?? "",
          type: row?.type ?? "",
          capacity: row?.capacity ?? null,
          status: row?.status ?? 1
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
            message(``, {
              type: "success"
            });
          }
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "入库") {
              // 实际开发先调用新增接口，再进行下面操作
              addOrUpdateVehicle(curData)
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
              addOrUpdateVehicle(curData)
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

  onMounted(async () => {
    onSearch();
  });

  return {
    itemList,
    productList,
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
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
