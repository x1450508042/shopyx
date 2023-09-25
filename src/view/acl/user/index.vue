<template>
    <el-card style='height: 80px;'>
        <el-form inline class='form'>
            <el-form-item label='用户名:'>
                <el-input placeholder='请你输入用户名' v-model='keyWord'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' size='default' :disabled='!keyWord' @click='userinfo();keyWord=""'>搜索</el-button>
                <el-button type='primary' size='default' @click='reset'>重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style='margin: 10px 0'>
        <el-button type='primary' size='default' @click='addUser'>添加用户</el-button>
        <el-button type='danger' size='default' :disabled='selectIdArr.length?false:true' @click='DeleteSelectuser'>批量删除</el-button>
        <el-table style='margin: 10px 0' border :data='records' @selection-change='selectChange'>
            <el-table-column type='selection' align='center'></el-table-column>
            <el-table-column label='#' type='index' align='center' width='80'></el-table-column>
            <el-table-column label='ID' align='center' width='80' prop='id'></el-table-column>
            <el-table-column label='用户名' align='center' prop='username' show-overflow-tooltip></el-table-column>
            <el-table-column label='用户名称' align='center' prop='name' show-overflow-tooltip></el-table-column>
            <el-table-column label='用户角色' align='center' prop='roleName' show-overflow-tooltip></el-table-column>
            <el-table-column label='创建时间' align='center' prop='createTime' show-overflow-tooltip></el-table-column>
            <el-table-column label='更新时间' align='center' prop='updateTime' show-overflow-tooltip></el-table-column>
            <el-table-column label='操作' width='300' align='center'>
                <template #='{row,$index}'>
                    <el-button type='primary' icon='User' size='small' @click='fenpei(row)'>分类</el-button>
                    <el-button type='warning' icon='Edit' size='small' @click='updateUser(row)'>编辑</el-button>
                    <el-popconfirm :title="`你确定删除${row.name}?`" @confirm='removes(row.id)'>
                        <template #reference>
                            <el-button type='danger' icon='Delete' size='small'>删除</el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
        <!--        分页器-->
        <el-pagination v-model:current-page='pageNo' v-model:page-size='limit' :total='total' :page-sizes='[1,5,10,20]'
                       layout='prev, pager, next, jumper, ->,sizes,total'
                       @size-change='handleSizeChange' @current-change='handleCurrentChange' />
        <!--        抽屉 添加新的账号|修改账号信息-->
        <el-drawer v-model='drawer' :title='tit'>
            <template #default>
                <el-form label-width='80' :model='userParams' :rules='rules' ref='forms'>
                    <el-form-item label='用户名' prop='username'>
                        <el-input placeholder='请输入用户名' v-model='userParams.username'></el-input>
                    </el-form-item>
                    <el-form-item label='用户名称' prop='name'>
                        <el-input placeholder='请输入用户名称' v-model='userParams.name'></el-input>
                    </el-form-item>
                    <el-form-item label='用户密码' prop='password' v-if='!userParams.id'>
                        <el-input placeholder='请输入用户密码' v-model='userParams.password'></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button @click='drawer=false'>取消</el-button>
                <el-button type='primary' @click='addOrUpdates'>确定</el-button>
            </template>
        </el-drawer>
        <!--        用来职位分配-->
        <el-drawer v-model='drawer02' :title='tit'>
            <template #default>
                <el-form label-width='80'>
                    <el-form-item label='用户名'>
                        <el-input v-model='userParams.username' disabled></el-input>
                    </el-form-item>
                    <el-form-item label='职位列表'>
                        <el-checkbox v-model='checkAll' :indeterminate='indeterminate' @change='handleCheckAllChange'>
                            全选
                        </el-checkbox>
                        <el-checkbox-group v-model='checkedCities' @change='handleCheckedCitiesChange'>
                            <el-checkbox v-for='(city,index) in allRole' :key='index' :label='city'>
                                {{ city.roleName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button @click='drawer02=false'>取消</el-button>
                <el-button type='primary' @click='UpdateRole'>确定</el-button>
            </template>
        </el-drawer>
    </el-card>
</template>

<script setup lang='ts'>
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
    reqAddOrUpdateUser,
    reqRemoveUser,
    reqRemoveUserAll,
    reqSetUserRole,
    reqToAssignUser,
    reqUserInfo,
} from '@/api/acl/user'
import { ElMessage } from 'element-plus'
import useLayoutSettingStore from '@/store/modules/setting.ts'
let StoreSetting = useLayoutSettingStore()
//当前展示第几页
let pageNo = ref<number>(1)
//当前页展示多少数据
let limit = ref<number>(5)
//总共有多少数据
let total = ref<number>(200)
let drawer = ref<boolean>(false)
let drawer02 = ref<boolean>(false)
//存储用户信息
let records = ref<any>()
//抽屉标题
let tit = ref<string>('新增用户')
//收集参数
let userParams = reactive({
    username: '',
    name: '',
    password: '',
})
//表单检验
let forms = ref<any>()
//全选框收集数据
let checkAll = ref<boolean>(false)
//设置不确定样式
let indeterminate = ref<boolean>(true)
//单选框收集
let checkedCities = ref<any>([])
//单选框所有值
let allRole = ref<any>([])
//准备一个数组储存批量删除的用户id
let selectIdArr=ref<any>([])
//重置按钮
const reset =()=>{
    StoreSetting.refsh=!StoreSetting.refsh
}
//复选框勾选时触发
const selectChange=(val:any)=>{
    selectIdArr.value=val
}
//收集用户输入来的关键字
let keyWord =ref<any>('')
//批量删除
const DeleteSelectuser = async ()=>{
    //整理参数,接口只要id
    selectIdArr.value=selectIdArr.value.map(i=>i.id)
    let res:any = await reqRemoveUserAll(selectIdArr.value)
    if(res.code==200){
        ElMessage.success('删除成功')
        records.value.length>1?pageNo.value:pageNo.value-1
        userinfo()
    }else{
        ElMessage.error('删除失败')
    }
}

//删除某一用户
const removes =async (userId:number)=>{
   let res = await reqRemoveUser(userId)
    if(res.code==200){
        ElMessage.success('删除成功')
        records.value.length>1?pageNo.value:pageNo.value-1
        userinfo()
    }else{
        ElMessage.error('删除失败')
    }

}

//复选框方法
const handleCheckAllChange = (val: any) => {
    checkedCities.value = val ? allRole.value : []
    indeterminate.value = false
}
//单选框方法
const handleCheckedCitiesChange = (val: string[]) => {
    let checkedCount = val.length
    //判断当前选中的值是不是所有值，然后再给复选框赋值
    checkAll.value = checkedCount === allRole.length
    //只要勾选了单选框，并且单选框小于全部的值就可以了
    indeterminate.value = checkedCount > 0 && checkedCount < allRole.length

}

//校验用户名字
const validatorUserName = (role: any, value: any, callBack: any) => {

    if (value.length >= 5) {
        callBack()
    } else {
        callBack(new Error('用户名至少需要五位'))
    }
}
const validatorName = (role: any, value: any, callback: any) => {
    if (value.length >= 5) {
        callback()
    } else {
        callback(new Error('用户名称至少需要五位'))
    }
}
const validatorPassword = (role: any, value: any, callback: any) => {
    if (value.length >= 6) {
        callback()
    } else {
        callback(new Error('密码称至少需要六位'))
    }
}
const rules = {
    username: [{ required: true, trigger: 'blur', validator: validatorUserName }],
    name: [{ required: true, trigger: 'blur', validator: validatorName }],
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
onMounted(() => {
    userinfo()
})
const userinfo = async () => {
    let res = await reqUserInfo(pageNo.value, limit.value,keyWord.value)
    if (res.code == 200) {
        total.value = res.data.total
        records.value = res.data.records
    }

}
const handleSizeChange = (val: any) => {
    limit.value = val
    userinfo()
}
const handleCurrentChange = (val: any) => {
    pageNo.value = val
    userinfo()
}
//新增用户
const addUser = () => {
    tit.value = '新增用户'
    drawer.value = true
    Object.assign(userParams, {
        id: 0,
        username: '',
        name: '',
        password: '',
    })
    nextTick(() => {
        forms.value.clearValidate()
    })
}
//修改用户
const updateUser = (row: any) => {
    tit.value = '修改用户'
    Object.assign(userParams, row)
    drawer.value = true
}

//确定按钮
const addOrUpdates = async () => {
    await forms.value.validateField()
    let res = await reqAddOrUpdateUser(userParams)
    if (res.code == 200) {
        drawer.value = false
        ElMessage({
            type: 'success',
            message: userParams.id ? '更新成功' : '修改成功',
        })
        // userinfo()
        //浏览器自动刷新一次
        window.location.reload()
    } else {
        ElMessage({
            type: 'error',
            message: userParams.id ? '更新失败' : '修改失败',

        })
    }

}
const fenpei = async (row: any) => {
    let res = await reqToAssignUser(row.id)
    if (res.code == 200) {
        tit.value = '分配角色'
        Object.assign(userParams, row)
        drawer02.value = true
        allRole.value = res.data.allRolesList
        checkedCities.value = res.data.assignRoles
    }
}
//设置用户职位
const UpdateRole = async () => {
    let data: any = {
        userId: userParams.id,
        roleIdList: checkedCities.value.map(i => {
            return i.id
        }),
    }
    let res = await reqSetUserRole(data)
    if (res.code == 200) {
        ElMessage.success('分配职位成功')
        drawer02.value = false
        userinfo()
    } else {
        ElMessage.error('分配失败')
    }
}
</script>

<style scoped lang='scss'>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>