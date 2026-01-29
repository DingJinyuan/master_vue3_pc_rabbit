//axios 基础封装
import axios from 'axios';
const httpInstance=axios.create({
    //配置基地址
    baseURL: 'https://pcapi-xiaotuxian-front-devtest.itheima.net',
    //配置超时时间
    timeout:5000
})
// axios请求拦截器 --请求发送到服务器之前执行的逻辑，可对请求参数、请求头做统一处理
httpInstance.interceptors.request.use(config => {
  return config
}, e => Promise.reject(e))

// axios响应式拦截器 --服务器返回响应之后执行的逻辑，可对响应数据、错误做统一处理。
httpInstance.interceptors.response.use(res => res.data, e => {
  return Promise.reject(e)
})

export default httpInstance