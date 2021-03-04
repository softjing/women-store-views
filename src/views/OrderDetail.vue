<template>
  <div class="orderDetail">
    <!-- 我的订单头部 -->
    <div class="order-header">
      <div class="order-header-content">
        <p>
          <i
            class="el-icon-s-order"
            style="font-size: 30px;color: #ff6700;"
          ></i>
          我的订单详情
        </p>
        <router-link to="/order">返回订单列表</router-link>
      </div>
    </div>
    <!-- 我的订单头部END -->

    <!-- 我的订单主要内容 -->
    <div class="order-content">
      <el-row class="order-content-ttem">
        <el-col :span="12"
          ><div>订单号:{{ ordersDetails.orderNo }}</div></el-col
        >
        <el-col :span="12"
          ><div>订单状态:{{ ordersDetails.orderStatusString }}</div></el-col
        >
      </el-row>
      <el-row v-if="ordersDetails.payStatus" class="order-content-ttem">
        <el-col :span="12"
          ><div>订单支付方式:{{ ordersDetails.payTypeString }}</div></el-col
        >
        <el-col :span="12"
          ><div>订单支付时间:{{ ordersDetails.payTime }}</div></el-col
        >
      </el-row>
      <el-row class="order-content-ttem">
        <el-col :span="12"
          ><div>订单价格:{{ ordersDetails.totalPrice }}</div></el-col
        >
        <el-col :span="12"
          ><div>创建时间:{{ ordersDetails.createTime }}</div></el-col
        >
      </el-row>
      <HR style="border:1px dashed #999;margin:15px 0" width="100%" />
      <el-table :data="ordersDetails.womanMallOrderItemVOS" style="width: 100%">
        <el-table-column
          label="商品"
          min-width="90px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <router-link :to="{ path: `/goods/${row.goodsId}` }">
              <el-image
                style="width: 90px; height: 90px; float: left;"
                :src="row.goodsCoverImg"
                fit="fill"
              ></el-image>
            </router-link>
            <!--<span>{{ row.url }}</span>-->
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="90px">
        </el-table-column>
        <el-table-column prop="sellingPrice" label="售价"> </el-table-column>
        <el-table-column label="尺码"> 
           <template slot-scope="{ row }">
            <span>{{row.goodsSize?row.goodsSize+'码' : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsCount" label="数量"> </el-table-column>
        <el-table-column label="操作" v-if="ordersDetails.orderStatus==4">
          <template slot-scope="{ row }">
            <!-- contentStatus   1已评论 0未评论 -->
            <el-button size="mini" @click="showDialog(row.goodsId,row.goodsSize)"
              v-if="row.contentStatus == 0" >立即评价</el-button>
            <el-button size="mini" v-else disabled>已评价</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="btn-box">
        <!-- 0.待支付 1.待确认 2.待发货 3:已发货 4.交易成功 -->
        <el-button
          @click="cancelOperate"
          v-if="
            ordersDetails.orderStatus == 0 || ordersDetails.orderStatus == 1
          "
          >取消订单</el-button
        >
        <el-button
          type="danger"
          @click="endOperate"
          v-if="ordersDetails.orderStatus == 0"
          style="width: 200px"
          >支付</el-button
        >
        <el-button
          type="success"
          @click="endOperate"
          v-if="ordersDetails.orderStatus == 3"
          style="width: 200px"
          >确认收货</el-button
        >
      </div>
    </div>
    <!-- 模拟支付 -->

    <el-dialog title="支付" :visible.sync="drawer" width="30%">
      <el-select v-model="payType" placeholder="选择支付方式">
        <el-option label="无" :value="0"></el-option>
        <el-option label="支付宝" :value="1"></el-option>
        <el-option label="微信" :value="2"></el-option>
      </el-select>
      <div style="text-align: right; margin: 10px 0 0">
        <el-button type="primary" size="mini" @click="paySuccessBtn"
          >确定
        </el-button>
      </div>
    </el-dialog>
    <!--<el-drawer-->
    <!--title="支付方式"-->
    <!--:visible.sync="drawer"-->
    <!--direction="btt"-->
    <!--&gt;-->

    <!--</el-drawer>-->
    <!-- 我的订单主要内容END -->
    <!-- 立即评价弹框 -->
    <el-dialog title="立即评价" :visible.sync="dialogFormVisible">
      <el-form :model="commentForm" :rules="rules" ref="commentForm">
        <el-form-item prop="val">
          <el-input
            type="textarea"
            :rows="5"
            v-model="commentForm.val"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('commentForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('commentForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import apiData from "@/lib/apiData";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      ordersDetails: {},
      drawer: false,
      payType: 0,
      orderNo: "",
      id: "",//评价的商品id
      goodsSize:"",//评价商品的尺码
      userId:'',//用户id
      dialogFormVisible: false,
      commentForm: {
        val: ""
      },
      rules: {
        val: [{ required: true, message: "请填写评价内容", trigger: "blur" }]
      }
    };
  },
  activated() {
    // 获取订单数据
    // this.getOrder()
  },
  watch: {
    $route() {
      if (this.$route.params.id) {
        this.getOrderDetail();
      }
    }
  },
  created() {
    this.getOrderDetail();
    this.$axios.get(apiData.getAddress).then(res => {
                if(res.data.resultCode == 200) {
                    this.userId = res.data.data[0] && res.data.data[0].userId
                }
            })
  },

  // beforeUpdate() {
  //   this.getOrderDetail();
  // },
  methods: {
    ...mapActions([
      "setUser",
      "setShowLogin",
      "setShoppingCart",
      "setShowAgreement",
      "setToken"
    ]),
    getOrderDetail() {
      this.$axios.get(`${apiData.order}/${this.$route.params.id}`).then(res => {
        if (res.data.resultCode == "200") {
          this.ordersDetails = res.data.data;
        }
      });
    },
    paySuccessBtn() {
      console.log(this.payType);
      this.$axios
        .get(
          `${apiData.paySuccess}?orderNo=${this.ordersDetails.orderNo}&payType=${this.payType}`
        )
        .then(res => {
          this.drawer = false;
          if (res.data.resultCode == "200") {
            this.notifySucceed("支付成功");
          } else {
            this.notifySucceed(res.data.message);
          }
          this.getOrderDetail();
        })
        .catch(err => {
          return Promise.reject(err);
        });
    },
    endOperate() {
      //确认收货
      if (this.ordersDetails.payStatus) {
        this.$axios
          .put(`${apiData.order}/${this.$route.params.id}/finish`)
          .then(res => {
            if (res.data.resultCode == "200") {
              this.notifySucceed("成功");
              this.getOrderDetail();
            } else {
              this.notifyError(data.message);
            }
          });
      } else {
        this.drawer = true;
        //去结算
        // this.$axios.get(`${apiData.order}/${this.$route.params.id}`).then(res => {
        //   this.ordersDetails = res.data.data;
        // })
      }
    },
    showDialog(id,goodsSize) {
      // 存储当前评价商品id
      this.id = id;
      this.goodsSize = goodsSize
      // 打开评价弹窗
      this.dialogFormVisible = true;
    },
    resetForm(formName) {
      this.id = "";
      this.goodsSize = "";
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const userInfo = (localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo'))) || {}
          this.$axios.post(apiData.comment,{
            goodsId: this.id,
            orderId: this.ordersDetails.orderNo,
            content: this[formName].val,
            userId: this.userId,
            goodsSize:this.goodsSize
            // createTime:new Date(),
            // mallUser: {
            //   userId: this.userId,
            //   nickName:userInfo.nickName ,
            //   loginName:userInfo.loginName,
            // }
      })
      .then(res => {
            const {data} = res
            if (res.data.resultCode == "200") {
              this.notifySucceed("评论成功");
              this.resetForm(formName)
              //重新获取订单详情页数据 更新评价状态
              this.getOrderDetail();
            } else {
              this.notifyError(data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    cancelOperate() {
      //取消订单
      this.$axios
        .put(`${apiData.order}/${this.$route.params.id}/cancel`)
        .then(res => {
          if (res.data.resultCode == "200") {
            this.notifySucceed("成功");
            this.getOrderDetail();
          } else {
            this.notifyError(data.message);
          }
        });
    }
  }
};
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.orderDetail .order-header p {
  font-size: 28px;
  line-height: 58px;
  float: left;
  font-weight: normal;
  color: #424242;
}
.orderDetail .order-content {
  width: 80%;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
}
.orderDetail .order-content .order-content-ttem {
  padding: 10px 0;
}
.orderDetail .btn-box {
  text-align: right;
  margin-top: 20px;
}
</style>
