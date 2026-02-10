//管理用户数据相关
import { defineStore } from "pinia";
import { ref } from "vue";
import { useCartStore} from './cartStore'
import {loginAPI} from '@/apis/user'
import {mergeCartAPI} from '@/apis/cart'
export const useUserStore=defineStore('user',()=>{
    //定义管理用户的数据state
    const userInfo=ref({})
    const cartStore=useCartStore()
    //定义获取接口的action
    const getUserInfo=async(account,password)=>{
        const res=await loginAPI(account,password)
        userInfo.value=res.result
        //执行合并购物车
        await mergeCartAPI(cartStore.cartList.map(item=>{
            return {
                skuId:item.skuId,
                selected:item.selected,
                count:item.count,
            }
        }))
        //获取最新列表
        cartStore.updateNewList()
    }
    //退出时清楚用户信息
    const clearUserInfo=()=>{
        userInfo.value={}
        //执行清除购物车的action
        cartStore.clearCart()
    }
    //return 对象格式
    return{
        userInfo,getUserInfo,clearUserInfo
    }
}, {
  persist: true,
})