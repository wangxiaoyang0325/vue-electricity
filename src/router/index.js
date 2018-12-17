import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login/Login'
import index from '@/views/Index/Index'
import User from '@/views/User/User'
import Auth from '@/views/RBAC/Auth'
import Role from '@/views/RBAC/Role'
import Category from '@/views/Goods/Category'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children:[
        {
          path: '/User',
          name: 'User',
          component: User
        },
        {
          path: '/auth',
          name: 'Auth',
          component: Auth
        },
        {
          path: '/role',
          name: 'Role',
          component: Role
        },
        {
          path: '/category',
          name: 'Category',
          component: Category
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
  ]
})
