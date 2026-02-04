//封装分类数据业务相关
import { onMounted, ref } from 'vue';
import { getCategoryAPI } from '@/apis/category'
// 3. 引入VueRouter的路由钩子：useRoute（获取当前路由信息）
import { useRoute } from 'vue-router'
import { onBeforeRouteUpdate } from 
'vue-router'
export function useCategory(){
    const categoryData = ref({})
// 5. 获取当前路由实例（包含路由参数、路径等信息
const route = useRoute()
const getCategory = async (id=route.params.id) => {
  const res = await getCategoryAPI(id)
  categoryData.value = res.result
}
onMounted(() => {
  getCategory()
})
//路由参数发生变化的时候可以把分类数据接口重新发送 to-目标路由对象
onBeforeRouteUpdate((to)=>{
  //存在问题：使用最新的路由参数请求最新的分类数据
  //getCategory()
  getCategory(to.params.id)
})
return {
    categoryData
}
}