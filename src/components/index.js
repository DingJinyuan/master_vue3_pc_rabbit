//把components下面的所有组件进行全局化注册
//通过插件
import ImageView from './imageView'
import Sku from './XtxSku'
export const componentPlugin={
    install(app){
    //app.components('组件名字'，组件配置对象)
    app.component('XtxImageView',ImageView),
    app.component('XtxSku',Sku)
    }
}