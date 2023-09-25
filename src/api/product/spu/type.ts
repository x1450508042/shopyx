export interface ResponseData {
    code:number,
    message:string,
    ok:boolean
}
export interface SpuData {
    id?:number,
    spuName:string,
    description:string,
    category3Id:string|number,
    tmId:number,
    spuSaleAttrList:null,
    spuImageList:null
}
//数组
export type Records = SpuData[]

export interface HasSpuResponseData extends ResponseData {
    data:{
        records:Records,
        total:number,
        size:number,
        current:number,
        searchCount:boolean,
        pages:number
    }

}

//所以品牌数据的ts类型
export  interface Trademark {
    id:number,
    tmName:string,
    logoUrl:string
}
//品牌接口返回的数据类型
export interface AllTradeMark extends  ResponseData{
    data:Trademark[]
}
//图片ts
export interface SpuImg {
    id:number,
    spuId:number,
    createTime:string,
    updateTime:string,
    imgName:string,
    imgUrl:string
}
//已有的spu照片墙的类型
export interface SpuHasImg extends ResponseData {
    data:SpuImg[]
}
//已有的销售属性值ts
export interface SaleAttrValue {
    id?:number,
    createTime:null,
    updateTime:null,
    spuId:number,
    baseSaleAttrId:number,
    saleAttrValueName:string,
    saleAttrName:string,
    isChecked:null
}
//存储已有的销售属性数组类型
export type spuSaleAttrValueList = SaleAttrValue[]
//销售属性对象ts类型
export interface SaleAttr {
    id?:number,
    createTime:null,
    updateTime:null,
    spuId:number,
    baseSaleAttrId:number,
    saleAttrValueName:spuSaleAttrValueList,
    saleAttrName:string,
}
//spu返回销售属性接口ts类型
export interface SaleAttrResponseData extends  ResponseData{
    data:SaleAttr[]
}

//已有的全部spu的返回的ts类型
export interface HasSaleAttr {
    id:number,
    name:string
}
export interface HasSaleAttrResponseData extends  ResponseData{
    data:HasSaleAttr[]
}