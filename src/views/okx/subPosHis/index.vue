<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="产品ID" prop="instId">
            <el-input v-model="queryParams.instId" placeholder="请输入产品ID" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="持仓方向" prop="posSide">
            <el-select v-model="queryParams.posSide" placeholder="请选择持仓方向" clearable>
              <el-option
                v-for="dict in sub_pos_current_pos_side"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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
          <el-form-item label="杠杆倍数" prop="lever">
            <el-input v-model="queryParams.lever" placeholder="请输入杠杆倍数" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="开仓时间" prop="openTimeDate">
            <el-date-picker clearable
              v-model="queryParams.openTimeDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择开仓时间"
            />
          </el-form-item>
          <el-form-item label="平仓时间" prop="closeTimeDate">
            <el-date-picker clearable
              v-model="queryParams.closeTimeDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择平仓时间"
            />
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
          <el-form-item label="交易员唯一标识代码" prop="uniqueCode">
            <el-input v-model="queryParams.uniqueCode" placeholder="请输入交易员唯一标识代码" clearable style="width: 240px" @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['okx:subPosHis:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['okx:subPosHis:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['okx:subPosHis:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['okx:subPosHis:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="subPosHisList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="产品ID" align="center" prop="instId" />
        <el-table-column label="持仓方向" align="center" prop="posSide">
          <template #default="scope">
            <dict-tag :options="sub_pos_current_pos_side" :value="scope.row.posSide"/>
          </template>
        </el-table-column>
        <el-table-column label="保证金模式" align="center" prop="mgnMode">
          <template #default="scope">
            <dict-tag :options="sub_pos_current_mgn_mode" :value="scope.row.mgnMode"/>
          </template>
        </el-table-column>
        <el-table-column label="杠杆倍数" align="center" prop="lever" />
        <el-table-column label="开仓均价" align="center" prop="openAvgPx" />
        <el-table-column label="开仓时间" align="center" prop="openTimeDate" width="180">
          <template #default="scope">
<!--            <span>{{ parseTime(scope.row.openTimeDate, '{y}-{m}-{d}') }}</span>-->
            <span>{{ parseTime(scope.row.openTimeDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="持仓张数" align="center" prop="subPos" />
        <el-table-column label="平仓时间" align="center" prop="closeTimeDate" width="180">
          <template #default="scope">
<!--            <span>{{ parseTime(scope.row.closeTimeDate, '{y}-{m}-{d}') }}</span>-->
            <span>{{ parseTime(scope.row.closeTimeDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平仓均价" align="center" prop="closeAvgPx" />
        <el-table-column label="收益额" align="center" prop="pnl" />
        <el-table-column label="收益率" align="center" prop="pnlRatio" />
        <el-table-column label="产品类型" align="center" prop="instType">
          <template #default="scope">
            <dict-tag :options="sub_pos_current_inst_type" :value="scope.row.instType"/>
          </template>
        </el-table-column>
        <el-table-column label="保证金" align="center" prop="margin" />
        <el-table-column label="币种" align="center" prop="ccy" />
        <el-table-column label="交易员唯一标识代码" align="center" prop="uniqueCode" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['okx:subPosHis:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['okx:subPosHis:remove']"></el-button>
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
    <!-- 添加或修改交易员带单历史对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="subPosHisFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产品ID" prop="instId">
          <el-input v-model="form.instId" placeholder="请输入产品ID" />
        </el-form-item>
        <el-form-item label="带单仓位ID" prop="subPosId">
          <el-input v-model="form.subPosId" placeholder="请输入带单仓位ID" />
        </el-form-item>
        <el-form-item label="持仓方向" prop="posSide">
          <el-select v-model="form.posSide" placeholder="请选择持仓方向">
            <el-option
                v-for="dict in sub_pos_current_pos_side"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
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
        <el-form-item label="杠杆倍数" prop="lever">
          <el-input v-model="form.lever" placeholder="请输入杠杆倍数" />
        </el-form-item>
        <el-form-item label="开仓均价" prop="openAvgPx">
          <el-input v-model="form.openAvgPx" placeholder="请输入开仓均价" />
        </el-form-item>
        <el-form-item label="开仓时间" prop="openTimeDate">
          <el-date-picker clearable
            v-model="form.openTimeDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择开仓时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="持仓张数" prop="subPos">
          <el-input v-model="form.subPos" placeholder="请输入持仓张数" />
        </el-form-item>
        <el-form-item label="平仓时间" prop="closeTimeDate">
          <el-date-picker clearable
            v-model="form.closeTimeDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择平仓时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="平仓均价" prop="closeAvgPx">
          <el-input v-model="form.closeAvgPx" placeholder="请输入平仓均价" />
        </el-form-item>
        <el-form-item label="收益额" prop="pnl">
          <el-input v-model="form.pnl" placeholder="请输入收益额" />
        </el-form-item>
        <el-form-item label="收益率" prop="pnlRatio">
          <el-input v-model="form.pnlRatio" placeholder="请输入收益率" />
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
        <el-form-item label="保证金" prop="margin">
          <el-input v-model="form.margin" placeholder="请输入保证金" />
        </el-form-item>
        <el-form-item label="币种" prop="ccy">
          <el-input v-model="form.ccy" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="交易员唯一标识代码" prop="uniqueCode">
          <el-input v-model="form.uniqueCode" placeholder="请输入交易员唯一标识代码" />
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

<script setup name="SubPosHis" lang="ts">
import { listSubPosHis, getSubPosHis, delSubPosHis, addSubPosHis, updateSubPosHis } from '@/api/okx/subPosHis';
import { SubPosHisVO, SubPosHisQuery, SubPosHisForm } from '@/api/okx/subPosHis/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sub_pos_current_inst_type, sub_pos_current_pos_side, sub_pos_current_mgn_mode } = toRefs<any>(proxy?.useDict('sub_pos_current_inst_type', 'sub_pos_current_pos_side', 'sub_pos_current_mgn_mode'));

const subPosHisList = ref<SubPosHisVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const subPosHisFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SubPosHisForm = {
  id: undefined,
  instId: undefined,
  subPosId: undefined,
  posSide: undefined,
  mgnMode: undefined,
  lever: undefined,
  openAvgPx: undefined,
  openTimeDate: undefined,
  subPos: undefined,
  closeTimeDate: undefined,
  closeAvgPx: undefined,
  pnl: undefined,
  pnlRatio: undefined,
  instType: undefined,
  margin: undefined,
  ccy: undefined,
  uniqueCode: undefined,
}
const data = reactive<PageData<SubPosHisForm, SubPosHisQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    instId: undefined,
    posSide: undefined,
    mgnMode: undefined,
    lever: undefined,
    openTimeDate: undefined,
    closeTimeDate: undefined,
    instType: undefined,
    uniqueCode: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
    instId: [
      { required: true, message: "产品ID不能为空", trigger: "blur" }
    ],
    subPosId: [
      { required: true, message: "带单仓位ID不能为空", trigger: "blur" }
    ],
    posSide: [
      { required: true, message: "持仓方向不能为空", trigger: "change" }
    ],
    mgnMode: [
      { required: true, message: "保证金模式不能为空", trigger: "change" }
    ],
    lever: [
      { required: true, message: "杠杆倍数不能为空", trigger: "blur" }
    ],
    openAvgPx: [
      { required: true, message: "开仓均价不能为空", trigger: "blur" }
    ],
    openTimeDate: [
      { required: true, message: "开仓时间不能为空", trigger: "blur" }
    ],
    closeTimeDate: [
      { required: true, message: "平仓时间不能为空", trigger: "blur" }
    ],
    closeAvgPx: [
      { required: true, message: "平仓均价不能为空", trigger: "blur" }
    ],
    instType: [
      { required: true, message: "产品类型不能为空", trigger: "change" }
    ],
    uniqueCode: [
      { required: true, message: "交易员唯一标识代码不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询交易员带单历史列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSubPosHis(queryParams.value);
  subPosHisList.value = res.rows;
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
  subPosHisFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SubPosHisVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加交易员带单历史";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SubPosHisVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getSubPosHis(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改交易员带单历史";
}

/** 提交按钮 */
const submitForm = () => {
  subPosHisFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateSubPosHis(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSubPosHis(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SubPosHisVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除交易员带单历史编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delSubPosHis(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('okx/subPosHis/export', {
    ...queryParams.value
  }, `subPosHis_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
