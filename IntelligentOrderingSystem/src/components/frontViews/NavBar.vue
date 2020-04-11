<template>
<div >
  <el-row  style="height: 600px;background-color: #545c64">
    <el-col :span="24">
      <el-menu default-active='1-1' class="el-menu-vertical-demo"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b"
               router>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>点餐</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1" route="/FoodList" @click="setUrl('/FoodList')">放肆点餐</el-menu-item>
            <el-menu-item index="1-2" route="/FoodList" @click="setUrl('/FoodList')">麻辣狂欢</el-menu-item>
            <el-menu-item index="1-3" route="/DrinkList" @click="setUrl('/DrinkList')">痛快畅饮</el-menu-item>
            <el-menu-item index="1-4" route="/DrinkList" @click="setUrl('/DrinkList')">餐后甜品</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>会员</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1" route="/AddCard" @click="setUrl('/AddCard')">办理会员</el-menu-item>
            <el-menu-item index="2-2" route="/VipRecharge" @click="setUrl('/VipRecharge')">会员充值</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="3" @click="drawer = true" :route="url">
          <template slot="title">
            <i class="el-icon-s-order"></i>
            <span style="font-weight: bolder;font-size: 20px">订单详情</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>

  <el-drawer
    title="我是标题"
    :visible.sync="drawer"
    :with-header="false">
    <span>我来啦!</span>
  </el-drawer>
</div>
</template>

<script>
    export default {
        name: "NavBar",
      data(){
          return{
            drawer:false,
            url:''
          }
      },
      methods:{
        setUrl(urlName){
          this.url = urlName;
        }
      }
    }
</script>

<style scoped>
</style>
