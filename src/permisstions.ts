//路由鉴权：鉴权， 项目中的路由能不能被访问的权限设置(某一个路由什么条件下可以访问，什么条件下不能访问)
import router from '@/router'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import nprogress from 'nprogress'
//进度条样式
import 'nprogress/nprogress.css'
import pinia from './store'
import userStore from '@/store/modules/user'
import { GET_TOKEN } from './utils/token'
import setting from './setting'
//加载的小球取消掉
nprogress.configure({showSpinner:false})
let userStoreU = userStore(pinia)
//全局：项目中任意路由切换都会触发的钩子
//全局前置守卫
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)

router.beforeEach(async (to: any, from: any, next: any) => {
    //to:你将要访问那个路由
    //from:你从那个路由来
    // next：放行
    // 访问某一个路由之前会触发
    //进度条开始
    nprogress.start()
    document.title=setting.title+'-'+to.meta.title
    if (userStoreU.token || GET_TOKEN()) {
        //登录成功
        //不能访问login
        if (to.path == '/login') {
            next({ path: '/' })
        } else {
            //登录成功返回其余路由
            //有用户信息
            if (userStoreU.username) {
                next()
            } else {
                try {
                    await userStoreU.userInfo()
                    //万一刷新的时候是异步路由，有可能后渠道用户信息了、但异步路由还没有加载完毕，出现了空白效果
                    //等路由加载完毕后再放行
                    next({...to})
                } catch (error) {
                    //token 获取不到也就获取不到信息了
                    userStoreU.loginOut()
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }
        }
    } else {
        //用户未登录
        //访问的地址是/login
        if (to.path == '/login') {
            next()
        } else {
            //不是/login 就让他前往/login
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
})

// //全局后置守卫
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)

router.afterEach((to: any, form: any) => {
    //进度条结束
    nprogress.done()
})

//路由鉴权
// 全部路由组件：登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)
//用户未登录：可以访问login,其余的路由不能访问
//用户登录成功:不可以访问login 其余路由都能访问
