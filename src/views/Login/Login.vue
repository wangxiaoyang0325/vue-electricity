<template>
  <div class="login">
        <el-form ref="form" :model="form" class="container" :rules="rules">
          <el-form-item>
            <div class="avatar">
              <img src="../../assets/img/avatar.jpg" alt="">
            </div>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="账户" prefix-icon="myicon myicon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="密码" prefix-icon="myicon myicon-key" type="password" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
</template>

<script>
import {checkUser} from '@/api'
export default {
  data(){
      return{
        form: {
          username: '',
          password: ''
        },
         rules: {
          username: [
            { required: true, message: '用户名必填', trigger: 'blur' },
            { min: 3, max: 8, message: '用户名长度在 3 到 8 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码必填', trigger: 'blur' }
          ]
        }
      }
  },
  methods:{
    login:function(){
      this.$refs.form.validate(valide=>{
        if(valide){
          checkUser(this.form).then(res =>{
            if(res.meta.status ===200){
              //设置唯一标识：
              localStorage.setItem('token',res.data.token)
              localStorage.setItem('username',res.data.username)
              this.$router.push({name:'User'})
            }else{
              this.message({
                type:'error',
                message:res.meta.msg
              })
            }
          })
        }else{
          //验证失败：
          console.log('验证失败')
        }
      })
    }
  }
}
</script>

<style scoped>
  .login {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #2f4050;
  }
  .login .container {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 0px 40px 15px 40px;
      margin: 200px auto;
      background: white;
  }
  .login .container .avatar {
        position: relative;
        left: 50%;
        width: 120px;
        height: 120px;
        margin-left: -60px;
        margin-top: -60px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 10px solid #fff;
        box-shadow: 0 1px 5px #ccc;
        overflow: hidden;
  }
  .login .container .login-btn { width: 100%; }
  </style>
