<template>
    <div class='tabbar'>
        <div class='tabber_left'>
            <!--          顶部左侧-->
            <el-icon color='#000' style='margin-right: 10px' @click='changeIcon'>
                <Expand v-if="!useLayoutSetting.fold" />
                <Fold v-else />
            </el-icon>
            <!--          左侧面包屑-->
            <el-breadcrumb :separator-icon='ArrowRight'>
                <!-- 面包屑动态展示路由名字与标题 -->
                <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title"
                    :to="item.path">
                    <!-- 面包屑展示匹配路由的标题 -->
                    <el-icon style="margin: 0 5px;">
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='tabber_rigth'>
            <!--          頂部右側-->
            <el-button size='small' @click='updataRefsh' circle icon='Refresh'></el-button>
            <el-button size='small' @click='fullScreen' circle icon='FullScreen'></el-button>
            <el-button size='small' @click='' circle icon='Setting'></el-button>
            <img :src='userstore.avatar' style='width: 24px;height: 24px;margin: 0 10px; border-radius: 50%;'>
            <!--            下拉菜单-->
            <el-dropdown class="ys">
                <span class='el-dropdown-link'>
                    {{ userstore.username }}
                    <el-icon class='el-icon--right'>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="OutLog">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue'
import useLayoutSettingStore from '@/store/modules/setting'
import userStore from '../../store/modules/user';
import { ElNotification } from 'element-plus';
let userstore = userStore()
let useLayoutSetting = useLayoutSettingStore()
let $route = useRoute()
let $router = useRouter()
//定义一个响应式数据控制图标的切换
function changeIcon() {
    useLayoutSetting.fold = !useLayoutSetting.fold

}
//刷新按钮
let updataRefsh = () => {
    useLayoutSetting.refsh = !useLayoutSetting.refsh
}
//全屏按钮
let fullScreen = () => {
    //DOM对象的一个属性，用来判断当前是否全面[全屏：true，不是全屏：false]
    let full = document.fullscreenElement

    // 切换为全屏
    if (!full) {
        //文档根节点的方法requestFullscreen 实现全屏
        document.documentElement.requestFullscreen()
    } else {
        // 退出全屏
        document.exitFullscreen()
    }
}
//退出登录
let OutLog = async () => {
    try {
        await userstore.loginOut()
        //将路由信息传给登录页，这样登录成功后可以跳转到当前页
        $router.push({ path: '/login', query: { redirect: $route.path } })
    } catch (error) {
        ElNotification({
            type: 'error',
            message: (error as Error).message
        })
    }
}
</script>
<script lang="ts">
export default {
    name: 'Tabbar'
}
</script>
<style scoped lang='scss'>
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    // background-image: linear-gradient(to right, rgb(214, 196, 196), rgb(186, 149, 149), white);
    box-shadow: 0px -3px 1px 3px;
    background: white;
    .tabber_left {
        display: flex;
        align-items: center;
        margin-left: 20px;
    }

    .tabber_rigth {
        display: flex;
        align-items: center;
        .ys{
            margin-right: 20px;
        }
    }

}
</style>
