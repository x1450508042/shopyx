//用户管理接口
import request from '@/utils/request.ts'

enum API {
    //获取用户信息
    USER_URL = '/admin/acl/user/',
    //新增用户
    ADDUSER_URL = '/admin/acl/user/save',
    //修改用户
    UPDATEUSER_URL = '/admin/acl/user/update',
    // 根据用户获取角色
    TOASSIGNUSER_URL = '/admin/acl/user/toAssign/',
    // 分配职务
    SETUSERROLE_URL='/admin/acl/user/doAssignRole',
    // 根据id删除某一个账号
    DELETEUSER_URL='/admin/acl/user/remove/',
    //批量删除
    DELETEUSERALL_URL='/admin/acl/user/batchRemove'
}

//获取用户账号信息
export const reqUserInfo = (page: number, limit: number,username:string) => request.get<any, any>(API.USER_URL + `${page}/${limit}/?username=${username}`)

//新增用户或修改
export const reqAddOrUpdateUser = (data: any) => {
        if (data.id) {
            return request.put(API.UPDATEUSER_URL, data)
        } else {
            return request.post<any, any>(API.ADDUSER_URL, data)
        }}
export const reqToAssignUser=(adminId:any)=>request.get<any,any>(API.TOASSIGNUSER_URL+adminId)

//分配职位
export const reqSetUserRole=(data:any)=>request.post<any,any>(API.SETUSERROLE_URL,data)
//删除某一个账号信息
export const reqRemoveUser=(userId:any)=>request.delete<any,any>(API.DELETEUSER_URL+userId)
//批量删除
export const reqRemoveUserAll=(idList:any)=>request.delete<any,any>(API.DELETEUSERALL_URL,{data:idList})