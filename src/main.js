// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from './router'
import "@/assets/css/index.css"
//激活
Vue.use(ElementUI)
Vue.config.productionTip = false

//设置导航守卫：
router.beforeEach((to, from, next) => {
  //获取唯一标识：
  var token = localStorage.getItem('token')
  
  //判断跳转页面是否是login 并且是否存在唯一标识
  if(to.path !== '/login' && !token){
    next({path:'/login'})
  }else{
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
