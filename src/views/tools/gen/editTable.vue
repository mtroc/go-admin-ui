<template>
  <el-card>
    <!-- <el-tabs v-model="activeName"> -->
    <!-- <el-tab-pane label="基本信息" name="basic"> -->

    <!-- </el-tab-pane> -->
    <!-- <el-tab-pane label="字段信息" name="cloum"> -->
    <el-card shadow="never">
      <div slot="header">
        <span>字段配置：{{ info.tableName }}</span>
      </div>
      <el-table :data="columns" :max-height="tableHeight" size="small" style="width: 100%">
        <el-table-column fixed label="序号" type="index" width="50" />
        <el-table-column fixed label="字段列名" prop="columnName" width="80" :show-overflow-tooltip="true" />
        <el-table-column fixed label="字段描述" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.columnComment" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="物理类型" prop="columnType" width="80" :show-overflow-tooltip="true" />
        <el-table-column label="go类型" width="80">
          <template slot-scope="scope">
            <el-select v-model="scope.row.goType" size="mini">
              <el-option label="int64" value="int64" />
              <el-option label="string" value="string" />
              <!-- <el-option label="int" value="int" />
                <el-option label="bool" value="bool" /> -->
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="go属性" width="110">
          <template slot-scope="scope">
            <el-input v-model="scope.row.goField" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="json属性" width="110">
          <template slot-scope="scope">
            <el-input v-model="scope.row.jsonField" size="mini" />
          </template>
        </el-table-column>

        <el-table-column label="插入" width="50">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isInsert" true-label="1" false-label="0" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="编辑" width="50">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isEdit" true-label="1" false-label="0" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="列表" width="50">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isList" true-label="1" false-label="0" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="查询" width="50">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isQuery" true-label="1" false-label="0" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="查询方式" width="80">
          <template slot-scope="scope">
            <el-select v-model="scope.row.queryType" size="mini">
              <el-option label="=" value="EQ" />
              <el-option label="!=" value="NE" />
              <el-option label=">" value="GT" />
              <el-option label=">=" value="GTE" />
              <el-option label="<" value="LT" />
              <el-option label="<=" value="LTE" />
              <el-option label="LIKE" value="LIKE" />
              <!-- <el-option label="BETWEEN" value="BETWEEN" /> -->
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="必填" width="50">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isRequired" true-label="1" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="显示类型" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.htmlType" size="mini">
              <el-option label="文本框" value="input" />
              <el-option label="下拉框" value="select" />
              <el-option label="单选框" value="radio" />
              <!-- <el-option label="复选框" value="checkbox" />
                <el-option label="文本域" value="textarea" />
                <el-option label="日期控件" value="datetime" /> -->
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="字典类型" width="140">
          <template slot-scope="scope">
            <el-select v-model="scope.row.dictType" clearable filterable placeholder="请选择" size="mini">
              <el-option v-for="dict in dictOptions" :key="dict.dictType" :label="dict.dictName" :value="dict.dictType">
                <span style="float: left">{{ dict.dictName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.dictType }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- </el-tab-pane> -->
    <!-- <el-tab-pane label="生成信息" name="genInfo"> -->
    <!-- <gen-info-form ref="genInfo" :info="info" /> -->
    <!-- </el-tab-pane> -->
    <!-- </el-tabs> -->

    <el-card shadow="never">
      <div slot="header">
        <span>生成配置</span>
      </div>
      <gen-info-form ref="genInfo" :info="info" />
      <basic-info-form ref="basicInfo" :info="info" />
    </el-card>
    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-100px;margin-top:10px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import {
  getGenTable,
  updateGenTable
} from '@/api/tools/gen'
import {
  optionselect as getDictOptionselect
} from '@/api/system/dict/type'
import basicInfoForm from './basicInfoForm'
import genInfoForm from './genInfoForm'
export default {
  name: 'GenEdit',
  components: {
    basicInfoForm,
    genInfoForm
  },
  data() {
    return {
      // 选中选项卡的 name
      activeName: 'cloum',
      // 表格的高度
      tableHeight: document.documentElement.scrollHeight - 245 + 'px',
      // 表列信息
      columns: [],
      // 字典信息
      dictOptions: [],
      // 表详细信息
      info: {}
    }
  },
  beforeCreate() {
    const {
      tableId
    } = this.$route.query
    if (tableId) {
      // 获取表详细信息
      getGenTable(tableId).then(res => {
        this.columns = res.data.rows
        this.info = res.data.info
      })
      /** 查询字典下拉列表 */
      getDictOptionselect().then(response => {
        this.dictOptions = response.data
      })
    }
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      const basicForm = this.$refs.basicInfo.$refs.basicInfoForm
      const genForm = this.$refs.genInfo.$refs.genInfoForm
      Promise.all([basicForm, genForm].map(this.getFormPromise)).then(res => {
        const validateResult = res.every(item => !!item)
        if (validateResult) {
          const genTable = Object.assign({}, basicForm.model, genForm.model)
          console.log(this.columns)
          genTable.columns = this.columns
          genTable.params = {
            treeCode: genTable.treeCode,
            treeName: genTable.treeName,
            treeParentCode: genTable.treeParentCode
          }
          updateGenTable(genTable).then(res => {
            this.msgSuccess(res.msg)
            if (res.code === 200) {
              this.close()
            }
          })
        } else {
          this.msgError('表单校验未通过，请重新检查提交内容')
        }
      })
    },
    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res)
        })
      })
    },
    /** 关闭按钮 */
    close() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: '/tools/gen',
        query: {
          t: Date.now()
        }
      })
    }
  }
}
</script>
