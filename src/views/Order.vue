<template>
    <div class="order">
        <!-- 我的订单头部 -->
        <div class="order-header">
            <div class="order-header-content">
                <p>
                    <i class="el-icon-s-order" style="font-size: 30px;color: #ff6700;"></i>
                    我的订单
                </p>
            </div>
        </div>
        <!-- 我的订单头部END -->

        <!-- 我的订单主要内容 -->

        <div v-if="orders.length > 0"
             style="width: 80%;margin: 0 auto;background: #fff;text-align: center" >
            <el-table
                    :data="orders"

                    :row-key="(row) => row.orderNo"
                    @cell-click="jumpToDetail"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-table
                                :data="props.row.womanMallOrderItemVOS"
                                style="width: 100%">
                            <el-table-column label="商品"  min-width="90px"
                                             :show-overflow-tooltip="true">
                                <template slot-scope="{row}">
                                  <router-link :to="{ path: `/goods/${row.goodsId}`}">
                                    <el-image style="width: 90px; height: 90px; float: left;" :src="row.goodsCoverImg" fit="fill"></el-image>
                                  </router-link>
                                    
                                    <!--<span>{{ row.url }}</span>-->
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="goodsName"
                                    label="商品名称"
                                    min-width="90px"
                                    >
                            </el-table-column>
                            <el-table-column
                                    prop="sellingPrice"
                                    label="售价">
                            </el-table-column>
                            <el-table-column
                                    prop="goodsCount"
                                    label="数量">
                            </el-table-column>
                        </el-table>
                        <!--<ul>-->
                            <!--<li  v-for="(o, index) in props.row.womanMallOrderItemVOS" >-->
                                <!--<span><img :src="o.goodsCoverImg" style="width: 60px;"-->
                                                              <!--alt=""></span>-->
                                <!--<span>{{ o.goodsName }}</span>-->
                                <!--<span>{{ o.sellingPrice }}</span>-->
                                <!--<span>{{ o.goodsCount }}</span>-->
                            <!--</li>-->
                        <!--</ul>-->
                        <!--<el-form label-position="left" inline class="demo-table-expand">-->
                            <!--<el-form-item label="商品名称">-->

                            <!--</el-form-item>-->
                        <!--</el-form>-->
                    </template>
                </el-table-column>
                <el-table-column
                        prop="orderNo"
                        label="订单号"
                >
                </el-table-column>
                <el-table-column
                        prop="totalPrice"
                        label="订单价格"
                        sortable
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="payType"
                        label="订单支付方式">
                </el-table-column>
                <el-table-column
                        prop="orderStatusString"
                        label="订单状态"
                        sortable
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间">
                </el-table-column>
            </el-table>

            <div style="text-align: right;padding: 10px">
                <el-pagination
                        layout="prev, pager, next"
                        @current-change="currentChange"
                        :page-count="totalPage"
                        :page-size="pageSize"
                        :current-page="currentPage"
                        :total="totalCount">
                </el-pagination>
            </div>

        </div>
        <!--<div class="order-content" v-if="orders.length > 0">-->
                 <!--<el-table-->
                    <!--ref="multipleTable"-->
                    <!--:data="orders"-->
                    <!--tooltip-effect="dark"-->
                    <!--style="width: 1225px;margin: 0 auto;"-->
                    <!--@selection-change="handleSelectionChange"-->
                <!--&gt;-->
                    <!--<el-table-column type="selection" label="全选" width="100" />-->
                    <!--<el-table-column label="商品名称"  width="400">-->
                        <!--<template slot-scope="scope">-->
                            <!--<img :src="scope.row.img" alt="" style="float: left;width: 80px;maxHeight: 100px;">-->
                            <!--<p style="float: left;lineHeight: 80px;marginLeft: 40px;">{{scope.row.name}}</p>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column label="单价"  width="140" >-->
                        <!--<template slot-scope="scope">-->
                            <!--<span>{{scope.row.price}}元</span>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column label="数量" width="240">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-input-number v-model="scope.row.number" :min="1" :max="100" :disabled="scope.row.isNumber"></el-input-number>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column label="小计"  width="140" >-->
                        <!--<template slot-scope="scope">-->
                            <!--<span style="color: orange">-->
                                <!--{{scope.row.price * scope.row.number}}元-->
                            <!--</span>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column label="操作"  width="140" >-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-link type="primary" style="marginRight: 40px;" @click="jumpToDetail(scope.row)">详情</el-link>-->
                            <!--<el-link type="danger" @click="deleteOrder(scope.row.id)">删除</el-link>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                <!--</el-table>-->
               <!---->
                <!--<div class="order-bar" style="margin: 0 auto;">-->
                    <!--<div class="order-bar-left">-->
                        <!--<span class="order-total">-->
                            <!--共-->
                            <!--<span class="order-total-num">{{ total.totalNum }}</span> 件商品-->
                            <!--已选 <span class="order-total-num"> {{ total.chooseNum }} </span> 件商品-->
                        <!--</span>-->
                    <!--</div>-->
                    <!--<div class="order-bar-right">-->
                        <!--<span>-->
                            <!--<span class="total-price-title">合计：</span>-->
                            <!--<span class="total-price">{{ total.totalPrice }}元</span>-->
                        <!--</span>-->
                        <!--<el-button type="primary" style="margin:0 0 10px 20px;">去结算</el-button>-->
                    <!--</div>-->
                <!--</div>-->
            <!--<div style="margin-top:-40px;"></div>-->
        <!--</div>-->
        <!-- 我的订单主要内容END -->

        <!-- 订单为空的时候显示的内容 -->
        <div v-else class="order-empty">
            <div class="empty">
                <h2>您的订单还是空的！</h2>
                <p>快去购物吧！</p>
            </div>
        </div>
        <!-- 订单为空的时候显示的内容END -->
    </div>
