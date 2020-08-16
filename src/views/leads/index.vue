
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="客户名称" prop="custName">
            <el-input
              v-model="queryParams.custName"
              placeholder="请输入客户名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="线索来源" prop="leadsOrigin">
            <el-input
              v-model="queryParams.leadsOrigin"
              placeholder="请输入线索来源"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="线索状态" prop="leadsState">
            <el-input
              v-model="queryParams.leadsState"
              placeholder="请输入线索状态"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['leads:leads:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['leads:leads:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['leads:leads:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="leadsList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" /><el-table-column
            label="联系人姓名"
            align="center"
            prop="contactsName"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="手机号码"
            align="center"
            prop="contactsPhone"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="客户名称"
            align="center"
            prop="custName"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="线索状态"
            align="center"
            prop="leadsState"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['leads:leads:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-permisaction="['leads:leads:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">

            <el-form-item label="传真号码" prop="conatctsFax">
              <el-input
                v-model="form.conatctsFax"
                placeholder="传真号码"
              />
            </el-form-item>
            <el-form-item label="电子邮箱" prop="contactsEmail">
              <el-input
                v-model="form.contactsEmail"
                placeholder="电子邮箱"
              />
            </el-form-item>
            <el-form-item label="联系人姓名" prop="contactsName">
              <el-input
                v-model="form.contactsName"
                placeholder="联系人姓名"
              />
            </el-form-item>
            <el-form-item label="手机号码" prop="contactsPhone">
              <el-input
                v-model="form.contactsPhone"
                placeholder="手机号码"
              />
            </el-form-item>
            <el-form-item label="部门职务" prop="contactsPost">
              <el-input
                v-model="form.contactsPost"
                placeholder="部门职务"
              />
            </el-form-item>
            <el-form-item label="QQ号码" prop="contactsQq">
              <el-input
                v-model="form.contactsQq"
                placeholder="QQ号码"
              />
            </el-form-item>
            <el-form-item label="角色" prop="contactsRole">
              <el-select
                v-model="form.contactsRole"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in contactsRoleOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="尊称" prop="contactsSex">
              <el-select
                v-model="form.contactsSex"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in contactsSexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="固定电话" prop="contactsTel">
              <el-input
                v-model="form.contactsTel"
                placeholder="固定电话"
              />
            </el-form-item>
            <el-form-item label="微信账号" prop="contactsWeixin">
              <el-input
                v-model="form.contactsWeixin"
                placeholder="微信账号"
              />
            </el-form-item>
            <el-form-item label="客户名称" prop="custName">
              <el-input
                v-model="form.custName"
                placeholder="客户名称"
              />
            </el-form-item>
            <el-form-item label="线索来源" prop="leadsOrigin">
              <el-select
                v-model="form.leadsOrigin"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in leadsOriginOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="线索状态" prop="leadsState">
              <el-select
                v-model="form.leadsState"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in leadsStateOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="系统编号" prop="sysCode">
              <el-input
                v-model="form.sysCode"
                placeholder="系统编号"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { addLeads, delLeads, getLeads, listLeads, updateLeads } from '@/api/leads'

export default {
  name: 'Config',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      leadsList: [],
      contactsRoleOptions: [], contactsSexOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        custName:
            undefined,
        leadsOrigin:
            undefined,
        leadsState:
            undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: { custName:
                [
                  { required: true, message: '客户名称不能为空', trigger: 'blur' }
                ],
      leadsOrigin:
                [
                  { required: true, message: '线索来源不能为空', trigger: 'blur' }
                ],
      leadsState:
                [
                  { required: true, message: '线索状态不能为空', trigger: 'blur' }
                ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('rcm_contacts_role').then(response => {
      this.contactsRoleOptions = response.data
    })

    this.getDicts('sys_user_sex').then(response => {
      this.contactsSexOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listLeads(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.leadsList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {

        conatctsFax: undefined,
        contactsEmail: undefined,
        contactsName: undefined,
        contactsPhone: undefined,
        contactsPost: undefined,
        contactsQq: undefined,
        contactsRole: undefined,
        contactsSex: undefined,
        contactsTel: undefined,
        contactsWeixin: undefined,
        custName: undefined,
        id: undefined,
        leadsOrigin: undefined,
        leadsState: undefined,
        sysCode: undefined
      }
      this.resetForm('form')
    },
    contactsRoleFormat(row) {
      return this.selectDictLabel(this.contactsRoleOptions, row.contactsRole)
    },
    contactsSexFormat(row) {
      return this.selectDictLabel(this.contactsSexOptions, row.contactsSex)
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加销售线索表'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id =
                row.id || this.ids
      getLeads(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改销售线索表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateLeads(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addLeads(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const Ids = row.id || this.ids
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delLeads(Ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }
  }
}
</script>
