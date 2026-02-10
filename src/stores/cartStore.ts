//封装购物车模块
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUserStore } from "./userStore";
import { insertCartAPI, findNewCartListAPI,delCartAPI } from '@/apis/cart'
export const useCartStore = defineStore("cart", () => {
  const userStore = useUserStore()
  //逻辑本质：判断 userStore.userInfo 中是否存在 token（登录令牌）——
  //有 token（非空 / 非 undefined）→ isLogin = true（已登录）；
  //无 token（空 /undefined）→ isLogin = false（未登录）；
  const isLogin = computed(() => userStore.userInfo.token)
  //1.state-cartList
  const cartList = ref([]);
    //获取最新购物车列表action
  const updateNewList=async()=>{
const res = await findNewCartListAPI()
      cartList.value = res.result
  }
  //action -addCart
  const addCart = async (goods) => {
    const { skuId, count } = goods
    console.log('当前登录状态：', isLogin.value)
    if (isLogin.value) {
      //登录之后加入购物车

      await insertCartAPI({ skuId, count })
      updateNewList()

    } else {
      //非登录
      //console.log('添加', goods)
      //添加购物车操作
      //已添加过-count+1
      //没有添加过直接push
      //思路：通过匹配传递过来的商品对象中的skuId能不能在cartList中找到，找到了就是添加过
      //简单记：find = 「找数组里第一个符合要求的元素」，找不到就返回 undefined。
      const item = cartList.value.find((item) => {
        return goods.skuId === item.skuId
      })
      if (item) {
        //找到了
        item.count++
      } else {
        //没找到 解构赋值 ...goods：把传入的商品对象（goods）的所有属性（如 skuId、count、price、name 等）复制到新对象中；
        cartList.value.push({ ...goods, selected: true })
      }
    }
  };
  //action-delete
  const delCart = async(skuId) => {
    if (isLogin.value) {
      //调用接口实现删除功能
      // 调用接口实现接口购物车中的删除功能
      await delCartAPI([skuId])
       updateNewList()
    } else {
      //idea1 找到删除项的下标值 splice(0,1) → 删除数组第 0 位的元素。
      const idx = cartList.value.findIndex((item) => skuId === item.skuId)
      if (idx !== -1) {
        cartList.value.splice(idx, 1)
      }
      //idea2 数组过滤的filter
      //    cartList.value = cartList.value.filter((item)=>{
      //   return item.skuId !== skuId
      // })
    }

  }

  //清除购物车
  const clearCart=()=>{
    cartList.value=[]
  }
  //action-单选功能
  const singleCheck = (skuId, selected) => {
    //通过skuId找到当前要求改的那一项把selected字段修改为传过来的selected
    const item = cartList.value.find((item) => item.skuId === skuId)
    if (item) {
      item.selected = selected
    }

  }
  //action-全选功能
  const allCheck = (selected) => {
    //把cartList的每一项都设置为当前全选框的状态
    cartList.value.forEach(item => item.selected = selected)
  }




  //计算属性
  //2.总的数量 所有项目的count之和
  // reduce累加：a是累加器（总和），c是当前遍历的商品项
  const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))

  //1.总价 所有项的count*price / 累加每个商品的（数量*单价），初始值0
  const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))

  //计算是否全选
  const isAll = computed(() => {
    if (cartList.value.length === 0) return false // 空购物车，全选框不勾选
    return cartList.value.every(item => item.selected === true) // 严格判断true
  })


  //已选择数量
  const selectedCount = computed(() => cartList.value.filter((item) => item.selected != false).reduce((a, c) => a + c.count, 0))
  //已选择商品价钱合计
  const selectedPrice = computed(() => cartList.value.filter((item) => item.selected != false).reduce((a, c) => a + c.count * c.price, 0))


  //return
  return {
    addCart,
    cartList,
    delCart,
    allCount,
    allPrice,
    singleCheck,
    isAll,
    allCheck,
    selectedCount,
    selectedPrice,
    clearCart,
    updateNewList,
  };
}, {
  persist: true,
});
