<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="用户ID" prop="userId">
            <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="交易员标识码" prop="uniqueCode">
            <el-input v-model="queryParams.uniqueCode" placeholder="请输入交易员标识码" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="产品ID" prop="instId">
            <el-input v-model="queryParams.instId" placeholder="请输入产品ID" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="保证金模式" prop="mgnMode">
            <el-select v-model="queryParams.mgnMode" placeholder="请选择保证金模式" clearable>
              <el-option
                v-for="dict in sub_pos_current_mgn_mode"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产品类型" prop="instType">
            <el-select v-model="queryParams.instType" placeholder="请选择产品类型" clearable>
              <el-option
                v-for="dict in sub_pos_current_inst_type"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['okx:userSwapConfig:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['okx:userSwapConfig:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['okx:userSwapConfig:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['okx:userSwapConfig:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="userSwapConfigList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="交易员标识码" align="center" prop="uniqueCode" />
        <el-table-column label="产品ID" align="center" prop="instId" />
        <el-table-column label="保证金模式" align="center" prop="mgnMode">
          <template #default="scope">
            <dict-tag :options="sub_pos_current_mgn_mode" :value="scope.row.mgnMode"/>
          </template>
        </el-table-column>
        <el-table-column label="产品类型" align="center" prop="instType">
          <template #default="scope">
            <dict-tag :options="sub_pos_current_inst_type" :value="scope.row.instType"/>
          </template>
        </el-table-column>
        <el-table-column label="杠杆倍数" align="center" prop="lever" />
        <el-table-column label="投入u数量" align="center" prop="num" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['okx:userSwapConfig:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['okx:userSwapConfig:remove']"></el-button>
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
    <!-- 添加或修改用户合约跟单配置对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="userSwapConfigFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="交易员标识码" prop="uniqueCode">
          <el-input v-model="form.uniqueCode" placeholder="请输入交易员标识码" />
        </el-form-item>
        <el-form-item label="产品ID" prop="instId">
          <el-input v-model="form.instId" placeholder="请输入产品ID" />
        </el-form-item>
        <el-form-item label="保证金模式" prop="mgnMode">
          <el-select v-model="form.mgnMode" placeholder="请选择保证金模式">
            <el-option
                v-for="dict in sub_pos_current_mgn_mode"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" prop="instType">
          <el-select v-model="form.instType" placeholder="请选择产品类型">
            <el-option
                v-for="dict in sub_pos_current_inst_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="杠杆倍数" prop="lever">
          <el-input v-model="form.lever" placeholder="请输入杠杆倍数" />
        </el-form-item>
        <el-form-item label="投入u数量" prop="num">
          <el-input v-model="form.num" placeholder="请输入投入u数量" />
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

<script setup name="UserSwapConfig" lang="ts">
import { listUserSwapConfig, getUserSwapConfig, delUserSwapConfig, addUserSwapConfig, updateUserSwapConfig } from '@/api/okx/userSwapConfig';
import { UserSwapConfigVO, UserSwapConfigQuery, UserSwapConfigForm } from '@/api/okx/userSwapConfig/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sub_pos_current_inst_type, sub_pos_current_mgn_mode } = toRefs<any>(proxy?.useDict('sub_pos_current_inst_type', 'sub_pos_current_mgn_mode'));

const userSwapConfigList = ref<UserSwapConfigVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const userSwapConfigFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: UserSwapConfigForm = {
  id: undefined,
  userId: undefined,
  uniqueCode: undefined,
  instId: undefined,
  mgnMode: undefined,
  instType: undefined,
  lever: undefined,
  num: undefined,
}
const data = reactive<PageData<UserSwapConfigForm, UserSwapConfigQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    uniqueCode: undefined,
    instId: undefined,
    mgnMode: undefined,
    instType: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "ID不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "用户ID不能为空", trigger: "blur" }
    ],
    uniqueCode: [
      { required: true, message: "交易员标识码不能为空", trigger: "blur" }
    ],
    instId: [
      { required: true, message: "产品ID不能为空", trigger: "blur" }
    ],
    mgnMode: [
      { required: true, message: "保证金模式不能为空", trigger: "change" }
    ],
    instType: [
      { required: true, message: "产品类型不能为空", trigger: "change" }
    ],
    lever: [
      { required: true, message: "杠杆倍数不能为空", trigger: "blur" }
    ],
    num: [
      { required: true, message: "投入u数量不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户合约跟单配置列表 */
const getList = async () => {
  loading.value = true;
  const res = await listUserSwapConfig(queryParams.value);
  userSwapConfigList.value = res.rows;
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
  userSwapConfigFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: UserSwapConfigVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户合约跟单配置";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: UserSwapConfigVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getUserSwapConfig(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户合约跟单配置";
}

/** 提交按钮 */
const submitForm = () => {
  userSwapConfigFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateUserSwapConfig(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addUserSwapConfig(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: UserSwapConfigVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户合约跟单配置编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delUserSwapConfig(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('okx/userSwapConfig/export', {
    ...queryParams.value
  }, `userSwapConfig_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
