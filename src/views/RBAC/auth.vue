<template>
  <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="#id"
      width="180">
    </el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="path"
      label="路径">
    </el-table-column>
    <el-table-column
      prop="level"
      label="层级">
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
    import {getAuthList} from '@/api'
    export default {
        mounted(){
            getAuthList('list').then(res=>{
                this.tableData= res.data
               //console.log(this.tableData)
               this.loading = false
            })
        },
        data() {
        return {
            tableData: [{
            id: 111,
            authName: '商品',
            path: 'Goods',
            level:1
            }],
            loading: true
        }
        }
    }
</script>

<style>

</style>
