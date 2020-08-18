<template>
  <el-form ref="genInfoForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="tplCategory">
          <span slot="label">生成模板</span>
          <el-select v-model="info.tplCategory">
            <el-option label="单表（增删改查）" value="crud" />
            <!-- <el-option label="树表（增删改查）" value="tree" /> -->
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="parentMenuId">
          <span slot="label">上级菜单</span>
          <treeselect
            v-model="info.parentMenuId"
            :options="menuOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
            :max-height="120"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="packageName">
          <span slot="label">
            生成包路径
            <el-tooltip content="文件夹路径名，例如 user" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input v-model="info.packageName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="moduleName">
          <span slot="label">
            生成模块名
            <el-tooltip content="可理解为子系统名，例如 system" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input v-model="info.moduleName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="businessName">
          <span slot="label">
            生成业务名
            <el-tooltip content="可理解为功能英文名，例如 user" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input v-model="info.businessName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="functionName">
          <span slot="label">
            生成功能名
            <el-tooltip content="用作类描述，例如 用户" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input v-model="info.functionName" />
        </el-form-item>
      </el-col>

    </el-row>

    <el-row v-show="info.tplCategory == 'tree'">
      <h4 class="form-header">其他信息</h4>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            树编码字段
            <el-tooltip content="树显示的编码字段名， 如：dept_id" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-select v-model="info.treeCode" placeholder="请选择">
            <el-option
              v-for="column in info.columns"
              :key="column.columnName"
              :label="column.columnName + '：' + column.columnComment"
              :value="column.columnName"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            树父编码字段
            <el-tooltip content="树显示的父编码字段名， 如：parent_Id" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-select v-model="info.treeParentCode" placeholder="请选择">
            <el-option
              v-for="column in info.columns"
              :key="column.columnName"
              :label="column.columnName + '：' + column.columnComment"
              :value="column.columnName"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            树名称字段
            <el-tooltip content="树节点的显示名称字段名， 如：dept_name" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-select v-model="info.treeName" placeholder="请选择">
            <el-option
              v-for="column in info.columns"
              :key="column.columnName"
              :label="column.columnName + '：' + column.columnComment"
              :value="column.columnName"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import {
  listMenu
} from '@/api/system/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'BasicInfoForm',
  components: {
    Treeselect
  },
  props: {
    info: {
      type: Object,
      default: null,
      parentMenuId: 0
    }
  },
  data() {
    return {
      // 菜单树选项
      menuOptions: [],
      rules: {
        tplCategory: [{
          required: true,
          message: '请选择生成模板',
          trigger: 'blur'
        }],
        packageName: [{
          required: true,
          message: '请输入生成包路径',
          trigger: 'blur'
        }],
        moduleName: [{
          required: true,
          message: '请输入生成模块名',
          trigger: 'blur'
        }],
        businessName: [{
          required: true,
          message: '请输入生成业务名',
          trigger: 'blur'
        }],
        functionName: [{
          required: true,
          message: '请输入生成功能名',
          trigger: 'blur'
        }],
        parentMenuId: [{
          required: true,
          message: '请选择上级菜单',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getTreeselect()
  },
  methods: {
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.menuId,
        label: node.title,
        children: node.children
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = []
        const menu = {
          menuId: 0,
          title: '主类目',
          children: []
        }
        menu.children = response.data
        this.menuOptions.push(menu)
      })
    }
  }
}
</script>
