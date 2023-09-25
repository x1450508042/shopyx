import request from '@/utils/request.ts'
enum API {
    //获取全部菜单原牛的标识数据
    ALLPERMISSTION_URL='/admin/acl/permission',
    //新增菜单
    ADDPERMISSTION_URL='/admin/acl/permission/save',
    //跟新一个已有菜单
    UPDATEMISSTION_URL='/admin/acl/permission/update',
    // 删除菜单
    DELETEMISSION_URL='/admin/acl/permission/remove/'
}
//获取菜单数据
export const reqAllPermisstion =()=>request.get<any,any>(API.ALLPERMISSTION_URL)
//新增菜单  | 跟新个菜单
export const reqAddOrUpdatePermisstion=(data:any)=>{
    if(data.id){
      return   request.put<any,any>(API.UPDATEMISSTION_URL,data)
    }else{
       return  request.post<any,any>(API.ADDPERMISSTION_URL,data)
    }
}
export const reqDeletePermisstion=(id:any)=>request.delete<any,any>(API.DELETEMISSION_URL+id)

