<template>
  <div >
    <el-row  class="container">
      <el-col :span="24">
        <el-menu  class="el-menu-vertical-demo"
                 background-color="#545c64"
                 text-color="#fff"
                  default-active='1'
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
            <el-menu-item index="2-1" route="/CarouselList">轮播图列表</el-menu-item>
            <el-menu-item index="2-2" route="/CarouseShow">轮播图预览</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>员工管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1" route="/EmployeeList">员工列表</el-menu-item>
              <el-menu-item index="3-2" route="/RootList">职位列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>菜品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1" route="/FoodBehindList">菜品</el-menu-item>
              <el-menu-item index="4-2" route="/FoodTypeList">菜品类别</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>会员管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1" route="/VipLevelList">会员等级</el-menu-item>
              <el-menu-item index="5-2" route="/VipList">会员展示</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>餐桌管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="6-1" route="/TableList">餐桌列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="7" route="/OrderMessage">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span style="font-weight: bolder;font-size: 20px">订单详情</span>
            </template>
          </el-menu-item>
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
.container{
  height: 1830px;/*px*/
  background-color: #545c64;
  border-top: 1px solid white
}
</style>
