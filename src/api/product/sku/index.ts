//SKU模块接口
import request from '@/utils/request.ts'
//枚举地址
enum API {
    SKU_URL='/admin/product/list/',
    //下架
    CANCELSALE_URL='/admin/product/cancelSale/',
    //上架
    ONSALE_URL='/admin/product/onSale/',
    //获取商品详情
    SKUINFO_URL='/admin/product/getSkuInfo/',
    //删除已有的商品
    DELETESKU_URL='/admin/product/deleteSku/'
}

//获取商品sku的接口
export const reqSkuList=(pageNo:number,limit:number)=>request.get<any,any>(API.SKU_URL+`${pageNo}/${limit}`)

//上架请求or下架请求
export const reqSaleSku=(isSale:number,skuId:number)=>{
    if(isSale==0){
      return  request.get<any,any>(API.ONSALE_URL+skuId)
    }else if(isSale==1){
        return  request.get<any,any>(API.CANCELSALE_URL+skuId)
    }
}
//获取sku商品详情
export const reqSkuInfo=(skuId:any)=>request.get<any,any>(API.SKUINFO_URL+skuId)
//删除某一个商品
export const reqDeleteSku=(skuId:any)=>request.delete<any,any>(API.DELETESKU_URL+skuId)

