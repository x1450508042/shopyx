//登录接口需要携带的ts参数
export interface loginForm{
    username:string,
    password:string
}
// 定义全部接口返回数据拥有的ts类型
export interface ResponseData {
    code:number,
    message:string
    ok:boolean
}
//登录接口返回数据类型
export interface loginResponseData extends ResponseData {
    data:string
}
//获取用户信息返回的数据类型
export interface ResponseUserInfoData extends ResponseData{
    data:{
        routes:string[],
        buttins:string[],
        roles:string[],
        name:string,
        avatar:string,
    }
}
