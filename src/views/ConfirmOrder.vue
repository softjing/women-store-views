<template>
    <div class="confirmOrder">
        <!-- 头部 -->
        <div class="confirmOrder-header">
            <div class="header-content">
                <p>
                    <i class="el-icon-s-order"></i>
                </p>
                <p>确认订单</p>
                <router-link to></router-link>
            </div>
        </div>
        <!-- 头部END -->

        <!-- 主要内容容器 -->
        <div class="content">
            <!-- 选择地址 -->
            <div class="section-address">
                <p class="title">收货地址</p>
                <div class="address-body">
                    <!--<ul>-->
                        <!--<li :class="item.defaultFlag == 1 ? 'in-section' : ''" v-for="item in address" :key="item.id">-->
                            <!--<h2>{{ item.name }}</h2>-->
                            <!--<p class="phone">{{ item.phone }}</p>-->
                            <!--<p class="address">{{ item.address }}</p>-->
                        <!--</li>-->
                        <!--<li class="add-address" @click="addAddress">-->
                            <!--<i class="el-icon-circle-plus-outline"></i>-->
                            <!--<p>添加新地址</p>-->
                        <!--</li>-->
                    <!--</ul>-->

                    <address-list :ismove="false" :isedit="false" :canEdit="true"
                                  :isshowdefault="true"
                                  @getAddressId="setAddressId" />

                </div>
            </div>
            <!-- 选择地址END -->

            <!-- 商品及优惠券 -->
            <div class="section-goods">
                <p class="title">暂无商品及优惠券</p>
                <div class="goods-list">
                    <ul>
                        <li v-for="item in getCheckGoods" :key="item.id">
                            <img :src="item.goodsCoverImg" />
                            <span class="pro-name">{{ item.goodsName }}</span>
                            <span class="pro-size">{{ item.goodsSize }}码</span>
                            <span class="pro-price">{{ item.sellingPrice }}元 x {{ item.goodsCount }}</span>
                            <span class="pro-status"></span>
                            <span class="pro-total">{{ item.sellingPrice * item.goodsCount }}元</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 商品及优惠券END -->

            <!-- 配送方式 -->
            <div class="section-shipment">
                <p class="title">配送方式</p>
                <p class="shipment">包邮</p>
            </div>
            <!-- 配送方式END -->

            <!-- 发票 -->
            <div class="section-invoice">
                <p class="title">发票</p>
                <p class="invoice">电子发票</p>
                <p class="invoice">个人</p>
                <p class="invoice">商品明细</p>
            </div>
            <!-- 发票END -->

            <!-- 结算列表 -->
            <div class="section-count">
                <div class="money-box">
                    <ul>
                        <li>
                            <span class="title">商品件数：</span>
                            <span class="value">{{ getCheckNum }}件</span>
                        </li>
                        <li>
                            <span class="title">商品总价：</span>
                            <span class="value">{{ getTotalPrice }}元</span>
                        </li>
                        <li>
                            <span class="title">活动优惠：</span>
                            <span class="value">-0元</span>
                        </li>
                        <li>
                            <span class="title">优惠券抵扣：</span>
                            <span class="value">-0元</span>
                        </li>
                        <li>
                            <span class="title">运费：</span>
                            <span class="value">0元</span>
                        </li>
                        <li class="total">
                            <span class="title">应付总额：</span>
                            <span class="value">
                                <span class="total-price">{{ getTotalPrice }}</span
                                >元
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 结算列表END -->

            <!-- 结算导航 -->
            <div class="section-bar">
                <div class="btn">
                    <router-link to="/shoppingCart" class="btn-base btn-return">返回购物车</router-link>
                    <a href="javascript:void(0);" @click="addOrder" class="btn-base btn-primary">下单结算</a>
                </div>
            </div>
            <!-- 结算导航END -->
        </div>

        <!-- 模拟支付 -->
        <!--<el-drawer-->
                <!--title="支付方式"-->
                <!--:visible.sync="drawer"-->
                <!--direction="btt"-->
                <!--&gt;-->
            <!--<el-select v-model="payType" placeholder="选择支付方式">-->
                <!--<el-option label="无" :value="0"></el-option>-->
                <!--<el-option label="支付宝" :value="1"></el-option>-->
                <!--<el-option label="微信" :value="2"></el-option>-->
            <!--</el-select>-->
            <!--<div style="text-align: right; margin: 10px 0 0">-->
                <!--<el-button type="primary" size="mini" @click="paySuccessBtn">确定-->
                <!--</el-button>-->
            <!--</div>-->
        <!--</el-drawer>-->

        <el-dialog
                title="支付"
                :visible.sync="drawer"
                width="30%"
        >
            <el-select v-model="payType" placeholder="选择支付方式">
                <el-option label="无" :value="0"></el-option>
                <el-option label="支付宝" :value="1"></el-option>
                <el-option label="微信" :value="2"></el-option>
            </el-select>
            <div style="text-align: right; margin: 10px 0 0">
                <el-button type="primary" size="mini" @click="paySuccessBtn">确定
                </el-button>
            </div>

        </el-dialog>

        <!-- 主要内容容器END -->
        <!--<el-dialog title="收货地址" :visible.sync="dialogFormVisible">-->
            <!--<el-form :model="form">-->
                <!--<el-form-item label="姓名：" :label-width="formLabelWidth">-->
                    <!--<el-input v-model="form.name" autocomplete="off"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="电话：" :label-width="formLabelWidth">-->
                    <!--<el-input v-model="form.phone"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="地址：" :label-width="formLabelWidth">-->
                    <!--<VDistpicker style="fontSize: 12px;" :province="form.province.value" :city="form.city.value" :area="form.area.value" @selected="addressSelected"/>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="详细地址：" :label-width="formLabelWidth">-->
                    <!--<el-input placeholder="小区楼栋/乡村名称" v-model="form.detailAddress"></el-input>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="saveAddress">确 定</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
