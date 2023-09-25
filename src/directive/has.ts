import pinia from '@/store'
import userStore from '@/store/modules/user.ts'
let useStore=userStore(pinia)
export const isHasButton =(app:any)=>{
    //全局自定义指令：实现按钮权限
    app.directive('has',{
        //代表使用这个全局自定义指令的DOM 挂载完毕后执行一次
        mounted(el:any,options:any){

           if(!useStore.buttons.includes(options.value)){
               //当前元素的父节点 把当前元素干掉
               el.parentNode.removeChild(el)
           }
        }
    })
}