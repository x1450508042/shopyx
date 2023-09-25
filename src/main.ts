import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//svg 引入
import 'virtual:svg-icons-register'
//自定义插件
import gloablComponent from './components/index';
//引入模板的全局样式
import '@/styles/index.scss'
//路由
import router from './router';
//仓库
import pinia from './store';
//引入自定义指令
import {isHasButton} from '@/directive/has.ts'
const app =createApp(App)
app.use(ElementPlus, {
    locale: zhCn
})
app.use(gloablComponent)
app.use(router)
app.use(pinia)
isHasButton(app)
//引入路由鉴权文件
import './permisstions'
// 通过import.meta.env获取环境变量
app.mount('#app')

