<script setup lang='ts'>
import type {
    AllTradeMark, HasSaleAttr, HasSaleAttrResponseData, SaleAttr,
    SaleAttrResponseData,
    SpuData,
    SpuHasImg,
    Trademark,
} from '@/api/product/spu/type.ts'
import {
    reqAlltradeMark,
    reqImageUrl,
    reqSpuHasSaleAttr,
    reqSpuAllSaleAttr,
    reqAddOrUpdateSpu,
} from '@/api/product/spu'
import { computed, ref, watch } from 'vue'
import { ElMessage, UploadProps } from 'element-plus'

let $emit=defineEmits(['changeScene'])

//存储已有的spu数据
let AllTradeMark = ref<Trademark[]>([])
let imgList =ref<any>([])
let saleAttr=ref<SaleAttr[]>([])
let allSaleAttr=ref<HasSaleAttr[]>([])
//存储已有的spu对象
let SpuParams=ref<any>({})
let dialogValue =ref<boolean>(false)
let dialogValueImage =ref('')
//收集还未选择的销售属性的id和名字
let saleAttrIdOrName = ref<any>('')
//控制按钮和input

const qx = ()=>{
    $emit('changeScene',{flag:0})
}
const inits=async (row:SpuData)=>{
    SpuParams.value=row
    //获取全部品牌的数据
    let res:AllTradeMark = await reqAlltradeMark()
    //获取spu图片
    let res2:SpuHasImg =await reqImageUrl((row.id as number))
    //获取已有的SPU销售属性
    let res3:SaleAttrResponseData = await reqSpuHasSaleAttr((row.id as number))
    //获取整个项目全部SPU的销售属性
    let res4:HasSaleAttrResponseData= await reqSpuAllSaleAttr()

    //存储全部数据
    AllTradeMark.value=res.data
    //全部的商品图片
    imgList.value=res2.data.map((item)=>{
        return {
            name:item.imgName,
            url:item.imgUrl
        }
    })

    //存储全部的销售属性
    saleAttr.value=res3.data

    //粗存全部的属性
    allSaleAttr.value=res4.data

}
const handlePictureCardPreview = (file:any)=>{
    dialogValueImage.value =file.url
    dialogValue.value=true
}
//上传图片组件-》上传之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    //钩子是在文件上传之前触发，可以约束文件的类型或大小
    //要求：上传文件格式PNG|JPG|JIF  大小4m
    if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
        if(rawFile.size / 1024 / 1024 > 4) {
            ElMessage.error('文件大小不能超过4MB!')
            return false
        }else{
            return true
        }
    } else {
        ElMessage.error('上传的格式必须是：jpg、png、jif格式')
        return false
    }


}
//计算当前spu还未拥有的属性
let unSelect = computed(()=>{
    //allSaleAttr里面是全部的销售属性
    let unArr=allSaleAttr.value.filter(item=>{
        //saleAttr这是已有的销售属性
        return saleAttr.value.every(item1=>{
            //过滤出没有选的销售属性
            return item.name !=item1.saleAttrName
        })
    })
    return unArr
})
//添加销售属性方法
const AddSaleAttr = ()=>{
    let [baseSaleAttrId,saleAttrName] =saleAttrIdOrName.value.split(':')
    let newSaleAttr ={
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList:[]
    }
    saleAttr.value.push(newSaleAttr)
    saleAttrIdOrName.value=''
}
//属性按钮点击事件
const toEdit = (row:any)=>{
    row.flag=true
    row.saleAttrValue=''
}
//表单失去焦点提交
const toLook =(row:any)=>{

    const {baseSaleAttrId} =row
    const saleAttrValueName =row.saleAttrValue
    let objs = {
        baseSaleAttrId,
        saleAttrValueName
    }
    //非法情况判断
    if(saleAttrValueName.trim() == ''){
        ElMessage({
            type:'error',
            message:'属性值不能为空'
        })
        return
    }
    let rep =row.spuSaleAttrValueList.find((item:any)=>{
        return item.saleAttrValueName ==saleAttrValueName
    })
    if(rep) {
        ElMessage({
            type:'error',
            message:'属性值重复'
        })
        return
    }
    row.spuSaleAttrValueList.push(objs)
    row.flag=false
}
//点击发送请求
const AddOrUpdateSpuAttr=async()=>{
    //整理参数
    //照片墙的数据
    SpuParams.value.spuImageList=imgList.value.map(item=>{
        return {
            imgName:item.name,
            imgUrl:(item.response && item.response.data)||item.url
        }
    })
    SpuParams.value.spuSaleAttrList=saleAttr.value

   let res=await reqAddOrUpdateSpu(SpuParams.value)
   if(res.code==200){
       ElMessage({
           type:SpuParams.value.id?'success':'success',
           message:SpuParams.value.id?'修改成功':'添加成功'
       })

       $emit('changeScene',{flag:0,params:SpuParams.value.id?'update':'add'})
   }else{
       ElMessage({
           type:'error',
           message:SpuParams.value.id?'修改失败':'添加失败'
       })
   }
}
//添加一个新的spu初始化方法
const initAddSpu =async (c3Id)=>{
    //清空数据
    SpuParams.value={}
    imgList.value=[]
    saleAttr.value=[]
    saleAttrIdOrName.value=''
    //存储三级分类id
    SpuParams.value.category3Id=c3Id
    //获取全部品牌的数据
    let res:AllTradeMark = await reqAlltradeMark()
    //获取整个项目全部SPU的销售属性
    let res1:HasSaleAttrResponseData= await reqSpuAllSaleAttr()
    AllTradeMark.value=res.data
    allSaleAttr.value=res1.data
}
defineExpose({inits,initAddSpu})
</script>

