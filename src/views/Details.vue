<template>
    <div id="details">
        <!-- 主要内容 -->
        <div class="main">
            <!-- 左侧商品轮播图 -->
            <div class="block">
              <my-magnify :previewImg="productDetails.goodsCoverImg" :zoomImg="productDetails.goodsCoverImg"></my-magnify>
                <!-- <el-carousel height="560px" v-if="productPicture.length > 1">
                    <el-carousel-item v-for="item in productPicture" :key="item.id">
                        <img style="height:560px;" :src="item.product_picture" :alt="item.intro" />
                    </el-carousel-item>
                </el-carousel>
                <div v-if="productPicture.length == 1">
                    <img style="height:560px;" :src="productPicture[0].product_picture" :alt="productPicture[0].intro" />
                </div> -->
            </div>
            <!-- 左侧商品轮播图END -->

            <!-- 右侧内容区 -->
            <div class="content">
                <h1 class="name">{{ productDetails.goodsName }}</h1>
                <p class="intro">{{ productDetails.goodsIntro }}</p>
                <p class="store">{{productDetails.tag}}</p>
                <!-- <div class="price">
                    <span>{{ productDetails.sellingPrice }}元</span>
                    <span v-show="productDetails.originalPrice != productDetails.sellingPrice" class="del"
                        >{{ productDetails.originalPrice }}元</span
                    >
                </div> -->
                <div style="margin-top: 30px" v-if="productDetails.goodsStockList && productDetails.goodsStockList.length > 0">
                  <span>尺码：&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <el-radio-group v-model="size" size="medium" fill='#f25807' >
                    <el-radio-button v-for="(val,i) in productDetails.goodsStockList" :key="i" :label="val.goodsSize" :disabled="val.goodsStockNum == 0 || !val.goodsStockNum">{{val.goodsSize}}码</el-radio-button>
                  </el-radio-group>
                </div>
                <div class="pro-list">
                    <!-- <span class="pro-name">{{ productDetails.goodsName }}</span> -->
                    <span class="pro-price">
                        <span v-show="productDetails.originalPrice != productDetails.sellingPrice" class="pro-del"
                            >原价：{{ productDetails.originalPrice }}元</span
                        >
                        <span style='color:orange'>售价：{{ productDetails.sellingPrice }}元</span>
                    </span>
                    <!-- <p class="price-sum">总计 : {{ productDetails.sellingPrice }}元</p> -->
                </div>
                <!-- 内容区底部按钮 -->
                <div class="button">
                    <el-button class="shop-cart" :disabled="dis" @click="addShoppingCart">
                        {{ notCart ? '已加入购物车' : '加入购物车' }}
                    </el-button>
                    <!--<el-button class="like" @click="addCollect">喜欢</el-button>-->
                </div>
                <!-- 内容区底部按钮END -->
                <div class="pro-policy">
                    <ul>
                        <li><i class="el-icon-circle-check"></i> 7天无理由退货</li>
                        <li><i class="el-icon-circle-check"></i> 7天价格保护</li>
                    </ul>
                </div>
            </div>
            <!-- 右侧内容区END -->
        </div>
        <!-- 主要内容END -->
        <div class="evaluate-wrapper content-warp">
          <h1 class="title">商品详情</h1>
          <div class="content">
            <img :src="productDetails.goodsDetailContent" alt="">
          </div>
          
        </div>
        <!-- 评论 -->
        <ul class="evaluate-wrapper">
          <h1 class="title">商品评价</h1>
            <li v-for="item in evaluate" :key="item.id">
                <div class="evaluate-wrapper-top">
                    <img :src="item.avatar" alt="" class="avatar">
                    <span class="name">{{item.name}}</span>
                    <!-- <span class="time">发布时间： {{item.time}}||''</span> -->
                </div>
                <div class="evaluate-wrapper-center">
                    <p>{{item.evaluate}}</p>
                    <!-- <div v-if="item.imgs.length > 0">
                        <img v-for="(it, i) in item.imgs" :key="i" :src="it" alt="" @click="showReview(it)">
                    </div> -->
                </div>
            </li>
        </ul>
        <el-dialog
            :visible.sync="showImg"
            width="30%"
            :close-on-click-modal="false"
        >
            <img :src="this.reviewImg" alt="">
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import apiData from '@/lib/apiData';
import MyMagnify from "@/components/Magnify.vue";
export default {
    data() {
        return {
          imgs:[
'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2856846879,389279115&fm=26&gp=0.jpg',
'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3392663359,4194879068&fm=26&gp=0.jpg'
          ],
            size:'',
            reviewImg: '',
            showImg: false,
            dis: false, // 控制“加入购物车按钮是否可用”
            productID: '', // 商品id
            productDetails: {
                goodsName: '衣服1',
                goodsIntro: '舒服好看，物美价廉',
                sellingPrice: 100,
                originalPrice: 199,

            }, // 商品详细信息
            productPicture: [
                {
                    product_picture: 'https://g-search1.alicdn.com/img/bao/uploaded/i4/i2/199343403/O1CN01DtT3QB1b0cTHfYtyR_!!0-item_pic.jpg_250x250.jpg',
                    intro: '衣服1'
                },
                {
                    product_picture: 'https://img.alicdn.com/bao/uploaded/i1/92688455/O1CN01luycfl2CKRMkUneZV_!!92688455.jpg_b.jpg',
                    intro: '衣服2'
                }
            ], // 商品图片
            notCart: false,
            // 评论列表
            evaluate: [
            ],
        }
    },
    components: {
    MyMagnify
  },
    // 通过路由获取商品id
    activated() {
        this.goodsId = this.$route.params.categoryID
        this.getDetails();
    },
    watch: {
        // 监听商品id的变化，请求后端获取商品数据
        goodsId: function(val) {
          this.getDetails(val)
          this.getDetailsPicture(val)
        },
    },
    mounted() {
        // this.getDetails();
    },
    methods: {
        ...mapActions(['unshiftShoppingCart', 'addShoppingCartNum','setShoppingCart']),
        showReview(img) {
            this.reviewImg = img;
            this.showImg = true;
        },
        // 获取商品详细信息
        getDetails(val) {
          this.$axios
            .get(apiData.goodsDetail+this.$route.params.categoryID)
                .then((res) => {
                  const {data} = res
                  if(data.resultCode == 200){
                    this.productDetails = data.data
                  }else{
                    this.notifyError(data.message)
                  }
                })
                .catch((err) => {
                    return Promise.reject(err)
                })
            this.$axios
            .get(apiData.getComment+'?goodsIds='+this.$route.params.categoryID)
                .then((res) => {
                  const {data} = res
                  if(data.resultCode == 200){
                    this.evaluate = data.data.map((val,i)=>({
                      name: '匿名用户',
                      evaluate:val.content,
                      avatar:i%2==0?this.imgs[0]:this.imgs[1],
                      id:i
                    }))
                  }else{
                    this.notifyError(data.message)
                  }
                })
                .catch((err) => {
                    return Promise.reject(err)
                })
        },
        // 获取商品图片
        getDetailsPicture(val) {
            this.$axios
                .post('/api/product/getDetailsPicture', {
                    productID: val,
                })
                .then((res) => {
                    this.productPicture = res.data.ProductPicture
                })
                .catch((err) => {
                    return Promise.reject(err)
                })
        },
        getShopCart(){
          // 用户已经登录,获取该用户的购物车信息
          this.$axios
              .get(apiData.shopCart)
              .then((res) => {
                const {data} = res
                  if (data.resultCode == '200') {
                      this.setShoppingCart(data.data)
                  } else {
                      // 提示失败信息
                      this.notifyError(data.message)
                  }
              })
              .catch((err) => {
                  return Promise.reject(err)
              })
        },
        // 加入购物车
        addShoppingCart() {
            // 判断是否登录,没有登录则显示登录组件
            if(!localStorage.getItem('token')){
                this.notifyError('您还未登录')
                return
            }
            if(!this.size){
              this.notifyError('请选择尺码')
              return
            }
            this.$axios
                .post(apiData.shopCart, {
                    goodsCount: 1,
                    goodsId: this.goodsId,
                    goodsSize:this.size
                })
                .then((res) => {
                    this.notCart = true
                    const {data} = res

                    if(data.resultCode == 200){
                      // 添加购物车后 重新获取购物车数据 更新购物车数量值
                      this.getShopCart()
                      // this.unshiftShoppingCart(data.shoppingCartData && data.shoppingCartData[0])
                      this.notifySucceed('添加购物车成功')
                    }else{
                      this.notifyError(data.message)
                    }

                })
                .catch((err) => {
                    return Promise.reject(err)
                })
        },
        // 加入收藏
        addCollect() {
            // 判断是否登录,没有登录则显示登录组件
            if (!this.$store.getters.getUser) {
                this.$store.dispatch('setShowLogin', true)
                return
            }
            this.$axios
                .post('/api/user/collect/addCollect', {
                    user_id: this.$store.getters.getUser.user_id,
                    product_id: this.productID,
                })
                .then((res) => {
                    if (res.data.code == '001') {
                        // 添加收藏成功
                        this.notifySucceed(res.data.msg)
                    } else {
                        // 添加收藏失败
                        this.notifyError(res.data.msg)
                    }
                })
                .catch((err) => {
                    return Promise.reject(err)
                })
        },
    },
}
</script>

