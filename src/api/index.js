//导入axios模块：
import axios from 'axios'

//定义接口网址：
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    //获取token，判断是否存在；
    var token = localStorage.getItem('token')
    if(token){
        config.headers['Authorization'] = token
    }
    return config
}, error => {
    loadinginstace.close()
    Message.error({
        message: '加载超时'
    })
    return Promise.reject(error)
})
//登录验证：
export const checkUser = params => {
    return axios.post('login',params).then(res => res.data)
}

//用户列表展示：
export const getUserList = params => {
    return axios.get('users',params).then(res => res.data)
}

//用户列表展示：
export const changeUserState = params => {
    return axios.put(`users/${params.uid}/state/${params.type}`).then(res => res.data)
}
//添加用户
export const addUser = params => {
    return axios.post('users',params).then(res => res.data)
}

//删除用户
export const delUser = id => {
    return axios.delete(`users/${id}`).then(res => res.data)
}

//权限列表展示：
export const getAuthList = type => {
    return axios.get(`rights/${type}`).then(res => res.data)
}

//角色列表展示：
export const getRoleList = () => {
    return axios.get('roles').then(res => res.data)
}
//添加用户角色：
export const grantRole = (id,rid) => {
    return axios.put(`users/${id}/role`,{rid:rid}).then(res => res.data)
}

//修改用户信息：
export const editUser = (id,params) => {
    return axios.put(`users/${id}`,params).then(res => res.data)
}

//添加角色：
export const addRole = (params) => {
    return axios.post('roles',params).then(res => res.data)
}

//删除角色：
export const delRole = (id) => {
    return axios.delete(`roles/${id}`).then(res => res.data)
}

//给角色分配权限：
export const grantUserAuth = (roleId,rids) => {
    return axios.post(`roles/${roleId}/rights`,rids).then(res => res.data)
}

//商品分类列表：
export const getCategoryList = (typenum,pagenum,pagesize) => {
    return axios.get('categories',{params:{typenum:typenum,pagenum:pagenum,pagesize:pagesize}}).then(res => res.data)
}

//添加商品分类：
export const addCategory = params => {
    return axios.post('categories',params).then(res => res.data)
}

//菜单导航信息：
export const getMenus = () => {
    return axios.get('menus').then(res => res.data)
}