</template>
<script>
import apiData from '@/lib/apiData';
export default {
    data() {
        return {
            orders: [],
            total: {
                totalNum: 0,
                chooseNum: 0,
                totalPrice: 0
            }, // 每个订单的商品数量及总价列表
          totalCount:0,
          totalPage:0,
          pageSize:5,
          currentPage:1,
        }
    },
    activated() {
        // 获取订单数据
        // this.getOrder()
    },
    watch: {
        orders: {
            handler(val) {
                if(val) {
                    this.total.totalNum = val.length
                }
            },
            immediate: true
        },
      $route(){
        this.getOrderList();
      },
    },
  created() {
    this.getOrderList(1);
  },
    methods: {
      getOrderList(pageNumber){
        debugger
        this.$axios.get(`${apiData.order}?pageNumber=${pageNumber}`).then(res => {
          this.orders = res.data.data.list;
          this.totalCount=res.data.data.totalCount;
            this.totalPage=res.data.data.totalPage;
        })
      },
      currentChange(value){
        this.getOrderList(value);
      },
        handleSelectionChange(val) {
            if(val) {
                this.total.chooseNum = val.length;
                var totalPrice = 0;
                val.forEach(item => {
                    item.isNumber = false;
                    totalPrice += item.price * item.number;
                });
                this.total.totalPrice = totalPrice;
            }
        },
        jumpToDetail(row, column, cell, event) {
        console.log(row, column, cell, event)
          if(column.property == "orderNo"){
            this.$router.push({name:'OrderDetail',params: {id:row.orderNo}})
          }
            // this.$router.push({
            //     name: 'Details',
            //     params: {
            //         categoryID: id
            //     }
            // })
        },
        getOrder() {
            this.$http
                .post('/api/user/order/getOrder', {
                    user_id: this.$store.getters.getUser.user_id,
                })
                .then((res) => {
                    if (res.data.code === '001') {
                        this.orders = res.data.orders
                        // 002订单为空
                    } else if (res.data.code === '002') {
                        this.orders = []
                        this.notifyError(res.data.msg)
                    }
                })
                .catch((err) => {
                    return Promise.reject(err)
                })
        },
        // 删除
        deleteOrder({id}) {
            this.$http.post(apiData.deleteOrder, {
                id: id
            }).then(res => {
                if(res.code == 1) {
                    this.notifySucceed(res.msg);
                    this.getOrder();
                }else{
                    this.notifyError(res.msg);
                }
            })
        }
    },
}
</script>
<style scoped>
.order {
    background-color: #f5f5f5;
    padding-bottom: 20px;
}
/* 我的订单头部CSS */
.order .order-header {
    height: 64px;
    border-bottom: 2px solid #ff6700;
    background-color: #fff;
    margin-bottom: 20px;
}
.order .order-header .order-header-content {
    width: 1225px;
    margin: 0 auto;
}
.order .order-header p {
    font-size: 28px;
    line-height: 58px;
    float: left;
    font-weight: normal;
    color: #424242;
}
/* 我的订单头部CSS END */
.order .content {
    width: 1225px;
    margin: 0 auto;
    background-color: #fff;
    margin-bottom: 50px;
}

