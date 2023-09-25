<template>
    <el-card class="box-card">
        <el-button type="primary" icon="Plus" @click="addTrandMark" v-has='`btn.Trademark.add`'>添加品牌</el-button>
        <!-- 表格组件 -->
        <el-table style="margin:10px 0;" border :data="trademarkArr">
            <el-table-column label="序号" width="80" align="center" type="index">
            </el-table-column>
            <el-table-column label="品牌名称" prop="tmName">
            </el-table-column>
            <el-table-column label="品牌Logo">
                <template #="{ $index, row }">
                    <img :src="row.logoUrl" style="width: 100px;height: 100px;">
                </template>
            </el-table-column>
            <el-table-column label="品牌操作">
                <template v-slot="{ row, $index }">
                    <el-button type="primary" icon="Edit" size="small" @click="updataTradMark(row)" />
                    <el-popconfirm :title="`确定删除${row.tmName}吗?`" icon='Delete' icon-color='red' @confirm='removeTradeMark(row.id)'>
                        <template #reference>
                            <el-button type="danger" icon="Delete" size="small" />
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
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :total="total"
                :page-sizes="[1, 3, 5, 10]" background="true" layout="prev, pager, next, jumper, ->,sizes,total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </el-card>
    <!-- 对话框组件 -->
    <el-dialog :title="title" v-model="dialogForm">
        <el-form style="width: 80%;" :model='TrademarkParmas' :rules='rules' ref='fromRef'>
            <el-form-item label="品牌名称" label-width="80" prop='tmName'>
                <el-input placeholder="请您输入品牌的名称" v-model='TrademarkParmas.tmName'></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO" label-width="80" prop='logoUrl'>
                <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload"
                    :show-file-list="true" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="TrademarkParmas.logoUrl" :src="TrademarkParmas.logoUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <!-- 具名插槽：footer -->
        <template #footer>
            <el-button  size="default" @click="quxiao">取消</el-button>
            <el-button type="primary" size="default" @click="queding">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import type { Records, Trademark, TrademarkResponseData } from '@/api/product/trademark/type'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { reqHasTrademark, reqAddOrUpdataTrademark, reqDeleteTradeMark } from '@/api/product/trademark'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
const getHasTradmark = async (page = 1) => {
    pageNo.value = page
    let res: TrademarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
    if (res.code == 200) {
        total.value = res.data.total
        trademarkArr.value = res.data.records
    }
}
onMounted(async () => {
    getHasTradmark()

})
//当前页码
let pageNo = ref<number>(1)
//每页展示多少数据
let limit = ref<number>(3)
//总数据
let total = ref<number>(0)
//存储已有品牌的数据
let trademarkArr = ref<Records>([])
//控制对话框显示隐藏
let dialogForm = ref<boolean>(false)
let title = ref<string>('')
//收集新增品牌信息
let TrademarkParmas=reactive<Trademark>({
    tmName:'',
    logoUrl:''
})
//获取from实例
let fromRef =ref<any>(null)
const handleSizeChange = async (val: number) => {
    limit.value = val
    getHasTradmark()
}
const handleCurrentChange = async (val: number) => {
    pageNo.value = val
    getHasTradmark(val)
}
//添加品牌的回调
let addTrandMark = () => {
    TrademarkParmas.tmName=''
    TrademarkParmas.logoUrl=''
    TrademarkParmas.id=0
    title.value = '添加品牌'
    dialogForm.value = true
    // 清空错误提示信息
    nextTick(()=>{
        fromRef.value.clearValidate('tmName')
        fromRef.value.clearValidate('logoUrl')
    })
    // fromRef.value?.clearValidate('tmName')
    // fromRef.value?.clearValidate('logoUrl')
}
//修改品牌的回调
let updataTradMark = (row:Trademark) => {
    // 清空错误提示信息
    nextTick(()=>{
        fromRef.value.clearValidate('tmName')
        fromRef.value.clearValidate('logoUrl')
    })
    title.value = '修改品牌'
    dialogForm.value = true
    // TrademarkParmas.tmName=row.tmName
    // TrademarkParmas.logoUrl=row.logoUrl
    // TrademarkParmas.id=row.id
    // es6语法 合并对象
    Object.assign(TrademarkParmas,row)
}

//对话框取消
let quxiao = ()=>{
    dialogForm.value = false
}
//对话框确定
let queding = async()=>{
    //返回的是一个promise 成功就执行下面的代码 失败就跳出了
   await fromRef.value.validate()
    let res = await reqAddOrUpdataTrademark(TrademarkParmas)
    if (res.code ==200){
        ElMessage({
            type:'success',
            message:TrademarkParmas.id?'修改成功':'添加成功'
        })
       await getHasTradmark(TrademarkParmas.id?pageNo.value:1)
    }else{
        ElMessage({
            type:'error',
            message:TrademarkParmas.id?'修改失败，稍后重试':'添加失败，稍后重试'
        })
    }
    dialogForm.value = false
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
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    // console.log(response)
    // console.log(uploadFile)
    TrademarkParmas.logoUrl = response.data
    fromRef.value.clearValidate('logoUrl')
}
//自定义校验规则方法
const validatorTmName =(rule:any,value:any,callBack:any)=>{

    //自定义校验规则
    if(value.trim().length>=2){
        callBack()
    }else{
        callBack(new Error('品牌名称必须大于等于两位'))
    }
}
const validatorLogoUrl =(rule:any,value:any,callBack:any)=>{
    // 如果图片有地址就说明上传了
    if(value){
        callBack()
    }else{
        callBack(new Error('LOGO图片必须上传'))
    }
}
//表单校验规则
let rules = {
    tmName:[
        //required:这个字段是必校验的，表单前面出来红星
        //trigger:代表触发校验的时机
        {required:true,trigger:'blur',validator:validatorTmName}
    ],
    logoUrl:[
        {required:true,trigger:'change',validator:validatorLogoUrl}
    ]
}
//删除时 气泡点击确定的回调
let removeTradeMark = async(id:number)=>{
   let res = await reqDeleteTradeMark(id)
    if(res.code == 200){
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        //判断当前数据有多少条，最后一条删除后要返回上一页
        if(trademarkArr.value.length>1){
            getHasTradmark(pageNo.value)
        }else{
            getHasTradmark(pageNo.value-1)
        }

    }else{
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
}
</script>

<style scoped lang="scss"></style>
<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>