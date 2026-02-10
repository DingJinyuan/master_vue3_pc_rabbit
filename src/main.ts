import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // Pinia持久化插件（解决刷新丢失状态）
import App from './App.vue'
import router from './router'
//引入初始化样式文件
import '@/styles/common.scss'

//引入懒加载指令插件并注册
import {lazyPlugin} from'@/directives/index'
//引入全局组件插件
import {componentPlugin} from'@/components/index'
//测试接口函数
// import {getCategoryAPI} from '@/apis/testAPI'
// getCategoryAPI().then(res=>{
//     console.log(res)
// })
const app = createApp(App)
const pinia=createPinia()
//注册持久化插件
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(lazyPlugin)
app.use(componentPlugin)
app.mount('#app')

