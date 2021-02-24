<template>
  <div id="content-wrapper" class="personCenter-wrapper">
    <div style="width: 80%; margin: 0 auto;">
      <h3>个人中心</h3>
      <h4>亲爱的<a href="javascript:;">{{userName}}</a>，填写真实的资料，有助于好友找到你哦。</h4>
      <div style="margin: 20px auto; border: 1px solid grey; padding: 40px;">
        <el-form ref="form" :rules="rules" :model="form" label-width="120px" >

          <el-form-item label="昵称：" prop="nickName">
            <el-input v-model="form.nickName"></el-input>
          </el-form-item>
          <el-form-item label="个性签名：" prop="introduceSign">
            <el-input v-model="form.introduceSign" ></el-input>
          </el-form-item>
          <el-form-item label="登录密码：" prop="password">
            <el-input v-model="form.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="confirmPwd">
            <el-input v-model="form.confirmPwd" show-password ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrapper">
          <el-button type="primary" @click="sureChange" >确认更改</el-button>
          <el-button type="primary">取消更改</el-button>
        </div>
      </div>
      <address-list :ismove="true" :isedit="true"  :isshowdefault="true" :canEdit="true"/>



    </div>
  </div>
</template>

<script>
  import apiData from '@/lib/apiData';
  const VDistpicker = () => import('v-distpicker')
  const AddressList = () => import('./AddressList')
  import { mapActions } from 'vuex'
  export default {
    components: {
      VDistpicker,AddressList
    },
    data() {

      // 用户名的校验方法
      let validateName = (rule, value, callback) => {
        // if (!value) {
        //   return callback(new Error('请输入用户名'))
        // }
        // 用户名以字母开头,长度在5-16之间,允许字母数字下划线
        const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
        if (!userNameRule.test(value)) {
          return callback(new Error('字母开头,长度5-16之间,允许字母数字下划线'))
        }
        return callback()
      }
      // 密码的校验方法
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          return callback()
        }
        // 密码以字母开头,长度在6-18之间,允许字母数字和下划线
        const passwordRule = /^[a-zA-Z]\w{5,17}$/
        if (!passwordRule.test(value)) {
          //this.$refs.ruleForm.validateField('checkPass')
          return callback(new Error('字母开头,长度6-18之间,允许字母数字和下划线'))
        }
        return callback()
      }
      // 确认密码的校验方法
      let validateConfirmPass = (rule, value, callback) => {
        if (this.form.password === '') {
          return callback()
        }
        // 校验是否以密码一致
        if (this.form.password == '' || value !== this.form.password) {
          return callback(new Error('两次输入的密码不一致'))
        }
        return callback()
      }

      return {
        userName: '用户1',
        isLogin: true,
        form: {
          nickName: '', // 昵称
          password: '', // 密码
          confirmPwd: '', // 确认密码
          introduceSign: '', // 个性签名
        },
        // 用户信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
        rules: {
          // nickName: [
          //   {validator: validateName, trigger: 'blur' }
          // ],
          password: [{
            validator: validatePass, trigger: 'blur' }],
          confirmPwd: [{
            validator: validateConfirmPass, trigger: 'blur' }],
        },

      }
    },
    created() {
      this.isLogin = this.$store.getters.getToken;
      if(this.isLogin){
        this.getPersonInfo();
      }else{
        this.$router.push({name: 'Login'});
      }

    },
    beforeUpdate() {
      this.isLogin = this.$store.getters.getToken
    },
    methods: {
      ...mapActions(['setUser', 'setShowLogin', 'setShoppingCart',
        'setShowAgreement','setToken']),
      // 获取个人信息
      getPersonInfo() {
        this.$axios.get(apiData.getUserInfo).then(res => {
          if(res.data.resultCode == '200'){
            this.form.nickName = res.data.data.nickName; // 昵称
            this.form.introduceSign = res.data.data.introduceSign; // 个性签名
          }

        })
      },
      sureChange(){

        let data = {};
        if(this.form.nickName){
          Object.assign(data,{
            nickName: this.form.nickName,
          })
        }
        if(this.form.introduceSign){
          Object.assign(data,{
            introduceSign: this.form.introduceSign,
          })
        }
        if(this.form.password){
          Object.assign(data,{
            confirmPwd: this.form.confirmPwd,
          })
        }
        this.$refs['form'].validate((valid) => {
          //如果通过校验开始注册
          if (valid) {
            this.$axios.put(apiData.getUserInfo, {...data},{
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((res) => {
                const data = res.data;
                if(data.resultCode == 200) {
                  this.notifySucceed('修改成功');
                }else{
                  this.notifyError(data.message)
                }
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          } else {
            return false
          }
        })


      }
    }
  }
</script>

<style lang="scss">
.personCenter-wrapper{
  h3{
    font-weight: 700;
    margin-bottom: 20px;
  }
  input{
    width: 400px;
  }
  .btn-wrapper{
    text-align: right;
    button{
      margin-left: 60px;
    }
  }
}
</style>
