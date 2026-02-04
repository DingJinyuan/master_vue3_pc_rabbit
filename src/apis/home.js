import httpInstance from '@/utils/http'

//获取banner
export function  getBannerAPI(params={}){
        //广告区域展示位置（投放位置 投放位置，1为首页，2为分类商品页） 默认是1
        const {distributionSite=1}=params
    return httpInstance({
        url:'/home/banner',
        params:{
          distributionSite
        }
    })
}
/**
 * @description: 获取新鲜好物
 * @param {*}
 * @return {*}
 */
export const findNewAPI = () => {
  return httpInstance({
    url:'/home/new'
  })
}
/**
 * @description: 获取人气推荐
 * @param {*}
 * @return {*}
 */
export const getHotAPI = () => {
  return  httpInstance({
    url:'/home/hot'
  }) 
}
/**
 * @description: 获取所有商品模块
 * @param {*}
 * @return {*}
 */
export const getGoodsAPI = () => {
  return httpInstance({
    url: '/home/goods'
  })
}