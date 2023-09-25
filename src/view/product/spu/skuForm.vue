<script setup lang='ts'>






import {reqAttr} from '@/api/product/attr'
import { reqAddSku, reqImageUrl, reqSpuHasSaleAttr } from '@/api/product/spu'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])
//平台属性
let attrArr=ref<any>([])
//销售属性
let saleArr=ref<any>([])
//图片数据
let imgArr= ref<any>([])

//收集sku数据
let skuParams=reactive<any>({})
//获取tab组件实例vc
let table =ref<any>()
function cancel(){
    $emit('changeScene',{flag:0,params:''})
}
//当前子组件的方法对外暴露
const initSkuData=async (c1Id:number|string,c2Id:number|string,spu:any)=>{
    skuParams.category3Id=spu.category3Id
    skuParams.spuId=spu.id
    skuParams.tmId=spu.tmId
    //获取平台属性
    let res = await reqAttr(c1Id,c2Id,spu.category3Id)
    attrArr.value=res.data
    //获取对应的销售属性
    let res2=await reqSpuHasSaleAttr(spu.id)
    saleArr.value=res2.data
    //获取照片墙的数据
    let res3 =await reqImageUrl(spu.id)
    imgArr.value=res3.data
}
//设置默认图片的方法回调
const handle =(row:any)=>{
    //点击的时候让所有狂不勾选
    imgArr.value.forEach((item:any)=>{
        table.value.toggleRowSelection(item,false)
    })
    table.value.toggleRowSelection(row,true)
    skuParams.skuDefaultImg=row.imgUrl

}
//保存按钮
const save=async()=>{
    //平台属性
    skuParams.skuAttrValueList =attrArr.value.reduce((prev:any,next:any)=>{
        if(next.attrIdAndValueId){
          let [attrId,valueId] = next.attrIdAndValueId.split(':')
            prev.push({attrId,valueId})
        }
        return prev
    },[])
    skuParams.price=parseInt(skuParams.price)
    //销售属性
    skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev:any,next:any)=>{
        if(next.saleIdAndValueId){
          let [saleAttrId,saleAttrValueId]=  next.saleIdAndValueId.split(':')
            prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
    },[])
    let res:any =  await reqAddSku(skuParams)
    if(res.code == 200){
        ElMessage({
            type:'success',
            message:'添加成功'
        })
        $emit('changeScene',{flag:0,params:''})
    }else{
        ElMessage({
            type:'error',
            message:'添加失败，检查网络稍后重试'
        })
    }
}
//对外暴露的方法
defineExpose({initSkuData})
</script>

<template>
    <el-form>
        <el-form-item label="sku名称:">
            <el-input placeholder="spu名称" v-model='skuParams.skuName'></el-input>
        </el-form-item>
        <el-form-item label="价格(元):">
            <el-input placeholder="价格(元)" type="number" v-model='skuParams.price'></el-input>
        </el-form-item>
        <el-form-item label="重量(g):">
            <el-input placeholder="重量(g)" type="number" v-model='skuParams.weight'></el-input>
        </el-form-item>
        <el-form-item label="SKU描述:">
            <el-input placeholder="SKU描述" type="textarea" v-model='skuParams.skuDesc'></el-input>
        </el-form-item>
        <el-form-item label="平台属性:">
            <el-form inline label-width='60'>
                <el-form-item :label='item.attrName' v-for='(item,index) in attrArr' :key='item.id'>
                    <el-select v-model='item.attrIdAndValueId'>
                        <el-option :value='`${item.id}:${item2.id}`' :label='item2.valueName' v-for='(item2,index) in item.attrValueList' :key='item2.id'></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性:">
            <el-form inline label-width='60'>
                <el-form-item :label='item.saleAttrName' v-for='(item,index) in saleArr' :key='item.id'>
                    <el-select v-model='item.saleIdAndValueId'>
                        <el-option :value='`${item.id}:${item2.id}`' :label='item2.saleAttrValueName' v-for='(item2,index) in item.spuSaleAttrValueList' :key='item2.id'></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label='图片名称'>
            <el-table border :data='imgArr' ref='table'>
                <el-table-column type='selection' width='80' align='center'></el-table-column>
                <el-table-column label='图片' >
                    <template #='{row,$index}'>
                        <img :src='row.imgUrl' alt='' style='width: 100px;height: 100px'>
                    </template>
                </el-table-column>
                <el-table-column label='名称' prop='imgName'></el-table-column>
                <el-table-column label='操作' >
                    <template #='{row,$index}'>
                        <el-button type='primary' size='small' @click='handle(row)'>设置默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type='primary' size='default' @click='save'>保存</el-button>
            <el-button  size='default' @click='cancel'>取消</el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped lang='scss'></style>