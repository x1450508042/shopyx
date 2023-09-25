//SPU管理模块
import request from "@/utils/request.ts"
import type  {HasSpuResponseData,AllTradeMark,SpuHasImg} from './type'
import { HasSaleAttrResponseData, SaleAttrResponseData } from './type'

enum API {
        HASSPU_URL='/admin/product/',
        //获取全部品牌的数据
        ALLTRADEMARK_URL='/admin/product/baseTrademark/getTrademarkList',
        //获取某一个spu下的全部照片
        Image_URL='/admin/product/spuImageList/',
        //获取某一个spu下的全部已有销售属性
        SPUHASSALEATTR_URL='/admin/product/spuSaleAttrList/',
        //获取所有的销售属性
        allSALEATTR_URL='/admin/product/baseSaleAttrList',
        //追加一个新的spu
        ADDSPU_URL='/admin/product/saveSpuInfo',
        //跟新一个spu
        UPDATESPU_URL='/admin/product/updateSpuInfo',
        //新增一个sku
        ADDSKU_URL='/admin/product/saveSkuInfo',
        //查看某一个已有的spu下全部售卖的商品
        SKUINFO_URL='/admin/product/findBySpuId/',
        //删除spu
        DELETESPU_URL='/admin/product/deleteSpu/'
}
//获取三级分类下的spu数据
export  const reqHasSpu = (page:number,limit:number,category3Id:string|number)=>request.get<any,HasSpuResponseData>(API.HASSPU_URL+page+'/'+limit+'?category3Id='+category3Id)

//获取全部spu品牌
export const reqAlltradeMark =()=>request.get<any,AllTradeMark>(API.ALLTRADEMARK_URL)
//获取所有spu图片
export const reqImageUrl=(spuId:number)=>request.get<any,SpuHasImg>(API.Image_URL+spuId)
//  获取spu已有的销售属性
export const reqSpuHasSaleAttr=(spuId:number)=>request.get<any,SaleAttrResponseData>(API.SPUHASSALEATTR_URL+spuId)
//获取所有的销售属性
export const reqSpuAllSaleAttr=()=>request.get<any,HasSaleAttrResponseData>(API.allSALEATTR_URL)
//添加一个spu接口
export const reqAddOrUpdateSpu=(data:any)=>{
        //如果spu有id就是更新spu
        if(data.id){
                return request.post<any,any>(API.UPDATESPU_URL,data)
        }else{
                return request.post<any,any>(API.ADDSPU_URL,data)
        }
}
//添加sku的方法
export const reqAddSku = (data:any)=>request.post<any,any>(API.ADDSKU_URL,data)

//获取查看sku的方法
export const reqSkuList=(spuId:number|string)=>request.get<any,any>(API.SKUINFO_URL+spuId)

//删除已有的spu
export const reqDeleteSpu=(spuId:number|string)=>request.delete<any,any>(API.DELETESPU_URL+spuId)