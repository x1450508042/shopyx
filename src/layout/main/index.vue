<template>
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <!-- 渲染一级路由组件的子路由 v-if="flag"用来控制组件销毁的 通过watch 来监听 -->
            <component :is="Component" v-if="flag"></component>
        </transition>
    </router-view>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { ref, watch,nextTick } from 'vue';
let useLayoutSetting = useLayoutSettingStore()

//控制当前组件是否销毁
let flag =ref(true)

//监听仓库内的数据是否发生变化
watch(()=>useLayoutSetting.refsh,()=>{
    //点击刷新按钮，路由组件销毁
    flag.value=false
    //当dom跟新完毕后 立即执行 
    nextTick(()=>{
        flag.value=true
    })
})
</script>
<script lang="ts">
export default {
    name:'Main'
}
</script>
<style scoped lang="scss">
.fade-enter-from {
    opacity:0;
}
.fade-enter-active{
    transition:all .5s;
}
.fade-enter-to{
    opacity:1;
    transform: scale(1);
}
</style>