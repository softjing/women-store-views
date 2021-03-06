import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import VueHttp from '@/lib/index.ts';
Vue.use(VueHttp);

// 设置全局函数及变量
import Global from './Global'
import Axios from 'axios'
import '@/style/index.scss'

Axios.interceptors.request.use(function (config) {
  let token = localStorage.getItem('token');
  config.headers.common['token'] = token;
  return config;
});

Vue.prototype.$axios = Axios
Vue.use(Global)

// 全局响应拦截器
Axios.interceptors.response.use(
    (res) => {
      
        if (res.data.resultCode == '416') {
            // 401表示没有登录
            // 提示没有登录
            Vue.prototype.notifyError(res.data.message)
            // 修改vuex的showLogin状态,显示登录组件
            store.dispatch('setShowLogin', true)
            store.dispatch('setToken', "")
            store.dispatch('setUser', "")

          // 清空本地登录信息
          localStorage.setItem('user', '')
          localStorage.setItem('token', '');
          // 清空vuex登录信息
          router.push({name: 'Login'});
        }
        // if (res.data.resultCode == '500') {
        //     // 500表示服务器异常
        //     // 跳转error页面
        //     router.push({ path: '/error' })
        // }
        return res
    },
    (error) => {
        // 跳转error页面
        router.push({ path: '/error' })
        return Promise.reject(error)
    }
)

//全局路由拦截器,在进入需要用户权限的页面前校验是否已经登录
router.beforeResolve((to, from, next) => {
    const loginUser = store.getters.getToken || localStorage.getItem('token');
    // 判断路由是否设置相应校验用户权限
    if (to.meta.requireAuth) {
        if (!loginUser) {
            // 没有登录，显示登录组件
            store.dispatch('setShowLogin', true)
            if (from.name == null) {
                //此时，是在页面没有加载，直接在地址栏输入链接，进入需要登录验证的页面
                next('/')
                return
            }
            // 终止导航
            next(false)
            return
        }
    }
    next()
})

//全局组件
import MyMenu from './components/MyMenu'
Vue.component(MyMenu.name, MyMenu)
import MyList from './components/MyList'
Vue.component(MyList.name, MyList)
import HomeList from '@/components/HomeList'
Vue.component('HomeList', HomeList)

// 相对时间过滤器,把时间戳转换成时间
// 格式: 2020-08-25 21:43:23
Vue.filter('dateFormat', (dataStr) => {
    var time = new Date(dataStr)
    function timeAdd0(str) {
        if (str < 10) {
            str = '0' + str
        }
        return str
    }
    var y = time.getFullYear()
    var m = time.getMonth() + 1
    var d = time.getDate()
    var h = time.getHours()
    var mm = time.getMinutes()
    var s = time.getSeconds()
    return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm) + ':' + timeAdd0(s)
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')
