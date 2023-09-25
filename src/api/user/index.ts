//统一管理用户相关的接口
import request from "@/utils/request";
import type { loginForm,loginResponseData,ResponseUserInfoData } from "./type";
//统一管理接口
enum API{
    LOGIN_URL="/admin/acl/index/login",
    USER_INFO="/admin/acl/index/info",
    LOGIN_OUT="/admin/acl/index/logout"
}

//对外暴露函数
//登录接口方法

export const reqLogin=(data:loginForm)=>request.post<any,loginResponseData>(API.LOGIN_URL,data)

//获取用户信息接口
export const reqUserInfo=()=>request.get<any,ResponseUserInfoData>(API.USER_INFO)

//退出登录
export const reqLoginOut=()=>request.post<any,any>(API.LOGIN_OUT)