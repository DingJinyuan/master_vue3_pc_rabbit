// createRouter：创建router实例对象
// createWebHistory：创建history模式的路由
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login'
import Layout from '@/views/Layout'
import Home from '@/views/Home'
import Category from '@/views/Category'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // path和component对应关系的位置
  routes: [
    {
      path: '/',
      component: Layout,
      children:[{
        //path: ''：子路由的默认路径（匹配 /），渲染 Home 组件 → 访问 / 时，显示 Layout + Home。
        path: '',
      component: Home,
      },{
        path: 'category',
      component: Category,
      }]
    }, {
      path: '/login',
      component: Login,
    }
  ],
})

export default router
