<template>
    <el-card style='height: 80px;margin-bottom: 10px'>
        <el-form inline class='fix'>
            <el-form-item label='职位搜索'>
                <el-input placeholder='输入职位关键字' v-model='roleName'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' :disabled='!roleName' @click='seachs'>搜索</el-button>
                <el-button @click='reset'>重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card>
        <el-button type='primary' size='default' icon='Plus' @click='addRole'>添加职位</el-button>
        <el-table border style='margin: 10px 0' :data='records'>
            <el-table-column label='#' type='index' align='center' width='80'></el-table-column>
            <el-table-column label='ID' align='center' width='80' prop='id'></el-table-column>
            <el-table-column label='职位名称' align='center' show-overflow-tooltip prop='roleName'></el-table-column>
            <el-table-column label='创建时间' align='center' show-overflow-tooltip prop='createTime'></el-table-column>
            <el-table-column label='跟新时间' align='center' show-overflow-tooltip prop='updateTime'></el-table-column>
            <el-table-column label='操作' align='center' width='300'>
                <template #='{row,$index}'>
                    <el-button type='primary' size='small' icon='User' @click='setPermisstion(row)'>分配权限</el-button>
                    <el-button type='primary' size='small' icon='Edit' @click='updateRole(row)'>编辑</el-button>
                    <el-popconfirm :title="`你确定删除${row.roleName}?`" @confirm='deleteRole(row)'>
                        <template #reference>
                            <el-button type='primary' size='small' icon='Delete'>删除</el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
        <!--        分页器-->
        <el-pagination v-model:current-page='pageNo' v-model:page-size='limit' :total='total' :page-sizes='[1,5,10,20]'
                       layout='prev, pager, next, jumper, ->,sizes,total'
                       @size-change='handleSizeChange' @current-change='handleCurrentChange' />
    </el-card>
<!--    添加职位或跟新职位的对话框-->
    <el-dialog v-model='dialogValue' :title='RoleParams.id?"更新职位":"添加职位"'>
        <el-form :model='RoleParams' :rules='rules' ref='RoleForm'>
            <el-form-item label='职位名称' prop='roleName'>
                <el-input placeholder='请输入职位名称' v-model='RoleParams.roleName'></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click=" dialogValue=false">取消</el-button>
        <el-button type="primary" @click="save">
          确定
        </el-button>
      </span>
        </template>
    </el-dialog>
<!--    抽屉组件用来分配职位的菜单权限与按钮权限-->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>分配权限</h4>
        </template>
        <template #default>
            <div>
<!--                树形控件
 :default-expanded-keys="[2, 3] 默认展开的节点的 key 的数组"
-->
                <el-tree
                    ref='tree'
                    :data="menuArr"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :default-checked-keys="RolePermission"
                    :props="defaultProps"
                />
            </div>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer=false">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang='ts'>
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
    reqAddOrUpdateRole,
    reqAllRoleList,
    reqPemissionRole,
    reqRemoveRole,
    reqSetPemissionRole,
} from '@/api/acl/role'
import useLayoutSettingStore from '@/store/modules/setting.ts'
import { ElMessage } from 'element-plus'
let storeSetting =useLayoutSettingStore()
let pageNo = ref(1)
let limit = ref(5)
let total = ref(0)
let roleName = ref('')
//返回的全部职位
let records = ref([])
//控制对话框的显示隐藏
let dialogValue =ref<boolean>(false)
//收集新增数据
let RoleParams = reactive<any>({
    roleName:'',

})
//获取表单vc
const RoleForm =ref<any>()
//控制抽屉显示隐藏
let drawer =ref<boolean>(false)

//存储用户权限的数据
let menuArr=ref([])
//准备一个数组 用于储存勾选节点的Id(最后一级的)
let RolePermission=ref([])
let tree =ref()
onMounted(() => {
    AllRoleInfo()
})

// 树形控件
const defaultProps = {
    children: 'children',
    label: 'name',
}
//删除职位
const deleteRole=async (row:any)=>{
    let res:any =await reqRemoveRole(row.id)
    if(res.code ==200){
        ElMessage.success('删除成功')
        records.value.length>1?pageNo.value:pageNo.value-1
        AllRoleInfo()
    }else{
        ElMessage.error('删除失败')
    }
}
//抽屉确定按钮的回调
const confirmClick=async ()=>{
    // 获取全选的
    let checkAll =tree.value.getCheckedKeys()
    //获取半选的
    let checkAll2=tree.value.getHalfCheckedKeys()
    //将数组合并
    let permissionId=checkAll.concat(checkAll2)

   let res = await reqSetPemissionRole(RoleParams.id,permissionId)
    if(res.code ==200){
        ElMessage.success('分配权限成功')
        drawer.value=false
        //页面刷新
        window.location.reload()
    }else{
        ElMessage.error('分配权限失败')
    }
}
//递归最后一层的节点
const fillterSelectARrr =(allDate:any,initArr:any)=>{
    allDate.forEach((item:any)=>{
        if(item.select && item.level==4){
            initArr.push(item.id)
        }
        if(item.children && item.children.length>0){
            fillterSelectARrr(item.children,initArr)
        }
    })
    return initArr
}
//分配权限按钮的回调
const setPermisstion=async(row:any)=>{
    Object.assign(RoleParams,row)
    let res =await reqPemissionRole(RoleParams.id)
    if(res.code ==200){
        menuArr.value=res.data
        RolePermission.value = fillterSelectARrr(menuArr.value,[])
    }
    drawer.value=true
}
//添加时的方法
const save =async()=>{
   await RoleForm.value.validate()
   let res = await reqAddOrUpdateRole(RoleParams)
    if(res.code ==200){
        ElMessage.success(RoleParams.id?'更新职位成功':'添加职位成功')
        RoleParams.id?pageNo.value:pageNo.value=1
        AllRoleInfo()
        dialogValue.value=false
    }else{
        ElMessage.error(RoleParams.id?'更新职位失败':'添加职位失败')
    }

}


//表单校验
const validatorRoleName =(role:any,value:any,callBack:any)=>{
    if(value.trim().length>=2){
        callBack()
    }else{
        callBack(new Error('职位名称至少两位'))
    }
}
const rules ={
    roleName:[
        {required:true,trigger:'blur',validator:validatorRoleName}
    ]
}
//编辑按钮
const updateRole =(row:any)=>{
    dialogValue.value=true
    //存储已有的职位
    Object.assign(RoleParams,row)
    nextTick(()=>{
        RoleForm.value.clearValidate('roleName')
    })
}

//添加职位方法
const addRole=()=>{
    dialogValue.value=true
    Object.assign(RoleParams,{
        id:0,
        roleName:''
    })
    nextTick(()=>{
        RoleForm.value.clearValidate('roleName')
    })
}

//重置按钮
const reset =()=>{
    storeSetting.refsh=! storeSetting.refsh
}

//发生搜索请求
const seachs=()=>{
    AllRoleInfo()
    roleName.value=''
}

//获取全部职位
const AllRoleInfo = async () => {
    let res = await reqAllRoleList(pageNo.value, limit.value, roleName.value)
    records.value = res.data.records
    total.value=res.data.total
}
const handleSizeChange = (val: any) => {
    limit.value = val
    AllRoleInfo()
}
const handleCurrentChange = (val: any) => {
    pageNo.value = val
    AllRoleInfo()
}
</script>

<style scoped lang='scss'>
.fix {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
}
</style>