<template>
  <div class="register-wrapper">
    <div class="register-wrapper-form">
      <img src="@/assets/imgs/logo.png" alt="">
      <h4>注册女人商城账号</h4>
      <!--<p>国家/地区</p>-->
      <!--<el-select v-model="selectedOption" placeholder="请选择" style="width: 400px;" filterable>-->
        <!--<el-option-group-->
          <!--v-for="group in options"-->
          <!--:key="group.label"-->
          <!--:label="group.label">-->
          <!--<el-option-->
            <!--v-for="item in group.options"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value"-->
          <!--&gt;-->
          <!--</el-option>-->
        <!--</el-option-group>-->
      <!--</el-select>-->
      <!--<p>成功注册帐号后，国家/地区将不能被修改</p>-->
      <el-form ref="ruleForm" :model="RegisterUser" :rules="rules"  label-width="100px">
        <el-form-item label="用户名" prop="name" >
          <el-input placeholder="用户名" v-model="RegisterUser.name" >
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input placeholder="手机号码" v-model="phoneNumber" >
            <template slot="prepend">+86</template>
          </el-input>
        </el-form-item>
        <el-form-item label="短信验证码">
          <el-input placeholder="短信验证码" v-model="verificationCode" maxlength="6">
            <el-button slot="append" style="cursor: pointer" v-if="verificationCodeText"
                       @click="getVerificationCode">
              获取验证码
            </el-button>
            <el-button slot="append" style="cursor: pointer" v-if="!verificationCodeText">
              重新获取({{count}})
            </el-button>
          </el-input>
          <p v-show="autofocus" class="login-wrapper-account-warning"><i class="el-icon-warning"></i>手机号格式不正确</p>
        </el-form-item>
        <el-form-item label="密码" prop="pass" >
          <el-input placeholder="密码" v-model="RegisterUser.pass" >
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPass">
          <el-input placeholder="再次确认密码" v-model="RegisterUser.confirmPass" >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="registerUser" style="width: 400px;">立即注册</el-button>
        </el-form-item>
      </el-form>


    </div>
  </div>
</template>

<script>
import apiData from '@/lib/apiData';
import options from '@/lib/countryAndArea.json'
export default {
    name: 'MyRegister',
    props: ['register'],
    data() {
        // 用户名的校验方法
        let validateName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入用户名'))
            }
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
                return callback(new Error('请输入密码'))
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
            if (value === '') {
                return callback(new Error('请输入确认密码'))
            }
            // 校验是否以密码一致
            if (this.RegisterUser.pass == '' || value !== this.RegisterUser.pass) {
              return callback(new Error('两次输入的密码不一致'))
            }
          return callback()
        }
        return {
            isRegister: true, // 控制注册组件是否显示
            RegisterUser: {
                name: '',
                pass: '',
                confirmPass: '',
            },
            // 用户信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
            rules: {
                name: [{ required: true, message: '请输入用户名', trigger: 'blur' },
                  {validator: validateName, trigger: 'blur' }
                  ],
                pass: [{ required: true, message: '请输入密码', trigger: 'blur' },{
                  validator: validatePass, trigger: 'blur' }],
                confirmPass: [{ required: true, message: '请确认密码', trigger: 'blur' },{
                  validator: validateConfirmPass, trigger: 'blur' }],
            },
            options,    //国家和地区列表
            selectedOption: 'China', // 被选中国家或地区（默认中国）
            phoneNumber: '',  // 注册的手机号
            autofocus: false,
            verificationCode: '', // 验证码
            lineCode: '', // 接收的手机验证码
            verificationCodeText: true, // 获取验证码 || 重新获取（60）
            count: '', // 倒计时计数
            timer: null, // 倒计时定时器
        }
    },
    watch: {
        // 监听父组件传过来的register变量，设置this.isRegister的值
        register: function(val) {
            if (val) {
                this.isRegister = val
            }
        },
        // 监听this.isRegister变量的值，更新父组件register变量的值
        isRegister: function(val) {
            if (!val) {
                this.$refs['ruleForm'].resetFields()
                this.$emit('fromChild', val)
            }
        },
        // 监听this.isRegister变量的值，更新父组件register变量的值
      phoneNumber: function(val,oldVal) {

        if (val != oldVal) {
          this.lineCode = '';
          this.verificationCode = '';
        }
      },
    },
    methods: {
      // 获取短信验证码接口
      getVerificationCode() {
         console.log(this.phoneNumber);
        // 验证手机号码
        const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
        if(this.phoneNumber.match(reg)) {
          this.autofocus = false;
          this.countdown();
          // 调接口 获取短信验证码
          this.$axios.get(`${apiData.sendVerifityCode}${this.phoneNumber}`).then(res => {
            console.log(res);
            this.lineCode = res.data.data
          })
        } else {
          // 聚焦
          this.autofocus = true;
        }
      },
      // 倒计时函数
      countdown() {
        const TIME_COUNT = 10; // 倒计时60s，可从后端接收数据，
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.verificationCodeText = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.verificationCodeText = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }
      },
      registerUser() {

        //判断输入的验证码和手机的验证码是否一致
        if(!this.verificationCode || this.verificationCode != this.lineCode){
          this.notifyError('请输入正确的手机验证码');
          return false;
        }
            // 通过element自定义表单校验规则，校验用户输入的用户信息
            this.$refs['ruleForm'].validate((valid) => {
              console.log('valid',valid)
                //如果通过校验开始注册
                if (valid) {
                    this.$axios.post(apiData.register, {
                            loginName: this.phoneNumber,
                            nickName: this.RegisterUser.name,
                            password: this.RegisterUser.pass,
                        },{
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        })
                        .then((res) => {
                          const data = res.data;
                          if(data.resultCode == 200) {
                            this.notifySucceed('注册成功');
                            this.$router.push({name: 'Login'});
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
        },
    },
}
</script>

<style lang="scss" scoped>
.register-wrapper{
  width: 600px;
  margin: 0 auto;
  background: #fff;
  // text-align: center;
  padding: 30px 60px;
  &-form{
    width: 400px;
    margin: 0 auto;
    img{
      width: 160px;
      text-align: center;
    }
    h4{
      margin-bottom: 20px;
      font-size: 26px;
      font-weight: 700;
      text-align: center;
    }
    p,img{
      margin: 20px 0;
    }
  }
}
</style>