const VDistpicker = () => import('v-distpicker')
import apiData from '@/lib/apiData';
const AddressList = () => import('./AddressList')
export default {
    name: 'ConfirmOrder',
    components: {
        VDistpicker,
      AddressList
    },
    data() {
        return {
            // 虚拟数据
            confirmAddress: "", // 选择的地址id
            // 地址列表
            address: [
                {
                    id: 1,
                    name: '许同学',
                    phone: '12888888888',
                    address: '广东 广州市 天河区 五山街道 ***',
                },
                {
                    id: 2,
                    name: '陈同学',
                    phone: '13555555555',
                    address: '广东 深圳市 福田区 景田北六街 ***',
                },
            ],
            dialogFormVisible: false,
            form: {
                name: '',
                phone: null,
                detailAddress: '',
                province: {},
                city: {},
                area: {}
            },
            formLabelWidth: '120px',
          orderNo:'',//订单编号
          drawer:false,//支付方式是否打开
          payType:0,//支付方式是否打开
        }
    },
    created() {
        //this.getAddress();
        // 如果没有勾选购物车商品直接进入确认订单页面,提示信息并返回购物车
        if (this.getCheckNum < 1) {
            this.notifyError('请勾选商品后再结算')
            this.$router.push({ path: '/shoppingCart' })
        }
    },
    computed: {
        // 结算的商品数量; 结算商品总计; 结算商品信息
        ...mapGetters(['getCheckNum', 'getTotalPrice', 'getCheckGoods']),
    },
    methods: {
        ...mapActions(['deleteShoppingCart','setShoppingCart']),
        getAddress() {
            this.$http.get(apiData.getAddress).then(res => {
                if(res.resultCode == 200) {
                    this.address = res.data.map(item =>{
                        return{
                            id: item.addressId,
                            name: item.userName,
                            phone: item.userPhone,
                            address: item.provinceName + item.cityName + item.regionName + item.detailAddress,
                            userId: item.userId,
                            defaultFlag: item.defaultFlag
                        }
                    })
                }
            })
        },
      setAddressId(id){
        this.confirmAddress = id;
      },
        // 添加地址
        addAddress() {
            this.dialogFormVisible = true;
        },
        // 选择地址
        addressSelected(val) {
            this.form.province = val.province;
            this.form.city = val.city;
            this.form.area = val.area;
        },
        // 保存地址
        saveAddress() {
            // 保存地址接口
            this.$http.post(apiData.saveAddress,{
                userName: this.form.name,
                userPhone: this.form.phone,
                provinceName: this.form.province.value,
                cityName: this.form.city.value,
                regionName: this.form.area.value,
                detailAddress: this.form.detailAddress,
                defaultFlag: this.form.defaultFlag
            }).then(res => {
                if(res.resultCode == 200) {
                    this.notifySucceed(res.message);
                    this.dialogFormVisible = false;
                }else{
                    this.notifyError(res.message);
                }
            })
        },
        addOrder() {
          const cartItemIds = [];
          this.getCheckGoods.forEach((item) => {
            cartItemIds.push(item.cartItemId)
          })
            this.$axios
                .post(apiData.saveOrder, {
                  addressId: this.confirmAddress,
                  cartItemIds,
                })
                .then((res) => {
                    this.orderNo = res.data.data;
                  if(res.data.resultCode == '200'){
                    this.notifySucceed('成功');
                    this.drawer = true
                    //下单后 重新获取购物车
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

                  }else{
                    this.notifyError(res.data.message)
                  }
                })
                .catch((err) => {
                    return Promise.reject(err)
                })
        },
      paySuccessBtn() {
          const orderNo = this.orderNo;
            this.$axios
                .get(`${apiData.paySuccess}?orderNo=${orderNo}&payType=${this.payType}`)
                .then((res) => {
                    this.orderNo = '';
                    this.drawer = false;
                    if(res.data.resultCode == '200'){
                      this.notifySucceed('支付成功');
                      this.$router.push({name:'OrderDetail',params: {id:orderNo}})
                    }else{
                      this.notifyError(res.data.message)
                    }

                })
                .catch((err) => {
                    return Promise.reject(err)
                })
        },
    },
}
</script>
<style scoped>
.confirmOrder {
    background-color: #f5f5f5;
    padding-bottom: 20px;
}
/* 头部CSS */
.confirmOrder .confirmOrder-header {
    background-color: #fff;
    border-bottom: 2px solid #ff6700;
    margin-bottom: 20px;
}
.confirmOrder .confirmOrder-header .header-content {
    width: 1225px;
    margin: 0 auto;
    height: 80px;
}
.confirmOrder .confirmOrder-header .header-content p {
    float: left;
    font-size: 28px;
    line-height: 80px;
    color: #424242;
    margin-right: 20px;
}
.confirmOrder .confirmOrder-header .header-content p i {
    font-size: 45px;
    color: #ff6700;
    line-height: 80px;
}
/* 头部CSS END */

