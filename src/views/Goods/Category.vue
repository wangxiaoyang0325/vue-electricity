<template>
  <div class="category">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-button type="success" plain @click="addCategory">添加分类</el-button>

      </el-col>
    </el-row>

    <!-- 添加用户对话框 -->
      <el-dialog title="添加分类" :visible.sync="addDialogFormVisible">
        <el-form :model="addForm" label-width="80px" :rules="rules" ref="addcateForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="父类名称">
            <el-cascader
                :options="options"
                :props = "props"
                v-model="selectedOptions"
                @change="handleChange">
            </el-cascader>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserSubmit('addUserForm')">确 定</el-button>
        </div>
      </el-dialog>

    <tree-grid
      :treeStructure="true"
      :columns="columns"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data-source="dataSource"
      @deleteCate="deleteCategory"
      @editCate="editCategory"
    >
    </tree-grid>

    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import TreeGrid from '@/components/TreeGrid/TreeGrid'
import {getCategoryList,addCategory} from '@/api'
export default {
  data () {
    return {
       options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }],
        selectedOptions: [],
        addForm:{
          cat_pid:0,
          cat_name:'',
          cat_level:0
        },
        props:{
          value: 'cat_id',
          label: 'cat_name'
        },
        rules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ],
        },
        addDialogFormVisible:false,
      //分页参数
      total: 1000,
      pagenum: 1,
      pagesize: 10,
      loading:false,
      //TreeGrid
      dataSource: [
        {
          "cat_id": 1,
          "cat_name": "AAA",
          "cat_pid": 0,
          "cat_level": 0,
          "cat_deleted": false,
          "children": [
            {"cat_id": 3, "cat_name": "B1","cat_pid": 1,"cat_level": 1, "cat_deleted": false, "children": [] },
            {"cat_id": 3, "cat_name": "B2","cat_pid": 1,"cat_level": 1, "cat_deleted": false, "children": [] },
          ]
        },
        {
          "cat_id": 1,
          "cat_name": "大家电",
          "cat_pid": 0,
          "cat_level": 0,
          "cat_deleted": false,
          "children": [
            {
                "cat_id": 3,
                "cat_name": "电视",
                "cat_pid": 1,
                "cat_level": 1,
                "cat_deleted": false,
                "children": [
                    {"cat_id": 7,"cat_name": "海信","cat_pid": 3,"cat_level": 2,"cat_deleted": false}, 
                    {"cat_id": 8,"cat_name": "夏普","cat_pid": 3,"cat_level": 2,"cat_deleted": false}
                ]
            }
          ]
        }
      ],
      columns: [{
        text: '分类名称',
        dataIndex: 'cat_name',
        width: ''
      }, {
        text: '是否有效',
        dataIndex: 'cat_deleted',
        width: ''
      }, {
        text: '排序',
        dataIndex: 'cat_level',
        width: ''
      }]
    }
  },
  //声明页面组件
  components: {
    TreeGrid
  },
  //加载页面时候触发
  created () {
    this.initList()
  },
  methods: {
    //添加分类：
    addUserSubmit(){
      
      this.$refs.addcateForm.validate(valide=>{
        if(valide){
          if(this.selectedOptions.length ===0){
            this.addForm.cat_pid = 0
            this.addForm.cat_level =0
          }else if(this.selectedOptions.length ===1){
            this.addForm.cat_pid = 1
            this.addForm.cat_level =this.selectedOptions[0]
          }else if(this.selectedOptions.length ===2){
            this.addForm.cat_pid = 2
            this.addForm.cat_level =this.selectedOptions[1]
          }
          addCategory(this.addForm).then(res=>{
            if(res.meta.status === 201){
              //console.log(res)
              this.$message({
                type:'success',
                message:res.meta.msg
              })
              this.addDialogFormVisible =  false
              this.initList()
              }else{
                this.$message.error(res.meta.msg)
              }
          })
        }
      })
    },
    //显示添加框：
    addCategory(){
      //alert(111)
      this.addDialogFormVisible =  true
      getCategoryList(2,1,1000).then(res=>{
        console.log(res)
        if(res.meta.status === 200){
          this.options = res.data.result
        }
      })

    },
    handleChange(value) {
        console.log(value);
    },
    //初始化表格数据
    initList () {
      this.loading =true
      //console.log(this.pagenum,this.pagesize)
      getCategoryList(3,this.pagenum,this.pagesize).then(res=>{
        //console.log(res)
        if(res.meta.status === 200){
          this.dataSource = res.data.result
          this.total = res.data.total
          this.loading =false
        }
      })
    },
    //###分页
    handleSizeChange (val) {
      //console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      //console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initList()
    },
    //TreeGrid
    deleteCategory (cid) {
      console.log(cid)
    },
    editCategory (cid) {
      console.log(cid)
    }
  }
}
</script>
<style scoped>
.page {
  padding: 5px 0;
  background-color: #D3DCE6;
}
</style>