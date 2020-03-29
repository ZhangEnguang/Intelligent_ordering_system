<template>
  <div >
    <el-row  style="height: 670px;background-color: #545c64;border-top: 1px solid white">
      <el-col :span="24">
        <el-menu default-active="1" class="el-menu-vertical-demo"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 router>
          <el-menu-item index="1" route="/Home">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span>系统首页</span>
            </template>
          </el-menu-item>
          <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>轮播图管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1" route="">办理会员</el-menu-item>
            <el-menu-item index="2-2" route="">会员充值</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>员工管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1" route="">办理会员</el-menu-item>
              <el-menu-item index="3-2" route="">会员充值</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>菜品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1" route="">办理会员</el-menu-item>
              <el-menu-item index="4-2" route="">会员充值</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>会员管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1" route="">办理会员</el-menu-item>
              <el-menu-item index="4-2" route="">会员充值</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "NavBarBehind"
    }
</script>

<style scoped>

</style>
