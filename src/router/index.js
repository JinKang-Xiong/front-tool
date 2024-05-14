import routes from "./routes";
import {createRouter,createWebHashHistory} from 'vue-router'

// export default createRouter({
//     history:createWebHashHistory(),
//     routes
// })

const router=createRouter({
    history:createWebHashHistory(),
    routes
})
export {router}
