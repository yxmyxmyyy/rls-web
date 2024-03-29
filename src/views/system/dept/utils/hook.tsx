import dayjs from "dayjs";
import editForm from "../form.vue";
import mapForm from "../map.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { addOrUpdateDept, deleteDept, getDeptList } from "@/api/system";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { h, onMounted, reactive, ref } from "vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";

export function useDept() {
  const form = reactive({
    name: "",
    status: null
  });

  const mapRef = ref();
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyle } = usePublicHooks();

  const columns: TableColumnList = [
    {
      label: "部门名称",
      prop: "name",
      width: 180,
      align: "left"
    },
    {
      label: "排序",
      prop: "sort",
      minWidth: 70
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} style={tagStyle.value(row.status)}>
          {row.status === 1 ? "启用" : "停用"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      minWidth: 200,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "负责人",
      prop: "principal",
      minWidth: 50
    },
    {
      label: "操作",
      fixed: "right",
      width: 280,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getDeptList(); // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
    let newData = data;
    if (!isAllEmpty(form.name)) {
      // 前端搜索部门名称
      newData = newData.filter(item => item.name.includes(form.name));
    }
    if (!isAllEmpty(form.status)) {
      // 前端搜索状态
      newData = newData.filter(item => item.status === form.status);
    }
    dataList.value = handleTree(newData); // 处理成树结构
    console.log(dataList.value);
    setTimeout(() => {
      loading.value = false;
    }, 500);
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

  function openMap(row?: FormItemProps) {
    addDialog({
      title: row ? row.name : "地图位置",
      props: {
        formInline: {
          id: row?.id ?? null,
          parentId: row?.parentId ?? 0,
          name: row?.name ?? "",
          principal: row?.principal ?? "",
          phone: row?.phone ?? "",
          sort: row?.sort ?? 0,
          status: row?.status ?? 1,
          remark: row?.remark ?? "",
          type: row?.type ?? 1,
          lng: row?.lng ?? 0,
          lat: row?.lat ?? 0
        }
      },
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(mapForm, { ref: mapRef }),
      beforeSure: done => {
        const MapRef = mapRef.value.getRef();
        console.log(MapRef);
        function chores(r) {
          if (r) {
            message(`您修改了部门名称为${row.name}的这条数据`, {
              type: "success"
            });
          } else {
            message(`您修改数据失败`, {
              type: "error"
            });
          }
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        // 实际开发先调用新增接口，再进行下面操作
        addOrUpdateDept({
          id: row.id,
          type: row.type,
          lng: MapRef.lng,
          lat: MapRef.lat
        })
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
            message(`您修改数据失败: ${errorMessage}`, {
              type: "error"
            });
          });
      }
    });
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}部门`,
      props: {
        formInline: {
          higherDeptOptions: formatHigherDeptOptions(cloneDeep(dataList.value)),
          id: row?.id ?? null,
          parentId: row?.parentId ?? 0,
          name: row?.name ?? "",
          principal: row?.principal ?? "",
          phone: row?.phone ?? "",
          sort: row?.sort ?? 0,
          status: row?.status ?? 1,
          remark: row?.remark ?? "",
          type: row?.type ?? 1,
          lng: row?.lng ?? 0,
          lat: row?.lat ?? 0
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores(r) {
          if (r) {
            message(`您${title}了部门名称为${curData.name}的这条数据`, {
              type: "success"
            });
          } else {
            message(`您${title}数据失败`, {
              type: "error"
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
              addOrUpdateDept(curData)
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
              addOrUpdateDept(curData)
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

  function handleDelete(row) {
    deleteDept(row).then(r => {
      if (r) {
        message(`您删除了部门名称为${row.name}的这条数据`, { type: "success" });
        onSearch();
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改部门 */
    openDialog,
    /** 删除部门 */
    handleDelete,
    handleSelectionChange,

    openMap
  };
}
