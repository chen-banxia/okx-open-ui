<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="币的简称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入币的简称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="产品id " prop="instId">
            <el-input v-model="queryParams.instId" placeholder="请输入产品id " clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="产品类型" prop="instType">
            <el-select v-model="queryParams.instType" placeholder="请选择产品类型" clearable>
              <el-option
                v-for="dict in trading_inst_type"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['okx:initpushInfo:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['okx:initpushInfo:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['okx:initpushInfo:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['okx:initpushInfo:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="initpushInfoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="币的简称" align="center" prop="name" />
        <el-table-column label="产品id " align="center" prop="instId" />
        <el-table-column label="产品类型" align="center" prop="instType">
          <template #default="scope">
            <dict-tag :options="trading_inst_type" :value="scope.row.instType"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['okx:initpushInfo:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['okx:initpushInfo:remove']"></el-button>
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
    <!-- 添加或修改定时推送币信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="initpushInfoFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="币的简称" prop="name">
          <el-input v-model="form.name" placeholder="请输入币的简称" />
        </el-form-item>
        <el-form-item label="产品id " prop="instId">
          <el-input v-model="form.instId" placeholder="请输入产品id " />
        </el-form-item>
        <el-form-item label="产品类型" prop="instType">
          <el-select v-model="form.instType" placeholder="请选择产品类型">
            <el-option
                v-for="dict in trading_inst_type"
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

<script setup name="InitpushInfo" lang="ts">
import { listInitpushInfo, getInitpushInfo, delInitpushInfo, addInitpushInfo, updateInitpushInfo } from '@/api/okx/initpushInfo';
import { InitpushInfoVO, InitpushInfoQuery, InitpushInfoForm } from '@/api/okx/initpushInfo/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { trading_inst_type } = toRefs<any>(proxy?.useDict('trading_inst_type'));

const initpushInfoList = ref<InitpushInfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const initpushInfoFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: InitpushInfoForm = {
  id: undefined,
  name: undefined,
  instId: undefined,
  instType: undefined,
}
const data = reactive<PageData<InitpushInfoForm, InitpushInfoQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    instId: undefined,
    instType: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "ID不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "币的简称不能为空", trigger: "blur" }
    ],
    instId: [
      { required: true, message: "产品id 不能为空", trigger: "blur" }
    ],
    instType: [
      { required: true, message: "产品类型不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询定时推送币信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listInitpushInfo(queryParams.value);
  initpushInfoList.value = res.rows;
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
  initpushInfoFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: InitpushInfoVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加定时推送币信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: InitpushInfoVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getInitpushInfo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改定时推送币信息";
}

/** 提交按钮 */
const submitForm = () => {
  initpushInfoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateInitpushInfo(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addInitpushInfo(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: InitpushInfoVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除定时推送币信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delInitpushInfo(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('okx/initpushInfo/export', {
    ...queryParams.value
  }, `initpushInfo_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
