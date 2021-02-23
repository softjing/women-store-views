export default {
    state: {
        shoppingCart: [
            // {
            //     id: "1", // 购物车id
            //     productID: "1", // 商品id
            //     productName: "衣服1", // 商品名称
            //     productImg: "https://g-search1.alicdn.com/img/bao/uploaded/i4/i2/199343403/O1CN01DtT3QB1b0cTHfYtyR_!!0-item_pic.jpg_250x250.jpg", // 商品图片
            //     price: 120, // 商品价格
            //     num: 1, // 商品数量
            //     maxNum: "", // 商品限购数量
            //     check: false // 是否勾选
            // },
            // {
            //     id: "1", // 购物车id
            //     productID: "2", // 商品id
            //     productName: "衣服2", // 商品名称
            //     productImg: "https://g-search1.alicdn.com/img/bao/uploaded/i4/i2/199343403/O1CN01DtT3QB1b0cTHfYtyR_!!0-item_pic.jpg_250x250.jpg", // 商品图片
            //     price: 120, // 商品价格
            //     num: 1, // 商品数量
            //     maxNum: "", // 商品限购数量
            //     check: false // 是否勾选
            // }
        ],
    },
    getters: {
        getShoppingCart(state) {
            // 获取购物车状态
            return state.shoppingCart
        },
        getNum(state) {
            // 购物车商品总数量
            let totalNum = 0
            for (let i = 0; i < state.shoppingCart.length; i++) {
                const temp = state.shoppingCart[i]
                totalNum += temp.goodsCount
            }
            return totalNum
        },
        getIsAllCheck(state) {
            // 判断是否全选
            let isAllCheck = true
            for (let i = 0; i < state.shoppingCart.length; i++) {
                const temp = state.shoppingCart[i]
                // 只要有一个商品没有勾选立即return false;
                if (!temp.check) {
                    isAllCheck = false
                    return isAllCheck
                }
            }
            return isAllCheck
        },
        getCheckGoods(state) {
            // 获取勾选的商品信息
            // 用于确认订单页面
            let checkGoods = []
            for (let i = 0; i < state.shoppingCart.length; i++) {
                const temp = state.shoppingCart[i]
                if (temp.check) {
                    checkGoods.push(temp)
                }
            }
            return checkGoods
        },
        getCheckNum(state) {
            // 获取购物车勾选的商品数量
            let totalNum = 0
            for (let i = 0; i < state.shoppingCart.length; i++) {
                const temp = state.shoppingCart[i]
                if (temp.check) {
                    totalNum += temp.goodsCount
                }
            }
            return totalNum
        },
        getTotalPrice(state) {
            // 购物车勾选的商品总价格
            let totalPrice = 0
            for (let i = 0; i < state.shoppingCart.length; i++) {
                const temp = state.shoppingCart[i]
                if (temp.check) {
                    totalPrice += temp.sellingPrice * temp.goodsCount
                }
            }
            return totalPrice
        },
    },
    mutations: {
        setShoppingCart(state, data) {
            // 设置购物车状态
            state.shoppingCart = data
        },
        unshiftShoppingCart(state, data) {
            // 添加购物车
            // 用于在商品详情页点击添加购物车,后台添加成功后，更新vuex状态
            state.shoppingCart.unshift(data)
        },
        updateShoppingCart(state, payload) {
          const newArr = [...state.shoppingCart]
          newArr[payload.key][payload.prop] = payload.val
          state.shoppingCart = newArr
        },
        addShoppingCartNum(state, productID) {
            // 增加购物车商品数量
            // 用于在商品详情页点击添加购物车,后台返回002，“该商品已在购物车，数量 +1”，更新vuex的商品数量
            for (let i = 0; i < state.shoppingCart.length; i++) {
                const temp = state.shoppingCart[i]
                if (temp.productID == productID) {
                    if (temp.goodsCount < temp.maxNum) {
                        temp.goodsCount++
                    }
                }
            }
        },
        deleteShoppingCart(state, index) {
            // 根据购物车id删除购物车商品
            state.shoppingCart.splice(index, 1)
        },
        checkAll(state, data) {
            // 点击全选按钮，更改每个商品的勾选状态
            for (let i = 0; i < state.shoppingCart.length; i++) {
                state.shoppingCart[i].check = data
            }
        },
    },
    actions: {
        setShoppingCart({ commit }, data) {
            commit('setShoppingCart', data)
        },
        unshiftShoppingCart({ commit }, data) {
            commit('unshiftShoppingCart', data)
        },
        updateShoppingCart({ commit }, payload) {
            commit('updateShoppingCart', payload)
        },
        addShoppingCartNum({ commit }, productID) {
            commit('addShoppingCartNum', productID)
        },
        deleteShoppingCart({ commit }, index) {
            commit('deleteShoppingCart', index)
        },
        checkAll({ commit }, data) {
            commit('checkAll', data)
        },
    },
}
