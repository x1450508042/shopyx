<template>
    <div>
        <div class="layout_container">

            <!-- 左侧菜单 -->
            <div class="layout_slider">
                <Logo></Logo>
                <el-scrollbar class="scrollbar">
                    <el-menu :collapse="useLayoutSetting.fold?true:false" :default-active="$router.path"  background-color="#001529" text-color="white">
                        <Menu :MenuList="userStore.menuRoutes"></Menu>
                    </el-menu>
                </el-scrollbar>
            </div>
            <!-- 顶部菜单 -->
            <div class="layout_tabbar" :class="{fold: useLayoutSetting.fold?true:false}">
                <Tabber></Tabber>
            </div>
            <!-- 内容展示区域 -->
            <div class="layout_main" :class="{fold: useLayoutSetting.fold?true:false}">
                <Main></Main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
//左侧菜单子组件
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import useUserStore from '@/store/modules/user';
import Main from '@/layout/main/index.vue'
import Tabber from '@/layout/tabbar/index.vue'
//获取路由对象
import {useRoute} from 'vue-router'
import useLayoutSettingStore from '@/store/modules/setting'
let useLayoutSetting = useLayoutSettingStore()

let $router = useRoute()
let userStore = useUserStore()
</script>
<script lang="ts">
export default {
    name:'Layout'
}
</script>
<style scoped lang="scss">
.layout_container {
    // position: relative;
    width: 100%;
    height: 100vh;

    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
        background: $base-menu-background;
        transition: all .3s;
        .scrollbar {
            width: 100%;
            height: calc(100vh - $base-menu-height);

            .el-menu {
                border-right: none;
            }
        }
        &.fold{
            width: $base-menu-min-width;

        }
    }

    .layout_tabbar {
        position: fixed;
        top: 0;
        left: $base-menu-width;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        transition: all .3s;
        &.fold{
            width: calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width
        }
    }

    .layout_main {
        position: absolute;
        top: $base-tabbar-height ;
        left: $base-menu-width;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        padding: 20px;
        overflow: auto;
        transition: all .3s;
        background: white;
        &.fold{
            width: calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width
        }

    }
}
</style>