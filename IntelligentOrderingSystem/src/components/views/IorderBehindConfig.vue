<template>
  <div>
    <HeaderBehind></HeaderBehind>
    <el-container>
      <el-aside width="14%">
        <NavBarBehind/>
      </el-aside>
      <el-main style="padding:0 0 20px 5px;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import HeaderBehind from "../behindViews/HeaderBehind";
  import NavBarBehind from "../behindViews/NavBarBehind";
    export default {
        name: "IorderBehindConfig",
      components: {HeaderBehind, NavBarBehind}
    }
</script>

<style scoped>

</style>
