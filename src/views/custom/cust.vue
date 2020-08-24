
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
          <el-form-item label="所属行业" prop="industryType">
            <el-select
              v-model="queryParams.industryType"
              placeholder="客户列表所属行业"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in industryTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客户类型" prop="custType">
            <el-select
              v-model="queryParams.custType"
              placeholder="客户列表客户类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in custTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客户状态" prop="custStatus">
            <el-select
              v-model="queryParams.custStatus"
              placeholder="客户列表客户状态"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in custStatusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客户星级" prop="custLevel">
            <el-select
              v-model="queryParams.custLevel"
              placeholder="客户列表客户星级"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in custLevelOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客户来源" prop="origin">
            <el-select
              v-model="queryParams.origin"
              placeholder="客户列表客户来源"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in originOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['custom::add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['custom::edit']"
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
              v-permisaction="['custom::remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="List" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" /><el-table-column
            label="客户名称"
            align="center"
            prop="custName"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="助记名称"
            align="center"
            prop="simpleName"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="所属行业"
            align="center"
            prop="industryType"
            :formatter="industryTypeFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ industryTypeFormat(scope.row) }}
            </template>
          </el-table-column><el-table-column
            label="客户类型"
            align="center"
            prop="custType"
            :formatter="custTypeFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ custTypeFormat(scope.row) }}
            </template>
          </el-table-column><el-table-column
            label="客户状态"
            align="center"
            prop="custStatus"
            :formatter="custStatusFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ custStatusFormat(scope.row) }}
            </template>
          </el-table-column><el-table-column
            label="客户星级"
            align="center"
            prop="custLevel"
            :formatter="custLevelFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ custLevelFormat(scope.row) }}
            </template>
          </el-table-column><el-table-column
            label="客户来源"
            align="center"
            prop="origin"
            :formatter="originFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ originFormat(scope.row) }}
            </template>
          </el-table-column><el-table-column
            label="详细地址"
            align="center"
            prop="address"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['custom::edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-permisaction="['custom::remove']"
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

            <el-form-item label="系统编号" prop="sysCode">
              <el-input
                v-model="form.sysCode"
                placeholder="系统编号"
              />
            </el-form-item>
            <el-form-item label="客户名称" prop="custName">
              <el-input
                v-model="form.custName"
                placeholder="客户名称"
              />
            </el-form-item>
            <el-form-item label="助记名称" prop="simpleName">
              <el-input
                v-model="form.simpleName"
                placeholder="助记名称"
              />
            </el-form-item>
            <el-form-item label="所属行业" prop="industryType">
              <el-select
                v-model="form.industryType"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in industryTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户类型" prop="custType">
              <el-select
                v-model="form.custType"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in custTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户状态" prop="custStatus">
              <el-select
                v-model="form.custStatus"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in custStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户星级" prop="custLevel">
              <el-select
                v-model="form.custLevel"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in custLevelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户来源" prop="origin">
              <el-select
                v-model="form.origin"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in originOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所在地区" prop="location">
              <el-input
                v-model="form.location"
                placeholder="所在地区"
              />
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input
                v-model="form.address"
                placeholder="详细地址"
              />
            </el-form-item>
            <el-form-item label="企业规模" prop="enterpriseSize">
              <el-select
                v-model="form.enterpriseSize"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in enterpriseSizeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="上级客户" prop="parentCust">
              <el-input
                v-model="form.parentCust"
                placeholder="上级客户"
              />
            </el-form-item>
            <el-form-item label="备注信息" prop="remark">
              <el-input
                v-model="form.remark"
                placeholder="备注信息"
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
import { addCust, delCust, getCust, listCust, updateCust } from '@/api/custom/cust'

export default {
  name: 'RcmCust',
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
      List: [],
      industryTypeOptions: [], custTypeOptions: [], custStatusOptions: [], custLevelOptions: [], originOptions: [], enterpriseSizeOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        custName:
            undefined,
        industryType:
            undefined,
        custType:
            undefined,
        custStatus:
            undefined,
        custLevel:
            undefined,
        origin:
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
      industryType:
                [
                  { required: true, message: '所属行业不能为空', trigger: 'blur' }
                ],
      custType:
                [
                  { required: true, message: '客户类型不能为空', trigger: 'blur' }
                ],
      custStatus:
                [
                  { required: true, message: '客户状态不能为空', trigger: 'blur' }
                ],
      custLevel:
                [
                  { required: true, message: '客户星级不能为空', trigger: 'blur' }
                ],
      origin:
                [
                  { required: true, message: '客户来源不能为空', trigger: 'blur' }
                ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('rcm_leads_status').then(response => {
      this.industryTypeOptions = response.data
    })

    this.getDicts('rcm_cust_type').then(response => {
      this.custTypeOptions = response.data
    })

    this.getDicts('rcm_cust_status').then(response => {
      this.custStatusOptions = response.data
    })

    this.getDicts('rcm_cust_level').then(response => {
      this.custLevelOptions = response.data
    })

    this.getDicts('rcm_information_origin').then(response => {
      this.originOptions = response.data
    })

    this.getDicts('rcm_enterprise_size').then(response => {
      this.enterpriseSizeOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listCust(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.List = response.data.list
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

        id: undefined,
        sysCode: undefined,
        custName: undefined,
        simpleName: undefined,
        industryType: undefined,
        custType: undefined,
        custStatus: undefined,
        custLevel: undefined,
        origin: undefined,
        location: undefined,
        address: undefined,
        enterpriseSize: undefined,
        parentCust: undefined,
        remark: undefined
      }
      this.resetForm('form')
    },
    industryTypeFormat(row) {
      return this.selectDictLabel(this.industryTypeOptions, row.industryType)
    },
    custTypeFormat(row) {
      return this.selectDictLabel(this.custTypeOptions, row.custType)
    },
    custStatusFormat(row) {
      return this.selectDictLabel(this.custStatusOptions, row.custStatus)
    },
    custLevelFormat(row) {
      return this.selectDictLabel(this.custLevelOptions, row.custLevel)
    },
    originFormat(row) {
      return this.selectDictLabel(this.originOptions, row.origin)
    },
    enterpriseSizeFormat(row) {
      return this.selectDictLabel(this.enterpriseSizeOptions, row.enterpriseSize)
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
      this.title = '添加客户列表'
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
      getCust(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改客户列表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateCust(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addCust(this.form).then(response => {
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
        return delCust(Ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }
  }
}
</script>
