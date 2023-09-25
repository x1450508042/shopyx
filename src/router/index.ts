import {createRouter,createWebHashHistory} from 'vue-router'
import { constRouter } from "./routes";
const router=createRouter({
    //路由hash
    history:createWebHashHistory(),
    routes:constRouter,
    //滚动行为
    scrollBehavior(){
        return {
            top:0,
            left:0
        }
    }
})

export default router;
