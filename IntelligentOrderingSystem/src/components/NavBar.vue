<template>
<div >
  <el-row class="el-menu-vertical-demo" style="height: 500px;background-color: #545c64">
    <el-col :span="24">
      <el-menu default-active='2' class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
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
            <el-menu-item index="1-1" route="/FoodList">主食</el-menu-item>
            <el-menu-item index="1-2" route="">酒水</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>会员</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1" route="">办理会员</el-menu-item>
            <el-menu-item index="2-2" route="">积分查询</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</div>

</template>

<script>
    export default {
        name: "NavBar",
      methods: {
        handleOpen(key, keyPath) {

        },
        handleClose(key, keyPath) {

        }
      }
    }
</script>

<style scoped>

</style>
