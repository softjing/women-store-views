<template>
  <div class="address-list-wrapper">
       <el-row>
         <template  v-for="(o, index) in list" >
           <el-card shadow="hover" :body-style="{ padding: '0px' }" :key="o.addressId"
                    :offset="index > 0 ? 2 : 0" :class="`item ${o.defaultFlag == 1 ?
                    'greenBorder' : ''}`" >
             <div class="el-icon-check-box" v-if="o.defaultFlag == 1" >
               <i class="el-icon-check"  ></i>
             </div>
             <i class="el-icon-delete"  @click="deleteAddress(o.addressId)"  ></i>
             <i class="el-icon-edit"  @click="editAddress(o.addressId)"  ></i>
             <p class="title">{{o.userName}}</p>
             <p class="content">{{o.userPhone}}</p>
             <p class="content" >{{o.provinceName}}  {{o.cityName != '市辖区' ? o.cityName:''
               }}  {{o.regionName}}  {{o.detailAddress}}</p>
           </el-card>
         </template>


         <el-card shadow="hover" class="item"
                  body-style="color: #c0c0c0; cursor: pointer;">
           <div style="margin-top: 20px;text-align: center">
             <div @click="showAddDialog">
               <svg t="1581245564704" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7108" width="32" height="32"><path d="M448 448V64a64 64 0 0 1 128 0v384h384a64 64 0 0 1 0 128H576v384a64 64 0 0 1-128 0V576H64a64 64 0 0 1 0-128h384z" fill="#cdcdcd" p-id="7109"></path></svg><br/>
               <div style="margin-top: 10px;">点击添加地址</div>
             </div>
           </div>
         </el-card>
       </el-row>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form ref="form"  :rules="rules" :model="form" label-width="140px" >
        <el-form-item label="收件人名称：" prop="userName" >
          <el-input placeholder="收件人名称" v-model="form.userName" ></el-input>
        </el-form-item>
        <el-form-item label="收件人联系方式：" prop="userPhone" >
          <el-input placeholder="收件人联系方式" v-model="form.userPhone" ></el-input>
        </el-form-item>
        <el-form-item label="选择地区：" prop="selectedOptions" >
          <!--<VDistpicker style="fontSize: 12px;" v-model="form.address"  />-->
          <el-cascader
                  placeholder="请点击选择地址"
                  :options="options"
                  v-model="form.selectedOptions"
                  @change="handleChange"
                  clearable
          ></el-cascader>

        </el-form-item>
        <el-form-item label="详细地址：" prop="detailAddress" >
          <el-input placeholder="小区楼栋/乡村名称" v-model="form.detailAddress" ></el-input>
        </el-form-item>
        <el-form-item label="是否默认地址：">
          <el-select v-model="form.defaultFlag" placeholder="是否默认地址">
            <el-option label="不是" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeAddress">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import apiData from '@/lib/apiData';
  import RegionList from '../../static/districts';
  const VDistpicker = () => import('v-distpicker')
  export default {
    components: {
      VDistpicker
    },
    data() {
      return {
        list:[],
        dialogFormVisible: false,
        form:{
          defaultFlag:"0",	//	是否默认地址 0-不是 1-是		false
          detailAddress:"",	//	详细地址		false
          userName:"",	////收件人名称		false
          userPhone:"",	//收件人联系方式
          selectedOptions: null,
          provinceName:'',
          regionName:'',
          cityName:'',
          addressId:''
        },
        rules: {
          detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' },],
          userName: [{ required: true, message: '请输入收件人名称', trigger: 'blur' },],
          userPhone: [{ required: true, message: '请输入收件人联系方式', trigger: 'blur' },],
          selectedOptions: [{ required: true, message: '请输入地址', trigger: 'blur' },],
        },
        options: [],
        cityArr: [], //城市列表
        areaArr: [], //区县列表
        area: "", // 区县,
      }
    },
    created() {
      this.getAddress();
      this.initDistPicker();
    },
    methods: {
      // 获取个人信息
      getAddress() {
        this.$axios.get(apiData.getAddress).then(res => {
          this.list = res.data.data;
        })
      },
      //显示新增弹框
      showAddDialog(){
        this.dialogFormVisible = true;
        this.form = {
          defaultFlag:"0",	//	是否默认地址 0-不是 1-是		false
            detailAddress:"",	//	详细地址		false
            userName:"",	////收件人名称		false
            userPhone:"",	//收件人联系方式
            selectedOptions: null,
            provinceName:'',
            regionName:'',
            cityName:'',
            addressId:''
        };
      },
      changeAddress(){
        this.$refs['form'].validate((valid) => {
          //如果通过校验开始注册
          if (valid) {
            if(this.form.addressId){
              this.$axios.put(apiData.getAddress, {...this.form},{
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((res) => {
                  const data = res.data;
                  if(data.resultCode == 200) {
                    this.notifySucceed('添加成功');
                    this.dialogFormVisible = false;
                    this.getAddress();
                    //重置弹出框信息
                  }else{
                    this.notifyError(data.message)
                  }
                })
                .catch((err) => {
                  return Promise.reject(err)
                })
            }else{
              this.$axios.post(apiData.getAddress, {...this.form},{
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((res) => {
                  const data = res.data;
                  if(data.resultCode == 200) {
                    this.notifySucceed('添加成功');
                    this.dialogFormVisible = false;
                    this.getAddress();
                    //重置弹出框信息

                  }else{
                    this.notifyError(data.message)
                  }
                })
                .catch((err) => {
                  return Promise.reject(err)
                })
            }

          } else {
            return false
          }
        })


      },
      deleteAddress(id){
        this.$axios.delete(`${apiData.getAddress}/${id}`,{
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            const data = res.data;
            if(data.resultCode == 200) {
              this.notifySucceed('删除成功');
              this.dialogFormVisible = false;
              this.getAddress();
              this.$refs['form'].resetFields();
            }else{
              this.notifyError(data.message)
            }
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      },
      editAddress(id){
            this.$axios.get(`${apiData.getAddress}/${id}`,{
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((res) => {
                const data = res.data;
                if(data.resultCode == 200) {
                  this.dialogFormVisible = true;
                  const provinceList = RegionList["100000"];
                  const provinceCode = this.findKey(provinceList,data.data.provinceName);

                  const cityList = RegionList[provinceCode];
                  const cityCode = this.findKey(cityList,data.data.cityName);

                  const regionList = RegionList[cityCode];
                  const regionCode = this.findKey(regionList,data.data.regionName);

                  this.form = {
                    defaultFlag:`${data.data.defaultFlag}`,	//	是否默认地址 0-不是 1-是		false
                    detailAddress:data.data.detailAddress,	//	详细地址		false
                    userName:data.data.userName,	////收件人名称		false
                    userPhone:data.data.userPhone,	//收件人联系方式
                    selectedOptions: [provinceCode, cityCode, regionCode],
                    //`${data.data.provinceName}/${data.data.cityName}/${data.data.regionName}`,
                    provinceName:data.data.provinceName,
                    regionName:data.data.regionName,
                    cityName:data.data.cityName,
                    addressId:data.data.addressId
                  }
                }else{
                  this.notifyError(data.message)
                }
              })
              .catch((err) => {
                return Promise.reject(err)
              })



      },
      initDistPicker() {
        let self = this;
          let distData = RegionList;
          let options = [];
          // 省
          for (let provinceKy in distData["100000"]) {
            let optProvinceItem = {
              value: provinceKy,
              label: distData["100000"][provinceKy]
            };
            if (distData[provinceKy]) {
              // 市
              for (let cityKy in distData[provinceKy]) {
                optProvinceItem.children = optProvinceItem.children
                  ? optProvinceItem.children
                  : [];
                let optCityItem = {
                  value: cityKy,
                  label: distData[provinceKy][cityKy]
                };
                if (distData[cityKy]) {
                  // 区
                  for (let areaKy in distData[cityKy]) {
                    optCityItem.children = optCityItem.children
                      ? optCityItem.children
                      : [];
                    let optAreaItem = {
                      value: areaKy,
                      label: distData[cityKy][areaKy]
                    };
                    optCityItem.children.push(optAreaItem);
                  }
                }
                optProvinceItem.children.push(optCityItem);
              }
            }
            options.push(optProvinceItem);
          }
          self.distData = distData;
          self.options = options;

      },
      //选择地区
      handleChange(value) {
        let self = this;
        console.log("value=>", value);
        //获取省名
        self.options.map((item, index) => {
          if (item.value == value[0]) {
            self.cityArr = item.children; //存储城市列表
            self.form.provinceName = item.label;
          }
        });
        //获取市名
        self.cityArr.map((item, index) => {
          if (item.value == value[1]) {
            self.areaArr = item.children; //存储区县列表
            self.form.cityName = item.label;
          }
        });
        //获取区县名
        self.areaArr.map((item, index) => {
          if (item.value == value[2]) {
            self.form.regionName = item.label;
          }
        });


        this.selectedOptions = value;
      },
      findKey (obj,value, compare = (a, b) => a === b) {
        return Object.keys(obj).find(k => compare(obj[k], value))
      }
    },

  }
</script>

<style lang="scss">
.address-list-wrapper{
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

  .item {
    width: 32.4%;
    min-height: 180px;
    float:left;
    display: block;
    text-align: center;
    margin-right: 10px;
    margin-bottom: 15px;
    padding:20px ;
    box-sizing: border-box;
    position: relative;

    &.greenBorder{
      border:1px solid green;
    }

    .el-icon-delete{
      position: absolute;
      right: 10px;
      top:10px;
      font-size: 18px;
      cursor: pointer;
    }
    .el-icon-check-box{
      position: absolute;
      left: 0px;
      top:0px;
      width:0;
      height:0;
      border-top:0px solid green;
      border-bottom:30px solid transparent;
      border-left:30px solid green;
      .el-icon-check{
        position: absolute;
        left: -30px;
        top:0px;
        font-size: 18px;
        color: #fff;
      }

    }

    .el-icon-edit{
      position: absolute;
      right: 38px;
      top:10px;
      font-size: 18px;
      cursor: pointer;
    }

    &:nth-child(3n+0)
    {
      margin-right: 0;
    }

    .title{
      font-size: 16px;
      padding:10px 0;
      text-align: left;
      font-weight: bold;
    }
    .content{
      font-size: 14px;
      color: #666;
      padding:5px 0;
      text-align: left;
    }


    .add-teacher {
      color: #c0c0c0;
    }
  }

}
</style>



