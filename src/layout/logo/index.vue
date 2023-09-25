<template>
    <div class="logo">
        <svg>
            <use xlink:href="#icon-vue"></use>
        </svg>
        <!-- <img src="../../assets/images/background.jpg" alt=""> -->
        <p v-if="!useLayoutSetting.fold">{{ setting.title }}</p>
    </div>
</template>

<script setup lang="ts">
//引入设置标题配置文件
import setting from '@/setting';
import useLayoutSettingStore from '@/store/modules/setting'
let useLayoutSetting = useLayoutSettingStore()

</script>
<script lang="ts">
export default {
    name:'Logo'
}
</script>
<style lang="scss" scoped>
.logo{
    width: 100%;
    height:$base-menu-height ;
    color: white;
    display: flex;
    align-items: center;
    padding: 10px;
    svg{
        width: 40px;
        height: 40px;
    }
    p {
        font-size: $base-logo-title-fontSize;
        margin-left: 10px;
    }
}
</style>