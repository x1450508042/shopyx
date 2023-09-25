//创建用户小仓库
import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLoginOut } from '@/api/user'
import type { loginForm, loginResponseData } from '@/api/user/type'
// import type { UserState } from './types/type'
//引入路由
import { constRouter, asnycRoute, anyRoute } from '@/router/routes'
//自定义本地存储工具
//@ts-ignore
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入深拷贝方法
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'

//用于过滤当前用户需要展示的异步路由
function fillterAsyncRouter(asyncRoute: any, routes: any) {
    return asyncRoute.filter((item: any) => {
        if (routes.includes(item.name)) {
            if (item.children && item.children.length > 0) {
                item.children = fillterAsyncRouter(item.children, routes)
            }
            return true
        }
    })
}

let userStore = defineStore('User',
    {
        //小仓库储存数据的地方
        state: (): any => {
            return {
                token: GET_TOKEN(),
                menuRoutes: constRouter, //仓库存储生生成菜单需要的数组(路由)
                username: '',
                avatar: '',
                // 存储当前用户是否包含某一个按钮
                buttons:[]
            }
        },
        //处理异步逻辑的地方
        actions: {
            //用户登录的方法
            async userLogin(data: loginForm) {
                let res: loginResponseData = await reqLogin(data)
                if (res.code == 200) {
                    this.token = res.data as string
                    localStorage.setItem('TOKEN', res.data)
                    return 'ok'
                } else {
                    return Promise.reject(new Error(res.data))
                }
            },
            async userInfo() {
                //获取用户的信息储存到仓库中
                let res: any = await reqUserInfo()
                if (res.code == 200) {
                    this.username = res.data.name
                    this.avatar = res.data.avatar
                    this.buttons=res.data.buttons
                    //计算当前用户需要展示的异步路由  这个必须得深拷贝一份 不然改变了账号路由也会改变
                    let userAsyncRoute = fillterAsyncRouter(cloneDeep(asnycRoute), res.data.routes)
                    //菜单的数据
                    this.menuRoutes = [...constRouter, ...userAsyncRoute, ...anyRoute]
                    let userroute=[...userAsyncRoute, ...anyRoute]
                    //目前路由器管理的只有常量路由: 计算完毕的异步路由任意路由动态追加
                    userroute.forEach((route:any)=>{
                        //追加路由
                        router.addRoute(route)
                    })
                    return 'ok'
                } else {
                    return Promise.reject(new Error(res.message))
                }
            },
            async loginOut() {
                let res: any = await reqLoginOut()
                if (res.code == 200) {
                    REMOVE_TOKEN()
                    this.token = '',
                        this.username = '',
                        this.avatar = ''
                    return 'ok'
                } else {
                    return Promise.reject(new Error(res.message))
                }
            },
        },
        getters: {},
    })

export default userStore
