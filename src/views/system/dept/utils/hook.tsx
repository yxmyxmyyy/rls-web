import dayjs from "dayjs";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { addOrUpdateDept, deleteDept, getDeptList } from "@/api/system";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h, Fragment } from "vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import AMapLoader from "@amap/amap-jsapi-loader";
import house from "@/assets/house.png";
export function useDept() {
  const form = reactive({
    name: "",
    status: null
  });

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

  function openMap(row) {
    let map = null;
    let marker = null; // 定义marker变量
    let selectedPosition = ref({ lng: row.lng, lat: row.lat }); // 用于保存选中的位置

    addDialog({
      title: row ? row.name : "地图位置",
      fullscreenIcon: true,
      contentRenderer: () => {
        const mapContainerRef = ref(null);

        AMapLoader.load({
          key: "e6c8024a88ca88d97889a2f442dc5064", // 使用您的API Key
          version: "2.0",
          plugins: ["Marker", "AMap.PlaceSearch", "AMap.AutoComplete"] // 加载Marker、Autocomplete和PlaceSearch插件
        })
          .then(AMap => {
            if (mapContainerRef.value && row) {
              map = new AMap.Map(mapContainerRef.value, {
                zoom: 15,
                center: [row.lng, row.lat],
                resizeEnable: true
              });

              marker = new AMap.Marker({
                position: new AMap.LngLat(row.lng, row.lat),
                content: `<img src='${house}' style="width: 48px; height: 48px;">`, // 替换为你的房子图标URL
                offset: new AMap.Pixel(-24, -24)
              });

              marker.setLabel({
                direction: "bottom",
                offset: new AMap.Pixel(20, 20),
                content: `<div> ${row.name}</div>`
              });

              marker.setMap(map);

              // 监听地图的点击事件
              map.on("click", function (e) {
                selectedPosition.value = {
                  lng: e.lnglat.lng,
                  lat: e.lnglat.lat
                };
                // 移动标记到新位置
                marker.setPosition(new AMap.LngLat(e.lnglat.lng, e.lnglat.lat));
              });

              // 实例化自动完成插件
              let autoOptions = {
                input: "autocomplete-input" // 绑定到自动完成输入框的ID
              };

              let autocomplete = new AMap.AutoComplete(autoOptions);
              let placeSearch = new AMap.PlaceSearch({
                map: map
              });
              console.log(autocomplete);
              autocomplete.on("select", select); //注册监听，当选中某条记录时会触发
              function select(e) {
                placeSearch.setCity(e.poi.adcode);
                placeSearch.search(e.poi.name); //关键字查询查询
              }
            }
          })
          .catch(error => {
            console.error("地图加载失败", error);
          });

        return () => [
          h("input", {
            id: "autocomplete-input",
            style: {
              width: "300px",
              height: "40px",
              position: "absolute",
              top: "50px",
              left: "10px",
              zIndex: 10
            },
            placeholder: "搜索位置..."
          }),
          h("div", {
            ref: mapContainerRef,
            style: {
              width: "100%",
              height: "500px",
              borderRadius: "15px",
              overflow: "hidden"
            }
          })
        ];
      },
      closeCallBack: () => {
        if (map) {
          map.destroy();
          map.clearEvents();
        }
      },
      beforeSure: done => {
        console.log(
          `ID: ${row.id}, 新经度: ${selectedPosition.value.lng}, 新纬度: ${selectedPosition.value.lat}`
        );
        done();
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
          type: row?.type ?? 1
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
