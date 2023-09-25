//关于 layout配置的仓库
import { defineStore } from "pinia";

let useLayoutSettingStore=defineStore('SettingStore',{
    state:()=>{
        return {
            fold:false ,//用户控制折叠的
            refsh:false,//仓库这个属性是用于控制刷新效果
        }
    }
})

export default useLayoutSettingStore