import axios from 'axios'
import router from '../router'
import { ElMessage } from 'element-plus'
//创建axios实例对象
const request = axios.create({
  // baseURL: 'http://127.0.0.1:4523/m1/7412626-7145973-default',
  baseURL: '/api',
  timeout: 5000
})

// 添加请求token
request.interceptors.request.use(//请求拦截器
  (config) => { //成功回调
    const logindata = JSON.parse(localStorage.getItem('loginToken'));
    if(logindata && logindata.token){
      config.headers.token = logindata.token;
    }
    return config;
  },
  (error) => { //失败回调
    return Promise.reject(error)
  }
)

//axios的响应 response 拦截器
request.interceptors.response.use(
  (response) => { //成功回调
    return response.data
  },
  (error) => { //失败回调
    // 401跳转
    if(error.response.status === 401){
      // 提示信息
      ElMessage.error('重新登录一次吧');
      // 跳转登录页
      router.push('/login');
    }
    return Promise.reject(error)
  }
)

export default request/*解释: 导出request对象，在main.js中引入*/