/* 主要内容容器CSS */
.confirmOrder .content {
    width: 1225px;
    margin: 0 auto;
    padding: 48px 0 0;
    background-color: #fff;
}

/* 选择地址CSS */
.confirmOrder .content .section-address {
    margin: 0 48px;
    overflow: hidden;
}
.confirmOrder .content .section-address .title {
    color: #333;
    font-size: 18px;
    line-height: 20px;
    margin-bottom: 20px;
}
.confirmOrder .content .address-body li {
    float: left;
    color: #333;
    width: 220px;
    height: 178px;
    border: 1px solid #e0e0e0;
    padding: 15px 24px 0;
    margin-right: 17px;
    margin-bottom: 24px;
}
.confirmOrder .content .address-body .in-section {
    border: 1px solid #ff6700;
}
.confirmOrder .content .address-body li h2 {
    font-size: 18px;
    font-weight: normal;
    line-height: 30px;
    margin-bottom: 10px;
}
.confirmOrder .content .address-body li p {
    font-size: 14px;
    color: #757575;
}
.confirmOrder .content .address-body li .address {
    padding: 10px 0;
    max-width: 180px;
    max-height: 88px;
    line-height: 22px;
    overflow: hidden;
}
.confirmOrder .content .address-body .add-address {
    text-align: center;
    line-height: 30px;
    cursor: pointer;
}
.confirmOrder .content .address-body .add-address i {
    font-size: 30px;
    padding-top: 50px;
    text-align: center;
}
/* 选择地址CSS END */

