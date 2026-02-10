//封装倒计时函数
import { ref, computed, onUnmounted } from "vue";
import dayjs from "dayjs";
export const useCountDown = () => {
  //1.响应式数据
  let timer = null;
  const time = ref(0);
  //格式化数据为xx分xx秒 计算属性已经存在的响应式数据做计算
  const formatTime = computed(() => dayjs.unix(time.value).format("mm分ss秒"));
  //2.开启倒计时函数
  const start = (currentTime) => {
    // 优化：清除旧定时器，避免重复开启导致倒计时加速
    if (timer) clearInterval(timer);
    //编写开始倒计时逻辑
    time.value = currentTime;

    //定时器可能出现内存溢出
    timer = setInterval(() => {
      if (time.value <= 0) {
        clearInterval(timer);
        timer = null;
        return;
      }
      time.value--;
    }, 1000);
  };
  //组件销毁时清除定时器
  onUnmounted(() => {
    timer && clearInterval(timer);
  });
  return {
    formatTime,
    start,
  };
};
