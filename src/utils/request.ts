//axios 二次封装：使用请求与相应拦截器
import userStore from '@/store/modules/user';
import axios from 'axios'
import { ElMessage } from "element-plus";
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import nprogress from 'nprogress'
//进度条样式
import 'nprogress/nprogress.css'
const request = axios.create({
    baseURL:import.meta.env.VITE_APP_BASE_API,
    // baseURL:'/api',
    timeout:5000 
})
//第二步添加 请求拦截器
request.interceptors.request.use((config)=>{
    //config配置对象，headers属性请求头，经常给服务器端携带公共参数
    let userStores= userStore()
    if(userStores.token){
      config.headers.token=userStores.token
    }
    //进度条开始
    nprogress.start()
    //返回对象
    return config
})

//响应拦截器

request.interceptors.response.use((response)=>{
    //成功的回调
    //简化数据
    //进度条结束
    nprogress.done()
    return response.data
},(error)=>{
    //失败的回调:处理http网络错误
    //定义一个变量：储存错误信息
    let message=''
    let status=error.response.status
    switch(status){
        case 401:
          message ='TOKEN过期'
          break
        case 403:
          message="无权访问"
          break
        case 404:
          message="请求地址错误"
          break
        case 500:
          message ="服务器出现了错误"
          break
        default:
          message="网络出现问题"
          break
      }
      //提示的错误信息
      ElMessage({
        type:'error',
        message
      })
      //这里需要返回一个失败的promise对象来终结
      return Promise.reject(error)
})

//对外暴露 
export default request