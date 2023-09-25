<template>
    <el-card>
        <el-table border style='margin: 10px 0' :data='skuArr'>
            <el-table-column label='序号' type='index' align='center' width='80'></el-table-column>
            <el-table-column label='名称' show-overflow-tooltip prop='skuName'></el-table-column>
            <el-table-column label='描述' show-overflow-tooltip prop='skuDesc'></el-table-column>
            <el-table-column label='图片'>
                <template #='{row,$index}'>
                    <img :src='row.skuDefaultImg' alt='' style='width: 100px;height: 100px'>
                </template>
            </el-table-column>
            <el-table-column label='重量' prop='weight'></el-table-column>
            <el-table-column label='价格' prop='price'></el-table-column>
            <el-table-column label='操作' width='250'>
                <template #='{row,$index}'>
                    <el-button type='primary' size='small' :icon='row.isSale==0?`Top`:"Bottom"' :title="row.isSale==0?'上架':'下架'" @click='SaleSku(row)'></el-button>
                    <el-button type='primary' size='small' icon='Edit' @click='ElMessage.warning("该模块暂未开放")'></el-button>
                    <el-button type='primary' size='small' icon='InfoFilled' @click="findSku(row)"></el-button>
                    <el-popconfirm :title="`你确定删除${row.skuName}?`" @confirm='deleteSku(row)' width='200'>
                        <template #reference>
                            <el-button type='primary' size='small' icon='Delete' ></el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器
pagination
v-model:current-page ：设置分页器当前页码
v-model:page-size:每页显示数据
page-sizes:下拉菜单数据
background ：设置分页器按钮的背景色
layout： 分页器布局的调整
-->
        <div class='demo-pagination-block'>
            <el-pagination v-model:current-page='pageNo' v-model:page-size='limit' :total='total'
                           :page-sizes='[1,5,10,20]' background='true'
                           layout='prev, pager, next, jumper, ->,sizes,total'
                           @size-change='handleSizeChange' @current-change='handleCurrentChange' />
        </div>
<!--        抽屉组件 展示商品详情-->
        <el-drawer v-model="drawer" title="查看商品详情" >
            <el-row>
                <el-col :span='6'>名称</el-col>
                <el-col :span='18'>{{skuInfo.skuName}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='6'>描述</el-col>
                <el-col :span='18'>{{skuInfo.skuDesc}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='6'>价格</el-col>
                <el-col :span='18'>{{skuInfo.weight}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='6'>平台属性</el-col>
                <el-col :span='18'>
                    <el-tag v-for='item in skuInfo.skuAttrValueList' :key='item.id' style='margin: 0 5px'>{{ item.valueName }}</el-tag>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='6'>销售属性</el-col>
                <el-col :span='18'>
                    <el-tag v-for='item in skuInfo.skuSaleAttrValueList' :key='item' style='margin: 0 5px'>{{ item.saleAttrValueName }}</el-tag>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='6'>图片</el-col>
                <el-col :span='18'>
                    <el-carousel :interval="4000" type="card" height="200px">
                        <el-carousel-item v-for='i in skuInfo.skuImageList' :key='i.id'>
                            <img :src='i.imgUrl' alt='' style='width: 100%;height: 100%'>
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </el-drawer>
    </el-card>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { reqDeleteSku, reqSaleSku, reqSkuInfo, reqSkuList } from '@/api/product/sku'
import { ElMessage } from 'element-plus'
//当前页
let pageNo = ref<number>(1)
//当前页展示多少数据
let limit = ref<number>(5)
//总共多少数据
let total = ref<number>(400)
let skuArr=ref<any>([])
const drawer = ref<boolean>(false)
let skuInfo =ref<any>()
onMounted(() => {
    getHasSku()
})
const getHasSku = async () => {
    let res = await reqSkuList(pageNo.value, limit.value)
    if(res.code==200){
        total.value=res.data.total
        skuArr.value=res.data.records
    }
}

//page-size发生改变时
const handleSizeChange = (val:any) => {
    limit.value=val
    getHasSku()
}
//current-page发生改变时
const handleCurrentChange = (val:any) => {
    pageNo.value=val
    getHasSku()
}
//上架下架
const SaleSku=async(row:any)=>{
   let res = await reqSaleSku(row.isSale,row.id)
    if(res.code ==200){
        ElMessage({
            type:'success',
            message:row.isSale==0?'上架成功':'下架成功'
        })
        getHasSku()
    }else{
        ElMessage({
            type:'error',
            message:row.isSale==0?'上架失败':'下架失败'
        })
    }
}
const findSku=async (row:any)=>{
    let res = await reqSkuInfo(row.id)
    if(res.code == 200){
        drawer.value = true
        skuInfo.value=res.data
    }

}
//删除sku
async function deleteSku(row:any){
   let res = await reqDeleteSku(row.id)
    if(res.code == 200){
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        skuArr.value.length>0?pageNo.value:pageNo.value-1
        getHasSku()
    }else{
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
}
</script>

<style scoped>
.el-row {
    margin: 15px 0;
}
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
.el-carousel__indicators--horizontal {
    width: 100%;
}
</style>
