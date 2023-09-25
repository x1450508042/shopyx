<template>
    <el-table
        :data='tableData'
        style='width: 100%; margin-bottom: 20px'
        row-key='id'
        border
    >
        <el-table-column prop='name' label='名称' sortable />
        <el-table-column prop='code' label='权限值' sortable />
        <el-table-column prop='updateTime' label='修改时间' sortable />
        <el-table-column label='操作' sortable>
            <template #='{row,$index}'>
                <el-button type='primary' size='small' :disabled='row.level==4' @click='addPermisstion(row)'>
                    {{ row.level == 3 || row.level == 4 ? '添加功能' : '添加菜单' }}
                </el-button>
                <el-button type='primary' size='small' :disabled='row.level==1' @click='updatePermisstion(row)'>编辑
                </el-button>

                <el-popconfirm :title='`你确定删除${row.name}?`' @confirm='removeP(row.id)'>
                    <template #reference>
                        <el-button type='primary' size='small' :disabled='row.level==1'>删除</el-button>
                    </template>
                </el-popconfirm>

            </template>
        </el-table-column>
    </el-table>
    <!--    对话框组件  添加或跟新已有的菜单数据结构-->
    <el-dialog v-model='dialogFormVisible' :title="menuData.id?'更新菜单':'添加菜单'" style='width: 600px'>
        <el-form label-width='80' style='width: 500px' :model='menuData' :rules='rules' ref='formPermission'>
            <el-form-item label='名称' prop='name'>
                <el-input placeholder='请你输入菜单的名称' v-model='menuData.name' />
            </el-form-item>
            <el-form-item label='权限' prop='code'>
                <el-input placeholder='请你输入权限值' v-model='menuData.code' />
            </el-form-item>
        </el-form>
        <template #footer>
      <span class='dialog-footer'>
        <el-button @click='dialogFormVisible = false'>取消</el-button>
        <el-button type='primary' @click='save'>
          确定
        </el-button>
      </span>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { reqAddOrUpdatePermisstion, reqAllPermisstion, reqDeletePermisstion } from '@/api/acl/menu'
import { ElMessage } from 'element-plus'

let tableData = ref([])
let dialogFormVisible = ref(false)
let formPermission = ref()
//携带的参数
let menuData = reactive<any>({
    code: '',
    level: 0,
    name: '',
    pid: 0,
})
onMounted(() => {
    AllPermission()
})
//气泡框删除回调
const removeP = async (id) => {
    let res = await reqDeletePermisstion(id)
    if (res.code == 200) {
        ElMessage.success('删除成功')
        AllPermission()

    } else {
        ElMessage.error('删除失败')

    }
}

const validatorName = (role: any, value: any, callBack: any) => {
    if (value.length > 2) {
        callBack()
    } else {
        callBack(new Error('长度必须大于2位'))
    }
}
const validatorCode = (role: any, value: any, callBack: any) => {
    if (value.length > 2) {
        callBack()
    } else {
        callBack(new Error('长度必须大于2位'))
    }
}

//表单校验
const rules = {
    name: [{ required: true, trigger: 'blur', validator: validatorName }],
    code: [{ required: true, trigger: 'blur', validator: validatorCode }],
}
//获取菜单的所有属性
const AllPermission = async () => {
    let res = await reqAllPermisstion()
    if (res.code == 200) {
        tableData.value = res.data
    }
}
//添加菜单按钮的回调
const addPermisstion = (row: any) => {
    Object.assign(menuData, {
        code: '',
        level: 0,
        name: '',
        pid: 0,
    })
    //对话框显示出来
    dialogFormVisible.value = true
    menuData.level = row.level + 1
    menuData.pid = row.id
    //必须得加nextTick 不然dom没渲染
    nextTick(() => {
        formPermission.value.clearValidate(['name', 'code'])
    })
}
//编辑已有的菜单
const updatePermisstion = (row: any) => {
    //对话框显示出来
    dialogFormVisible.value = true
    Object.assign(menuData, row)
}
//确定按钮的回调
const save = async () => {
    await formPermission.value.validate()
    let res = await reqAddOrUpdatePermisstion(menuData)
    if (res.code == 200) {
        ElMessage.success('新增成功')
        dialogFormVisible.value = false
        AllPermission()
    } else {
        ElMessage.error('新增失败')
    }
}

</script>

<style scoped lang='scss'>

</style>