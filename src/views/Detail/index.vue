<script setup lang="ts">
import { getDetail } from '@/apis/detail'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
//import XtxSku from'@/components/XtxSku'
import DetailHot from './components/DetailHot.vue';
import { ElMessage } from 'element-plus';
//import ImageView from '@/components/imageView'
import {useCartStore} from '@/stores/cartStore'
const cartStore=useCartStore()
const route = useRoute()
const goods = ref({})
const getGoods = async () => {
  const res = await getDetail(route.params.id)
  goods.value = res.result
  //console.log(res)
}
onMounted(() => {
  getGoods()
})

//sku
// 定义空对象，用于存储用户选中的SKU规格（比如{ skuId: 1001, specsText: "黑色 | 8GB+256GB" }）

let skuObj={}
//sku规格被操作时  
const skuChange=(sku)=>{
  console.log(sku)
  skuObj=sku  // 把选中的规格数据存到skuObj中
}
//count 储购买数量，默认值1（页面上的数量显示/修改都基于这个变量）
const count=ref(1)
const countChange=(count)=>{
  //console.log(count)

}
//添加购物车
const addCart=()=>{
  // 先判断：是否选中了SKU规格（skuObj有skuId才代表选了）
  if(skuObj.skuId){
    //规则已经被选择，触发action
    // 选了规格：调用购物车仓库的addCart方法，传入加购的商品信息
    cartStore.addCart(
      {
        id:goods.value.id,
        name:goods.value.name,
        picture:goods.value.mainPictures[0],
        price:goods.value.price,
        count:count.value,
        skuId:skuObj.skuId,
        attrsText:skuObj.specsText,
        selected:true,
      }
    )
  }else{
    //规则没有被选择 // 没选规格：弹出提示，阻止加购
    ElMessage.warning('请选择规则')
  }
}
</script>

<template>
  <div class="xtx-goods-page">
    <div class="container" v-if="goods.details">
      <div class="bread-container">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <!-- 
            错误原因：goods一开始{}  {}.categories -> undefined  -> undefined[1]
            第一步：初始化阶段 → 读取 undefined 的属性
