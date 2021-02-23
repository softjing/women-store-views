<template>
  <ul class="treeList-wrapper">
    <li class="classOne" v-for="item in treeList" :key="item.categoryId">
      <p>{{item.categoryName}}<i class="el-icon-arrow-right"></i></p>
      <ul class="classList-wrapper">
        <!-- <li class="classTwo" v-for="(it, i) in item.children" :key="i" @click="jumpToPro(it.id)"> -->
        <li  v-for="(it, i) in item.secondLevelCategoryVOS" :key="i" >
          <!-- <img :src="it.img" alt="" class="smallImg"> -->
        <p style="fontSize:18px;fontWeight:bold">{{it.categoryName}}</p>
          <ul style="paddingLeft:10px">
            <li class="classTwo" v-for="(value, index) in it.thirdLevelCategoryVOS" :key="index" @click="jumpToPro(value.categoryId)">
            {{value.categoryName}}
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      treeList: {
        type: Array,
        // default: () => {
        //   return [
        //     {
        //       title: {
        //         type: String,
        //         default: '',
        //       },
        //       children: {
        //         type: Array,
        //         default: () => {
        //           return [
        //             {
        //               id: {
        //                 type: String,
        //                 default: ''
        //               },
        //               img: {
        //                 type: String,
        //                 default: ''
        //               },
        //               title: {
        //                 type: String,
        //                 default: ''
        //               }
        //             }
        //           ]
        //         }
        //       }
        //     }
        //   ]
        // }
      }
    },
    methods: {
      // 点击跳转商品列表页
      jumpToPro(id) {
        this.$router.push({
          name: 'GoodsList',
          params: {
            goodsCategoryId: id,
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
.treeList-wrapper{
  background: rgba(105,101,101,.6);
  padding: 20px 0;
  float: left;
  width: 200px;
  position: relative;
  height: 420px;
  .classOne{
    cursor: pointer;
    padding: 0 40px;
    line-height: 42px;
    color: #fff;
    &:hover{
      background: #ff6700;
      .classList-wrapper{
        display: block;
      }
    }
    i{
      float: right;
      line-height: 42px;
    }
    .classList-wrapper{
      display: none;
      padding: 10px;
      overflow-y: auto;
      z-index: 99;
      background: #fff;
      box-shadow: 0 0 3px 3px rgba(0,0,0,.4);
      color: #333;
      height: 460px;
      width: 900px;
      position: absolute;
      left: 200px;
      top: 0;
      .classTwo{
        display: inline-block;
        margin-right: 20px;
        display:inline-block;
        &:hover{
          color: #ff6700;
        }
        .smallImg{
          width: 30px;
          max-height: 30px;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>