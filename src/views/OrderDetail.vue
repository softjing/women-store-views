<template>
    <div class="orderDetail">
        <!-- 我的订单头部 -->
        <div class="order-header">
            <div class="order-header-content">
                <p>
                    <i class="el-icon-s-order" style="font-size: 30px;color: #ff6700;"></i>
                    我的订单详情
                </p>
            </div>
        </div>
        <!-- 我的订单头部END -->

        <!-- 我的订单主要内容 -->
        <div class="order-content">
            <el-row class="order-content-ttem">
                <el-col :span="12"><div>订单号:{{ordersDetails.orderNo}}</div></el-col>
                <el-col :span="12"><div>订单状态:{{ordersDetails.orderStatusString}}</div></el-col>
            </el-row>
            <el-row v-if="ordersDetails.payStatus" class="order-content-ttem">
                <el-col :span="12" ><div>订单支付方式:{{ordersDetails.payTypeString}}</div></el-col>
                <el-col :span="12" ><div>订单支付时间:{{ordersDetails.payTime}}</div></el-col>
            </el-row>
            <el-row class="order-content-ttem">
                <el-col :span="12" ><div>订单价格:{{ordersDetails.totalPrice}}</div></el-col>
                <el-col :span="12"><div>创建时间:{{ordersDetails.createTime}}</div></el-col>
            </el-row>
            <HR style="border:1px dashed #999;margin:15px 0" width="100%"  />
            <el-table
                    :data="ordersDetails.womanMallOrderItemVOS"
                    style="width: 100%">
                <el-table-column label="商品"  min-width="90px"
                                 :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                        <el-image style="width: 90px; height: 90px; float: left;" :src="row.goodsCoverImg" fit="fill"></el-image>
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
        </div>
        <!-- 我的订单主要内容END -->
    </div>
</template>
<script>
import apiData from '@/lib/apiData';
export default {
    data() {
        return {
            ordersDetails: {},
        }
    },
    activated() {
        // 获取订单数据
        // this.getOrder()
    },
  watch: {
    $route(){
      this.getOrderDetail();
    },

  },
  created() {
    this.getOrderDetail();
  },

  // beforeUpdate() {
  //   this.getOrderDetail();
  // },
    methods: {
      getOrderDetail(){
        this.$axios.get(`${apiData.order}/${this.$route.params.id}`).then(res => {
          this.ordersDetails = res.data.data;
        })
      },
    },
}
</script>
<style scoped>
.orderDetail {
    background-color: #f5f5f5;
    padding-bottom: 20px;
}
/* 我的订单头部CSS */
.orderDetail .order-header {
    height: 64px;
    border-bottom: 2px solid #ff6700;
    background-color: #fff;
    margin-bottom: 20px;
}
.orderDetail .order-header .order-header-content {
    width: 1225px;
    margin: 0 auto;
}
.orderDetail .order-header p {
    font-size: 28px;
    line-height: 58px;
    float: left;
    font-weight: normal;
    color: #424242;
}
.orderDetail .order-content{
    width: 80%;margin: 0 auto;background: #fff;padding:20px
}
.orderDetail .order-content .order-content-ttem{
    padding:10px 0;
}
</style>
