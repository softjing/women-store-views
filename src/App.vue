<template>
    <div id="app">
        <el-container>
            <!-- 顶部导航栏 -->
            <div class="topbar">
                <div class="nav">
                    <ul>
                        <li v-if="!isLogin">
                            <el-button type="text" @click="login">登录</el-button>
                            <span class="sep">|</span>
                            <el-button type="text" @click="onRegister">注册</el-button>
                        </li>
                        <li v-else>
                            欢迎
                            <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link">
                                    {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="personCenter">个人中心</el-dropdown-item>
                                    <el-dropdown-item command="order">我的订单</el-dropdown-item>
                                    <el-dropdown-item command="collect">我的收藏</el-dropdown-item>
                                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <!--<el-badge :value="3" class="badge-item">-->
                                <!--<el-link type="primary" size="small" style="marginLeft: 5px;">我的消息</el-link>-->
                            <!--</el-badge>-->
                        </li>
                        <li :class="getNum > 0 ? 'shopCart-full' : 'shopCart'">
                            <router-link to="/shoppingCart">
                                <i class="el-icon-shopping-cart-full"></i> 购物车
                                <span class="num">({{ getNum }})</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- 顶栏容器 -->
            <el-header>
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#409eff" router>
                    <div class="logo">
                        <router-link to="/">
                            <img src="./assets/imgs/logo.png" alt='' style="width: 138px; marginLeft: 60px;"/>
                        </router-link>
                    </div>
                    <el-menu-item index="/">首页</el-menu-item>
                    <!-- <el-menu-item index="/goodsList">全部商品</el-menu-item> -->
                    <!-- 分类页面才显示搜索框 -->
                    <div class="so" v-if="this.$route.name == 'GoodsList'">
                        <el-input placeholder="请输入搜索内容" v-model="search" dafault>
                            <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
                        </el-input>
                    </div>
                </el-menu>
            </el-header>
            <!-- 顶栏容器END -->

            <!-- 主要区域容器 -->
            <el-main style="background: #f5f5f5;">
                <keep-alive>
                    <router-view :key='key'></router-view>
                </keep-alive>
            </el-main>

            <!-- 底栏容器 -->
            <Footer />
            <!-- 协议声明 -->
            <Agreement />
        </el-container>
    </div>
</template>
<script>
import Footer from '@/components/Footer.vue';
import Agreement from '@/components/Agreement.vue';
import { mapActions, mapGetters, mapState } from 'vuex'
import apiData from '@/lib/apiData'

export default {
    components: {
        Footer,
        Agreement
    },
    data() {
        return {
            isLogin: true,
            register: false, // 是否显示注册组件
            visible: false,
            activeIndex: '', // 头部导航栏选中的标签
            search: '', // 搜索条件
        }
    },
    beforeUpdate() {
        // this.getUserInfo();
        // 组件加载即激活的路由（default-active="activeIndex" == index）
        this.activeIndex = this.$route.path
    },
    created() {
      this.getShoppingCart()
    },
    computed: {
        ...mapGetters(['getUser', 'getNum']),
        ...mapState({
            'userName': state => state.user.user
        }),
        key (){
          return this.$route.path + Math.random();
    },
    },
    watch: {
        $route:function(val,old){
          if(val.query.search != this.search){
            this.search = val.query.search
          }
        },
        getUser: function(val) {
            if (val === '') {
                // 用户没有登录
                this.setShoppingCart([])
            } else {

            }
        },
    },
  beforeUpdate() {
    this.isLogin = this.$store.getters.getToken
  },
    methods: {
        ...mapActions(['setUser', 'setShowLogin', 'setShoppingCart',
          'setShowAgreement','setToken']),
        getShoppingCart(){
          if(!localStorage.getItem('token')){
            return
          }
          // 用户已经登录,获取该用户的购物车信息
          this.$axios
              .get(apiData.shopCart)
              .then((res) => {
                const {data} = res
                  if (data.resultCode == '200') {
                      this.isLogin= true
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
        login() {
            // 跳转登录页
           this.$router.push({name: 'Login'});
        },
        // 退出登录
        logout() {
            this.isLogin = false
            this.visible = false
            // 清空本地登录信息
            localStorage.setItem('user', '')
          localStorage.setItem('token', '');
            // 清空vuex登录信息
            this.setUser('')
          this.setToken('')
          this.setShowLogin(true)

            this.notifySucceed('成功退出登录')
        },
        // 注册先打开协议声明
        onRegister() {
            this.setShowAgreement(true);
        },
        // 跳转到个人中心
        handleCommand(type) {
            switch(type) {
                case 'personCenter':
                    this.$router.push({name: 'PersonCenter'});
                    break;
                case 'order':
                    this.$router.push({name: 'Order'});
                    break;
                case 'collect':
                    this.$router.push({name: 'Collect'});
                    break;
                case 'logout':
                    this.logout();
                    break;

            }
        },
        // 点击搜索按钮
        searchClick() {
          if (this.$route.name == 'GoodsList') {
              this.$router.push({ path: this.$route.path, query: { search: this.search } })
            }
            // if (this.search != '') {
            //     // 跳转到全部商品页面,并传递搜索条件
            //     this.$router.push({ name: 'GoodsList', query: { search: this.search } })
            //     this.search = ''
            // }
        },
    },
}
</script>
<style lang="scss">
* {
    padding: 0;
    margin: 0;
    border: 0;
    list-style: none;
}
#app .el-header {
    padding: 0;
}
#app .el-main {
    min-height: 300px;
    padding: 20px 0;
}
#app .el-footer {
    padding: 0;
}
a,
a:hover {
    text-decoration: none;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .badge-item{
      span{
          font-size: 12px;
      }
      .el-badge__content.is-fixed{
          padding: 2px;
          height: 10px;
          font-size: 6px;
          line-height: 10px;
          top: 9px;
          right: 0;
      }
  }
@import './assets/css/common.scss';
</style>