<style lang="scss" scoped>
    .evaluate-wrapper{
        width: 1225px;
        padding: 20px;
        margin: 0 auto;
        li{
            // border: 1px solid #ccc;
            padding: 20px 40px;
        }
        &-top{
            overflow: hidden;
            border-bottom: 1px dashed #ccc;
            .avatar{
                width: 30px;
                float: left;
                margin-right: 20px;
            }
            .name{
                float: left;
                line-height: 40px;
            }
            .time{
                float: right;
                color: grey;
            }
        }
        &-center{
            p{
                margin: 20px 0;
            }
            img{
                width: 60px;
                margin-right: 20px;
            }
        }
    }
</style>

<style>
/* 头部CSS */
#details .page-header {
    height: 64px;
    margin-top: -20px;
    z-index: 4;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
    -webkit-box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
}
#details .page-header .title {
    width: 1225px;
    height: 64px;
    line-height: 64px;
    font-size: 18px;
    font-weight: 400;
    color: #212121;
    margin: 0 auto;
}
#details .page-header .title p {
    float: left;
}
#details .page-header .title .list {
    height: 64px;
    float: right;
}
#details .page-header .title .list li {
    /* float: left; */
    display: inline-block;
    margin-left: 20px;
}
#details .page-header .title .list li a {
    font-size: 14px;
    color: #616161;
}
#details .page-header .title .list li a:hover {
    font-size: 14px;
    color: #ff6700;
}
/* 头部CSS END */