/* 商品及优惠券CSS */
.confirmOrder .content .section-goods {
    margin: 0 48px;
}
.confirmOrder .content .section-goods p.title {
    color: #333;
    font-size: 18px;
    line-height: 40px;
}
.confirmOrder .content .section-goods .goods-list {
    padding: 5px 0;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
}
.confirmOrder .content .section-goods .goods-list li {
    padding: 10px 0;
    color: #424242;
    overflow: hidden;
}
.confirmOrder .content .section-goods .goods-list li img {
    float: left;
    width: 30px;
    height: 30px;
    margin-right: 10px;
}
.confirmOrder .content .section-goods .goods-list li .pro-name {
    float: left;
    width: 550px;
    line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-size{
    float: left;
    width: 100px;
    text-align: center;
    line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-price {
    float: left;
    width: 150px;
    text-align: center;
    line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-status {
    float: left;
    width: 99px;
    height: 30px;
    text-align: center;
    line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-total {
    float: left;
    width: 190px;
    text-align: center;
    color: #ff6700;
    line-height: 30px;
}
/* 商品及优惠券CSS END */

/* 配送方式CSS */
.confirmOrder .content .section-shipment {
    margin: 0 48px;
    padding: 25px 0;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
}
.confirmOrder .content .section-shipment .title {
    float: left;
    width: 150px;
    color: #333;
    font-size: 18px;
    line-height: 38px;
}
.confirmOrder .content .section-shipment .shipment {
    float: left;
    line-height: 38px;
    font-size: 14px;
    color: #ff6700;
}
/* 配送方式CSS END */

/* 发票CSS */
.confirmOrder .content .section-invoice {
    margin: 0 48px;
    padding: 25px 0;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
}
.confirmOrder .content .section-invoice .title {
    float: left;
    width: 150px;
    color: #333;
    font-size: 18px;
    line-height: 38px;
}
.confirmOrder .content .section-invoice .invoice {
    float: left;
    line-height: 38px;
    font-size: 14px;
    margin-right: 20px;
    color: #ff6700;
}
/* 发票CSS END */

/* 结算列表CSS */
.confirmOrder .content .section-count {
    margin: 0 48px;
    padding: 20px 0;
    overflow: hidden;
}
.confirmOrder .content .section-count .money-box {
    float: right;
    text-align: right;
}
.confirmOrder .content .section-count .money-box .title {
    float: left;
    width: 126px;
    height: 30px;
    display: block;
    line-height: 30px;
    color: #757575;
}
.confirmOrder .content .section-count .money-box .value {
    float: left;
    min-width: 105px;
    height: 30px;
    display: block;
    line-height: 30px;
    color: #ff6700;
}
.confirmOrder .content .section-count .money-box .total .title {
    padding-top: 15px;
}
.confirmOrder .content .section-count .money-box .total .value {
    padding-top: 10px;
}
.confirmOrder .content .section-count .money-box .total-price {
    font-size: 30px;
}
/* 结算列表CSS END */

/* 结算导航CSS */
.confirmOrder .content .section-bar {
    padding: 20px 48px;
    border-top: 2px solid #f5f5f5;
    overflow: hidden;
}
.confirmOrder .content .section-bar .btn {
    float: right;
}
.confirmOrder .content .section-bar .btn .btn-base {
    float: left;
    margin-left: 30px;
    width: 158px;
    height: 38px;
    border: 1px solid #b0b0b0;
    font-size: 14px;
    line-height: 38px;
    text-align: center;
}
.confirmOrder .content .section-bar .btn .btn-return {
    color: rgba(0, 0, 0, 0.27);
    border-color: rgba(0, 0, 0, 0.27);
}
.confirmOrder .content .section-bar .btn .btn-primary {
    background: #ff6700;
    border-color: #ff6700;
    color: #fff;
}
/* 结算导航CSS */

/* 主要内容容器CSS END */
</style>
