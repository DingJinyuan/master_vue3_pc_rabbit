import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
//引入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass' // 关键！告诉插件加载SCSS而非默认CSS
      })],
    }),
    // 新增：Components 插件配置
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass' // 关键配置，缺一不可
      })],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 导入自定义SCSS变量文件
        additionalData: `@use "@/styles/element/index.scss" as *;\n`,
        // 补3：开启JS兼容（避免部分SCSS语法报错）
        javascriptEnabled: true,
      },
    },
  }
})