/* 主要内容CSS */
#details .main {
    width: 1225px;
    height: 560px;
    padding-top: 30px;
    margin: 0 auto;
}
#details .main .block {
    float: left;
    width: 560px;
    height: 560px;
}
#details .el-carousel .el-carousel__indicator .el-carousel__button {
    background-color: rgba(163, 163, 163, 0.8);
}
#details .main .content {
    float: left;
    margin-left: 25px;
    width: 640px;
}
#details .main .content .name {
    height: 30px;
    line-height: 30px;
    font-size: 24px;
    font-weight: normal;
    color: #212121;
}
#details .main .content .intro {
    color: #b0b0b0;
    padding-top: 10px;
}
#details .main .content .store {
    color: #ff6700;
    padding-top: 10px;
}
#details .main .content .price {
    display: block;
    font-size: 18px;
    color: #ff6700;
    border-bottom: 1px solid #e0e0e0;
    padding: 25px 0 25px;
}
#details .main .content .price .del {
    font-size: 14px;
    margin-left: 10px;
    color: #b0b0b0;
    text-decoration: line-through;
}
#details .main .content .pro-list {
    background: #f9f9fa;
    padding: 30px 60px;
    margin: 50px 0 50px;
}
#details .main .content .pro-list span {
    line-height: 30px;
    color: #616161;
}
#details .main .content .pro-list .pro-price {
    /* float: right; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size:20px;
}
#details .main .content .pro-list .pro-price .pro-del {
    /* margin-left: 10px; */
    text-decoration: line-through;
}
#details .main .content .pro-list .price-sum {
    color: #ff6700;
    font-size: 24px;
    padding-top: 20px;
}
#details .main .content .button {
    height: 55px;
    margin: 10px 0 20px 0;
}
#details .main .content .button .el-button {
    float: left;
    height: 55px;
    font-size: 16px;
    color: #fff;
    border: none;
    text-align: center;
}
#details .main .content .button .shop-cart {
    width: 340px;
    background-color: #ff6700;
}
#details .main .content .button .shop-cart:hover {
    background-color: #f25807;
}

#details .main .content .button .like {
    width: 260px;
    margin-left: 40px;
    background-color: #b0b0b0;
}
#details .main .content .button .like:hover {
    background-color: #757575;
}
#details .main .content .pro-policy li {
    float: left;
    margin-right: 20px;
    color: #b0b0b0;
}
.content-warp,.evaluate-wrapper{
      border: 1px solid #ccc;
}
.content img{
  width: 70%;
}
.title{
  font-weight: bold;
  height: 30px;
  line-height: 30px;
  border-top: 
}
/* 主要内容CSS END */
</style>