你的 goods 初始值是 ref({})，页面渲染时：
goods.value = {} → goods.categories 是 undefined；
代码试图读取 undefined[1].id → 相当于 (undefined)[1] → 直接触发 TypeError 报错。
第二步：数据加载后 → 可能的隐性错误
即使接口返回了 goods.categories，仍有风险：
如果 categories 是空数组：goods.categories[1] 是 undefined，读取 .id 依然报错；
如果 categories 只有 1 个元素：goods.categories[1] 是 undefined，同样报错；
如果接口返回 categories 不是数组（比如 null）：还是报错。
            1. 可选链的语法?. 
            2. v-if手动控制渲染时机 保证只有数据存在才渲染
           -->
          <el-breadcrumb-item :to="{ path: `/category/${goods.categories?.[1].id}` }">{{ goods.categories?.[1].name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/category/sub/${goods.categories?.[0].id}` }">{{ goods.categories?.[0].name
            }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{goods.desc}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 商品信息 -->
      <div class="info-container">
        <div>
          <div class="goods-info">
            <div class="media">
              <!-- 图片预览区 -->
              <XtxImageView :image-list="goods.mainPictures"/>
              <!-- 统计数量 -->
              <ul class="goods-sales">
                <li>
                  <p>销量人气</p>
                  <p> {{ goods.salesCount }} </p>
                  <p><i class="iconfont icon-task-filling"></i>销量人气</p>
                </li>
                <li>
                  <p>商品评价</p>
                  <p>{{ goods.commentCount }}</p>
                  <p><i class="iconfont icon-comment-filling"></i>查看评价</p>
                </li>
                <li>
                  <p>收藏人气</p>
                  <p>{{ goods.collectCount }}</p>
                  <p><i class="iconfont icon-favorite-filling"></i>收藏商品</p>
                </li>
                <li>
                  <p>品牌信息</p>
                  <p>{{ goods.brand?.name }}</p>
                  <p><i class="iconfont icon-dynamic-filling"></i>品牌主页</p>
                </li>
              </ul>
            </div>
            <div class="spec">
              <!-- 商品信息区 -->
              <p class="g-name">{{ goods.name }} </p>
              <p class="g-desc">{{ goods.desc }} </p>
              <p class="g-price">
                <span>{{ goods.oldPrice }}</span>
                <span> {{ goods.newPrice }}</span>
              </p>
              <div class="g-service">
                <dl>
                  <dt>促销</dt>
                  <dd>12月好物放送，App领券购买直降120元</dd>
                </dl>
                <dl>
                  <dt>服务</dt>
                  <dd>
                    <span>无忧退货</span>
                    <span>快速退款</span>
                    <span>免费包邮</span>
                    <a href="javascript:;">了解详情</a>
                  </dd>
                </dl>
              </div>
              <!-- sku组件 -->
              <XtxSku :goods="goods" @change="skuChange"/>
              <!-- 数据组件 -->
              <el-input-number v-model="count" @change="countChange" />
              <!-- 按钮组件 -->
              <div>
                <el-button size="large" class="btn" @click="addCart">
                  加入购物车
                </el-button>
              </div>

            </div>
          </div>
          <div class="goods-footer">
            <div class="goods-article">
              <!-- 商品详情 -->
              <div class="goods-tabs">
                <nav>
                  <a>商品详情</a>
                </nav>
                <div class="goods-detail">
                  <!-- 属性 -->
                  <ul class="attrs">
                    <li v-for="item in goods.details.properties" :key="item.value">
                      <span class="dt">{{ item.name }}</span>
                      <span class="dd">{{ item.value }}</span>
                    </li>
                  </ul>
                  <!-- 图片 -->
                  <img v-for="img in goods.details.pictures" :src="img" :key="img" alt="">
                </div>
              </div>
            </div>
            <!-- 24热榜+专题推荐 -->
            <div class="goods-aside">
              <!-- 24小时 -->
              <DetailHot :hot-type="1"/>
              <!-- 周 -->
              <DetailHot :hot-type="2"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang='scss'>
.xtx-goods-page {
  .goods-info {
    min-height: 600px;
    background: #fff;
    display: flex;

    .media {
      width: 580px;
      height: 600px;
      padding: 30px 50px;
    }

    .spec {
      flex: 1;
      padding: 30px 30px 30px 0;
    }
  }

  .goods-footer {
    display: flex;
    margin-top: 20px;

    .goods-article {
      width: 940px;
      margin-right: 20px;
    }

    .goods-aside {
      width: 280px;
      min-height: 1000px;
    }
  }

  .goods-tabs {
    min-height: 600px;
    background: #fff;
  }

  .goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
  }

  .number-box {
    display: flex;
    align-items: center;

    .label {
      width: 60px;
      color: #999;
      padding-left: 10px;
    }
  }

  .g-name {
    font-size: 22px;
  }

  .g-desc {
    color: #999;
    margin-top: 10px;
  }

  .g-price {
    margin-top: 10px;

    span {
      &::before {
        content: "¥";
        font-size: 14px;
      }

      &:first-child {
        color: $priceColor;
        margin-right: 10px;
        font-size: 22px;
      }

      &:last-child {
        color: #999;
        text-decoration: line-through;
        font-size: 16px;
      }
    }
  }

  .g-service {
    background: #f5f5f5;
    width: 500px;
    padding: 20px 10px 0 10px;
    margin-top: 10px;

    dl {
      padding-bottom: 20px;
      display: flex;
      align-items: center;

      dt {
        width: 50px;
        color: #999;
      }

      dd {
        color: #666;

        &:last-child {
          span {
            margin-right: 10px;

            &::before {
              content: "•";
              color: $xtxColor;
              margin-right: 2px;
            }
          }

          a {
            color: $xtxColor;
          }
        }
      }
    }
  }

  .goods-sales {
    display: flex;
    width: 400px;
    align-items: center;
    text-align: center;
    height: 140px;

    li {
      flex: 1;
      position: relative;

      ~li::after {
        position: absolute;
        top: 10px;
        left: 0;
        height: 60px;
        border-left: 1px solid #e4e4e4;
        content: "";
      }

      p {
        &:first-child {
          color: #999;
        }

        &:nth-child(2) {
          color: $priceColor;
          margin-top: 10px;
        }

        &:last-child {
          color: #666;
          margin-top: 10px;

          i {
            color: $xtxColor;
            font-size: 14px;
            margin-right: 2px;
          }

          &:hover {
            color: $xtxColor;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.goods-tabs {
  min-height: 600px;
  background: #fff;

  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;

      >span {
        color: $priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
    }
  }
}

.goods-detail {
  padding: 40px;

  .attrs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;

    li {
      display: flex;
      margin-bottom: 10px;
      width: 50%;

      .dt {
        width: 100px;
        color: #999;
      }

      .dd {
        flex: 1;
        color: #666;
      }
    }
  }

  >img {
    width: 100%;
  }
}

.btn {
  margin-top: 20px;

}

.bread-container {
  padding: 25px 0;
}
</style>