.order .content ul {
    background-color: #fff;
    color: #424242;
    line-height: 85px;
}
/* 我的订单表头CSS */
.order .content ul .order-info {
    height: 60px;
    line-height: 60px;
    padding: 0 26px;
    color: #424242;
    border-bottom: 1px solid #ff6700;
}
.order .content ul .order-info .order-id {
    float: left;
    color: #ff6700;
}
.order .content ul .order-info .order-del {
    float: right;
    margin-right: 10px;
}
.order .content ul .order-info .order-time {
    /* float: right; */
    text-align: center;
}

.order .content ul .header {
    height: 85px;
    padding-right: 26px;
    color: #424242;
}
/* 我的订单表头CSS END */

/* 订单列表CSS */
.order .content ul .product-list {
    height: 85px;
    padding: 15px 26px 15px 0;
    border-top: 1px solid #e0e0e0;
}
.order .content ul .pro-img {
    float: left;
    height: 85px;
    width: 120px;
    padding-left: 80px;
}
.order .content ul .pro-img img {
    height: 80px;
    width: 80px;
}
.order .content ul .pro-name {
    float: left;
    width: 380px;
}
.order .content ul .pro-name a {
    color: #424242;
}
.order .content ul .pro-name a:hover {
    color: #ff6700;
}
.order .content ul .pro-price {
    float: left;
    width: 160px;
    padding-right: 18px;
    text-align: center;
}
.order .content ul .pro-num {
    float: left;
    width: 190px;
    text-align: center;
}
.order .content ul .pro-total {
    float: left;
    width: 160px;
    padding-right: 81px;
    text-align: right;
}
.order .content ul .pro-total-in {
    color: #ff6700;
}

.order .order-bar {
    width: 1185px;
    padding: 0 20px;
    border-top: 1px solid #ff6700;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
}
.order .order-bar .order-bar-left {
    float: left;
}
.order .order-bar .order-bar-left .order-total {
    color: #757575;
}
.order .order-bar .order-bar-left .order-total-num {
    color: #ff6700;
}
.order .order-bar .order-bar-right {
    float: right;
}
.order .order-bar .order-bar-right .total-price-title {
    color: #ff6700;
    font-size: 14px;
}
.order .order-bar .order-bar-right .total-price {
    color: #ff6700;
    font-size: 30px;
}
/* 订单列表CSS END */

/* 订单为空的时候显示的内容CSS */
.order .order-empty {
    width: 1225px;
    margin: 0 auto;
}
.order .order-empty .empty {
    height: 300px;
    padding: 0 0 130px 558px;
    margin: 65px 0 0;
    background: url(../assets/imgs/cart-empty.png) no-repeat 124px 0;
    color: #b0b0b0;
    overflow: hidden;
}
.order .order-empty .empty h2 {
    margin: 70px 0 15px;
    font-size: 36px;
}
.order .order-empty .empty p {
    margin: 0 0 20px;
    font-size: 20px;
}
/* 订单为空的时候显示的内容CSS END */
</style>
