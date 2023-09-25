//品牌管理模块的接口
import request from "@/utils/request";
import type { TrademarkResponseData } from "./type";
import { Trademark } from './type'
enum API {
    //获取品牌接口
    TRADEMARK_URL=`/admin/product/baseTrademark/`,
    //新增品牌接口
    TRADEMARK_ADD='/admin/product/baseTrademark/save',
    //修改品牌信息接口
    TRADEMARK_UPDATA='/admin/product/baseTrademark/update',
    //删除品牌信息接口
    TRADEMARK_DELETE='/admin/product/baseTrademark/remove/'
}

//获取接口的方法
export const reqHasTrademark= (page:number,limit:number)=>request.get<any,TrademarkResponseData>(API.TRADEMARK_URL+`${page}/${limit}`)

//获取新增品牌
export  const reqAddOrUpdataTrademark=(data:Trademark)=>{
    // 当参数携带id说明是修改的
    if(data.id){
        return request.put<any,any>(API.TRADEMARK_UPDATA,data)
    }else{
        return request.post<any,any>(API.TRADEMARK_ADD,data)
    }
}
//删除品牌接口
export const reqDeleteTradeMark=(id:number)=>request.delete<any,any>(API.TRADEMARK_DELETE+id)