<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="账号" prop="username">
            <el-input v-model="queryParams.username" placeholder="请输入账号" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="queryParams.nickName" placeholder="请输入昵称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="手机" prop="tel">
            <el-input v-model="queryParams.tel" placeholder="请输入手机" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="钉钉号" prop="dingTel">
            <el-input v-model="queryParams.dingTel" placeholder="请输入钉钉号" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="QQ" prop="qq">
            <el-input v-model="queryParams.qq" placeholder="请输入QQ" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable>
              <el-option
                v-for="dict in sys_user_sex"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上次登录时间" prop="lastLoginTime">
            <el-date-picker clearable
              v-model="queryParams.lastLoginTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择上次登录时间"
            />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['okx:clientUser:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['okx:clientUser:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['okx:clientUser:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['okx:clientUser:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="clientUserList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户ID" align="center" prop="id" v-if="true" />
        <el-table-column label="账号" align="center" prop="username" />
        <el-table-column label="昵称" align="center" prop="nickName" />
        <el-table-column label="头像" align="center" prop="avatar" width="100">
          <template #default="scope">
            <image-preview :src="scope.row.avatar" :width="50" :height="50"/>
          </template>
        </el-table-column>
        <el-table-column label="手机" align="center" prop="tel" />
        <el-table-column label="钉钉号" align="center" prop="dingTel" />
        <el-table-column label="QQ" align="center" prop="qq" />
        <el-table-column label="性别" align="center" prop="sex">
          <template #default="scope">
            <dict-tag :options="sys_user_sex" :value="scope.row.sex"/>
          </template>
        </el-table-column>
        <el-table-column label="上次登录时间" align="center" prop="lastLoginTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastLoginTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['okx:clientUser:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['okx:clientUser:remove']"></el-button>
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
    <!-- 添加或修改系统用户信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="clientUserFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <image-upload v-model="form.avatar"/>
        </el-form-item>
        <el-form-item label="手机" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入手机" />
        </el-form-item>
        <el-form-item label="钉钉号" prop="dingTel">
          <el-input v-model="form.dingTel" placeholder="请输入钉钉号" />
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="form.qq" placeholder="请输入QQ" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option
                v-for="dict in sys_user_sex"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="form.introduction" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="上次登录时间" prop="lastLoginTime">
          <el-date-picker clearable
            v-model="form.lastLoginTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择上次登录时间">
          </el-date-picker>
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

<script setup name="ClientUser" lang="ts">
import { listClientUser, getClientUser, delClientUser, addClientUser, updateClientUser } from '@/api/okx/clientUser';
import { ClientUserVO, ClientUserQuery, ClientUserForm } from '@/api/okx/clientUser/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_user_sex } = toRefs<any>(proxy?.useDict('sys_user_sex'));

const clientUserList = ref<ClientUserVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const clientUserFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ClientUserForm = {
  id: undefined,
  username: undefined,
  password: undefined,
  nickName: undefined,
  avatar: undefined,
  tel: undefined,
  dingTel: undefined,
  qq: undefined,
  sex: undefined,
  introduction: undefined,
  lastLoginTime: undefined,
}
const data = reactive<PageData<ClientUserForm, ClientUserQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    username: undefined,
    nickName: undefined,
    tel: undefined,
    dingTel: undefined,
    qq: undefined,
    sex: undefined,
    lastLoginTime: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "用户ID不能为空", trigger: "blur" }
    ],
    username: [
      { required: true, message: "账号不能为空", trigger: "blur" }
    ],
    password: [
      { required: true, message: "密码不能为空", trigger: "blur" }
    ],
    nickName: [
      { required: true, message: "昵称不能为空", trigger: "blur" }
    ],
    avatar: [
      { required: true, message: "头像不能为空", trigger: "blur" }
    ],
    tel: [
      { required: true, message: "手机不能为空", trigger: "blur" }
    ],
    dingTel: [
      { required: true, message: "钉钉号不能为空", trigger: "blur" }
    ],
    qq: [
      { required: true, message: "QQ不能为空", trigger: "blur" }
    ],
    sex: [
      { required: true, message: "性别不能为空", trigger: "change" }
    ],
    introduction: [
      { required: true, message: "简介不能为空", trigger: "blur" }
    ],
    lastLoginTime: [
      { required: true, message: "上次登录时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询系统用户信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listClientUser(queryParams.value);
  clientUserList.value = res.rows;
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
  clientUserFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: ClientUserVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加系统用户信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: ClientUserVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getClientUser(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改系统用户信息";
}

/** 提交按钮 */
const submitForm = () => {
  clientUserFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateClientUser(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addClientUser(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ClientUserVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除系统用户信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delClientUser(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('okx/clientUser/export', {
    ...queryParams.value
  }, `clientUser_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
