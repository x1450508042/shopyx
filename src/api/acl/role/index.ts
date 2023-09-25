//角色管理模块接口
import request from '@/utils/request.ts'
enum API {
    //获取全部角色职位
    ALLROLE_URL = '/admin/acl/role/',
    //新增职位
    ADDROLE_URL='/admin/acl/role/save',
    //跟新职位
    UPDATEROLE_URL='/admin/acl/role/update',
    // 根据职位的id来获取菜单
    PERMISSION_URL='/admin/acl/permission/toAssign/',
    //给角色分配权限
    SETPERMISSION_URL='/admin/acl/permission/doAssign',
    //删除已有的职位
    REMOVEROLE_URL='/admin/acl/role/remove/'
}
export const reqAllRoleList =(page:any,limit:any,roleName:string)=>request.get<any,any>(API.ALLROLE_URL+`${page}/${limit}/?roleName=${roleName}`)

//增加或跟新职位
export const reqAddOrUpdateRole=(data:any)=>{
    if(data.id){
       return  request.put<any,any>(API.UPDATEROLE_URL,data)
    }else{
        return  request.post<any,any>(API.ADDROLE_URL,data)
    }}
//获取所有权限
export const reqPemissionRole=(roleId:number|string)=>request.get<any,any>(API.PERMISSION_URL+roleId)
//给相应的职位下发权限
export const reqSetPemissionRole=(roleId:any,permissionId:number[])=>request.post<any,any>(API.SETPERMISSION_URL+`/?roleId=${roleId}&permissionId=${permissionId}`)
//删除已有的职位
export const reqRemoveRole=(roleId:number)=>request.delete<any,any>(API.REMOVEROLE_URL+roleId)