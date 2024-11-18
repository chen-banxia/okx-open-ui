<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="标识码" prop="uniqueCode">
            <el-input v-model="queryParams.uniqueCode" placeholder="请输入标识码" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="推荐指数" prop="recomIndex">
            <el-input v-model="queryParams.recomIndex" placeholder="请输入推荐指数" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="平台" prop="platform">
            <el-select v-model="queryParams.platform" placeholder="请选择平台" clearable>
              <el-option
                v-for="dict in copytrading_platform"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['okx:copytradingInfo:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['okx:copytradingInfo:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['okx:copytradingInfo:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['okx:copytradingInfo:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="copytradingInfoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="标识码" align="center" prop="uniqueCode" />
        <el-table-column label="推荐指数" align="center" prop="recomIndex" />
        <el-table-column label="平台" align="center" prop="platform">
          <template #default="scope">
            <dict-tag :options="copytrading_platform" :value="scope.row.platform"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['okx:copytradingInfo:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['okx:copytradingInfo:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改交易员信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="copytradingInfoFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="标识码" prop="uniqueCode">
          <el-input v-model="form.uniqueCode" placeholder="请输入标识码" />
        </el-form-item>
        <el-form-item label="推荐指数" prop="recomIndex">
          <el-input v-model="form.recomIndex" placeholder="请输入推荐指数" />
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-select v-model="form.platform" placeholder="请选择平台">
            <el-option
                v-for="dict in copytrading_platform"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CopytradingInfo" lang="ts">
import { listCopytradingInfo, getCopytradingInfo, delCopytradingInfo, addCopytradingInfo, updateCopytradingInfo } from '@/api/okx/copytradingInfo';
import { CopytradingInfoVO, CopytradingInfoQuery, CopytradingInfoForm } from '@/api/okx/copytradingInfo/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { copytrading_platform } = toRefs<any>(proxy?.useDict('copytrading_platform'));

const copytradingInfoList = ref<CopytradingInfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const copytradingInfoFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CopytradingInfoForm = {
  id: undefined,
  name: undefined,
  uniqueCode: undefined,
  recomIndex: undefined,
  platform: undefined,
}
const data = reactive<PageData<CopytradingInfoForm, CopytradingInfoQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    uniqueCode: undefined,
    recomIndex: undefined,
    platform: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "ID不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ],
    uniqueCode: [
      { required: true, message: "标识码不能为空", trigger: "blur" }
    ],
    recomIndex: [
      { required: true, message: "推荐指数不能为空", trigger: "blur" }
    ],
    platform: [
      { required: true, message: "平台不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询交易员信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCopytradingInfo(queryParams.value);
  copytradingInfoList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  copytradingInfoFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: CopytradingInfoVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加交易员信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CopytradingInfoVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCopytradingInfo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改交易员信息";
}

/** 提交按钮 */
const submitForm = () => {
  copytradingInfoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCopytradingInfo(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCopytradingInfo(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CopytradingInfoVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除交易员信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCopytradingInfo(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('okx/copytradingInfo/export', {
    ...queryParams.value
  }, `copytradingInfo_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
