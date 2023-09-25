<script setup lang='ts'>
import type { HasSpuResponseData, Records, SpuData } from '@/api/product/spu/type.ts'
import { ref, watch ,onBeforeMount} from 'vue'
import useCategoryStore from '@/store/modules/category.ts'
import { reqDeleteSpu, reqHasSpu, reqSkuList } from '@/api/product/spu'
import spufrom from './spuForm.vue'
import SkuFrom from './skuForm.vue'
import { ElMessage } from 'element-plus'

let useCatStore = useCategoryStore()
let scene = ref<number>(0)  //0显示已有SPU 1:添加或修改已有SPU 2:添加sku
//当前页码
let pageNo = ref<number>(1)
//每页展示多少数据
let limit = ref<number>(3)
//总数据
let total = ref<number>(0)

let records = ref<Records>([])
//获取子组件组件实例
let SpuFrom = ref<any>(null)
let sku = ref<any>(null)
//储存sku数据
let skuArr = ref<any>([])

let show =ref<any>(false)
const handleSizeChange = async (val: number) => {
    limit.value = val
    getHasSpu()
}
const handleCurrentChange = async (val: number) => {
    pageNo.value = val
    getHasSpu()
}
//监听三级分类id的变化
watch(() => useCatStore.c3Id, () => {
    if (!useCatStore.c3Id) return
    getHasSpu()
})

//获取三级分类下的全部数据
const getHasSpu = async () => {
    let res: HasSpuResponseData = await reqHasSpu(pageNo.value, limit.value, useCatStore.c3Id)
    if (res.code == 200) {
        records.value = res.data.records
        total.value = res.data.total
    }
}
//点击添加spu按钮
const addSpu = () => {
    scene.value = 1
    SpuFrom.value.initAddSpu(useCatStore.c3Id)
}
//修改spu按钮
const updataSpu = (row: SpuData) => {
    scene.value = 1
    // console.log(SpuFrom.value.inits())
    SpuFrom.value.inits(row)
}
//子组件spufrom绑定的自定义事件
const changeScene = (obj: any) => {
    scene.value = obj.flag
    if (obj.params == 'add') {
        pageNo.value = 1
    }
    getHasSpu()
}
//添加Sku
const addSku = (row: any) => {
    //点击切换场景
    scene.value = 2
    sku.value.initSkuData(useCatStore.c1Id, useCatStore.c2Id, row)
}
//查看sku
const LookSku = async (row: any) => {
    let res = await reqSkuList(row.id)
    if(res.code ==200){
        skuArr.value=res.data
        //展示对话框
        show.value=true
    }
}
//删除spu
const removeSpu =async (row)=>{
  let res =await  reqDeleteSpu(row.id)
    if(res.code==200){
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        records.value.length>1?pageNo.value:pageNo.value-1
        getHasSpu()
    }else{
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
}
//路由销毁前清空仓库分类
onBeforeMount(()=>{
    useCatStore.$reset()
})

</script>

<template>
    <div>
        <!--        三级分类-->
        <Category :scene='scene'></Category>
        <el-card style='margin: 10px 0'>
            <div v-show='scene == 0'>
                <el-button type='primary' size='default' icon='Plus' :disabled='useCatStore.c3Id ? false : true'
                           @click='addSpu'>添加Spu
                </el-button>
                <el-table border style='margin: 10px 0' :data='records'>
                    <el-table-column label='序号' type='index' width='80'></el-table-column>
                    <el-table-column label='Spu名称' prop='spuName'></el-table-column>
                    <el-table-column label='Spu描述' prop='description' show-overflow-tooltip></el-table-column>
                    <el-table-column label='Spu操作'>
                        <template #='{ row }'>
                            <el-button type='primary' size='small' icon='Plus' title='添加sku'
                                       @click='addSku(row)'></el-button>
                            <el-button type='primary' size='small' icon='Edit' title='修改spu'
                                       @click='updataSpu(row)'></el-button>
                            <el-button type='primary' size='small' icon='View' title='查看sku'
                                       @click='LookSku(row)'></el-button>
                            <el-popconfirm :title="`你确定删除${row.spuName}?`" @confirm='removeSpu(row)'>
                                <template #reference>
                                    <el-button type='primary' size='small' icon='Delete' title='删除spu'></el-button>
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
                                   :page-sizes='[1, 3, 5, 10]' background='true'
                                   layout='prev, pager, next, jumper, ->,sizes,total'
                                   @size-change='handleSizeChange' @current-change='handleCurrentChange' />
                </div>
            </div>
            <!--            添加spu|修改spu-->
            <spufrom v-show='scene == 1' @changeScene='changeScene' ref='SpuFrom'></spufrom>
            <!--            添加sku-->
            <sku-from v-show='scene == 2' @changeScene='changeScene' ref='sku'></sku-from>
<!--            dialog对话框：展示已有的sku数据-->
            <el-dialog title='SKU列表' v-model='show'>
                <el-table border :data='skuArr'>
                    <el-table-column label='sku名称' prop='skuName'></el-table-column>
                    <el-table-column label='sku价格' prop='price'></el-table-column>
                    <el-table-column label='sku重量' prop='weight'></el-table-column>
                    <el-table-column label='sku图片' >
                        <template #='{row,$index}'>
                            <img :src='row.skuDefaultImg' style='width: 100px;height: 100px'>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-card>

    </div>
</template>

<style scoped lang='scss'></style>