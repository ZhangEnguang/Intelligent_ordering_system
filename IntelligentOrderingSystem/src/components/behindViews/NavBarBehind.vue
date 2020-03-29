<template>
  <div >
    <el-row class="el-menu-vertical-demo" style="height: 500px;background-color: #545c64">
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
              <el-menu-item index="1-1" route="/FoodList">麻辣狂欢</el-menu-item>
              <el-menu-item index="1-2" route="">痛快畅饮</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>会员</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1" route="/FoodList">办理会员</el-menu-item>
              <el-menu-item index="2-2" route="">会员充值</el-menu-item>
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
