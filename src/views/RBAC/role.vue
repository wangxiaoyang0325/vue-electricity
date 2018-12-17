<template>
  <div class="roles">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      </el-col>
    </el-row>
    <el-button type="primary" plain @click="showRole">添加角色</el-button>

    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
        <el-form :model="addForm" label-width="80px" :rules="rules" ref="addUserForm">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserSubmit('addUserForm')">确 定</el-button>
        </div>
      </el-dialog>

    <el-table
      border
      class="mt-15"
      :data="roleList"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 第一列 -->
          <el-row v-for="one in scope.row.children" :key="one.id">
            <el-col :span="4">
              <el-tag closable @close="deleteRight(scope.row, '编号')">{{one.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 第二列 -->
              <el-row v-for="two in one.children" :key="two.id">
                <el-col :span="4">
                  <el-tag closable type="success" @close="deleteRight(scope.row, '编号')">{{two.authName}}</el-tag>
                  <i class="el-icon-arrow-right" ></i>
                </el-col>
                <el-col :span="20">
                  <!-- 第三列 -->
                  <el-tag v-for="three in two.children" :key="three.id" @close="deleteRight(scope.row, '编号')" closable type="warning">{{three.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>


          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">该角色没有分配权限，请前往分配！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName"
        width="165px">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="roleDesc"
        width="130px">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit"></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="showDeleteDialog(scope.row)"></el-button>
          <el-button size="mini" type="warning" plain icon="el-icon-check" title="授权角色" @click="showDialog(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="授权角色" :visible.sync="dialogFormVisible">
      <div class="tree-container">
        <el-tree
          :data="authList"
          show-checkbox
          ref="tree"
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="selectedAuths"
          :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAssignAuth">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getRoleList,getAuthList,addRole,delRole,grantUserAuth} from '@/api'
export default {
    mounted(){
        //显示所有的权限：
        getAuthList('tree')
        .then(res=>{
            this.authList = res.data
        })
        //显示角色指定权限
        this.initList()
    },
    data () {
        return {
            rules: {
              roleName: [
                { required: true, message: '请输入角色名', trigger: 'blur' }
              ],
              roleDesc: [
                { required: true, message: '请简单描述角色信息', trigger: 'blur' }
              ]
            },
            //添加角色信息：
            //###添加数据
            addDialogFormVisible : false,
            addForm: {
              roleName: '',
              roleDesc: '',
            },
            roleList: [
                {"id": 1, "roleName": "超级管理员", "roleDesc": "小心权限很大", "children": []},
                {"id": 2, "roleName": "主管", "roleDesc": "技术负责人", "children": []},
                {"id": 3, "roleName": "财务", "roleDesc": "财务", "children": []}
            ], 
            dialogFormVisible: false,
            authList:  [
                {
                "id":1,"authName":"订单管理","path":"goods","pid": 0,
                "children": [
                    {
                    "id": 2,"authName": "订单列表","path": "goods","pid": 101,"children": [
                        {"id": 3,"authName": "添加订单","path": "goods","pid": 101,"children":[]},
                        {"id": 4,"authName": "取消订单","path": "goods","pid": 101,"children":[]}
                    ]
                    }
                ]
                },
                {
                "id":5,"authName":"用户管理","path":"goods","pid": 0,
                "children": [
                    {
                    "id": 6,"authName": "会员列表","path": "goods","pid": 101,"children": [
                        {"id": 7,"authName": "添加会员","path": "goods","pid": 101,"children":[]},
                        {"id": 8,"authName": "删除会员","path": "goods","pid": 101,"children":[]}
                    ]
                    }
                ]
                }
            ],
            //
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            selectedAuths: [], //保存默认选中的权限id
            currentRole: {}            //保存点击的角色
        }
    },
    methods: {
      showDeleteDialog(row){
          this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
            delRole(row.id).then(res=>{
            if(res.meta.status === 200){
              this.$message({
                message: res.meta.msg,
                type: 'success'
              });
              this.initList()
            }
          })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        },
      //添加角色
      addUserSubmit(){
        this.$refs.addUserForm.validate(valide=>{
          if(valide){
            addRole(this.addForm).then(res=>{
              if(res.meta.status === 200){
                  //提示添加成功：
                  this.$message({
                    type:'success',
                    message:res.meta.msg
                  })
              }
              //关闭添加框：
              this.addDialogFormVisible = false
              //获取最新的数据：
              this.initList()
            })
          }
        })
      },
      //显示添加角色框
        showRole(){
          this.addDialogFormVisible = true
        },
        initList () {
            getRoleList().then(res=>{
            this.roleList = res.data
        })
        },
        deleteRight (row, authId) {
        },
        //显示权限框
        showDialog (row) {
          this.dialogFormVisible = true
          getAuthList('tree').then(res=>{
            this.authList = res.data
          })
          //设置默认选中权限：
          this.selectedAuths =[]
          row.children.forEach(first => {
            if(first.children && first.children.length != 0){
              first.children.forEach(two=>{
                if(two.children && two.children.length != 0){
                  two.children.forEach(three=>{
                    this.selectedAuths.push(three.id)
                  })
                }
              })
            }
          });
          this.currentRole = row
        },
        // 提交授权
        submitAssignAuth () {
          var roleId = this.currentRole.id
          var rids	= this.$refs.tree.getCheckedKeys().join(',')
          grantUserAuth(roleId,{rids:rids}).then(res=>{
            console.log(res)
            if(res.meta.status === 200){
              this.$message({
                message: res.meta.msg,
                type: 'success'
              });
              //关闭对话框：
              this.dialogFormVisible = false
              //重新加载文件
              this.initList()
            }
          })
        }
    }
}
</script>
<style scoped>
.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
.tree-container {
  height: 300px;
  overflow: auto;
}
</style>