<template>
    <el-form label-width='100'>
        <el-form-item label='SPU名称'>
            <el-input placeholder='请你输入SPU名称' v-model='SpuParams.spuName'></el-input>
        </el-form-item>
        <el-form-item label='SPU品牌'>
            <el-select v-model='SpuParams.tmId'>
                <el-option v-for='item in AllTradeMark' :key='item.id' :label='item.tmName' :value='item.id'></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label='SPU描述'>
            <el-input type='textarea' placeholder='请你输入SPU描述' v-model='SpuParams.description'></el-input>
        </el-form-item>
        <el-form-item label='SPU照片'>
            <el-upload
                v-model:file-list="imgList"
                action="/api/admin/product/fileUpload"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :before-upload="beforeAvatarUpload"
            >
                <el-icon><Plus /></el-icon>
            </el-upload>
            <el-dialog v-model="dialogValue">
                <img w-full :src="dialogValueImage" alt="Preview Image"  />
            </el-dialog>
        </el-form-item>
        <el-form-item label='SPU销售属性'>
            <el-select :placeholder='unSelect.length?`还未选择${unSelect.length}`:`暂无可选项`' v-model='saleAttrIdOrName'>
                <el-option :label='item.name' v-for='item in unSelect' :key='item.id' :value='`${item.id}:${item.name}`'></el-option>
            </el-select>
            <el-button icon='Plus' type='primary' size='default' style='margin-left:10px' :disabled='saleAttrIdOrName?false:true' @click='AddSaleAttr'>添加属性</el-button>
            <el-table border style='margin: 10px 0' :data='saleAttr'>
                <el-table-column label='序号' type='index' align='center' width='80'></el-table-column>
                <el-table-column label='销售属性名称' width='120' prop='saleAttrName'></el-table-column>
                <el-table-column label='销售属性值'>
                    <template #='{row,$index}'>
                        <el-tag
                            v-for="(tag,index) in row.spuSaleAttrValueList"
                            :key="row.id"
                            class="mx-1"
                            closable
                            style='margin: 0 5px'
                            @close='row.spuSaleAttrValueList.splice(index,1)'
                        >
                            {{ tag.saleAttrValueName }}
                        </el-tag>
                        <el-input @blur='toLook(row)' v-model='row.saleAttrValue' placeholder='请你输入属性值' size='small' style='width: 100px' v-if='row.flag == true'></el-input>
                        <el-button style='margin: 0 5px' type='primary' size='small' icon='Plus' v-else @click='toEdit(row)'></el-button>
                    </template>
                </el-table-column>
                <el-table-column label='操作' width='120'>
                    <template #='{row,$index}'>
                        <el-button type='danger' size='small' icon='Delete' @click='saleAttr.splice($index,1)'></el-button>
                    </template>

                </el-table-column>

            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type='primary' size='default' @click='AddOrUpdateSpuAttr' :disabled='saleAttr.length>0?false:true'>保存</el-button>
            <el-button  size='default' @click='qx'>取消</el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped lang='scss'>

</style>