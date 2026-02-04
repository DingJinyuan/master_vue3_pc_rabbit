//获取banner
import { onMounted, ref } from 'vue';
import { getBannerAPI } from '@/apis/home'
export function useBanner(){
const BannerList = ref([])
const getBanner = async () => {
  const res = await getBannerAPI({ distributionSite: 2 })
  //console.log(res)
  BannerList.value = res.result
}
onMounted(() => {
  getBanner()
})
return {BannerList}    
}
