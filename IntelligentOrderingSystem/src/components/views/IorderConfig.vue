<template>
  <div>
    <Header></Header>
    <el-container>
        <el-aside width="14%">
          <NavBar/>
        </el-aside>
        <el-main style="padding:0 0 20px 5px;">
          <router-view></router-view>
        </el-main>
    </el-container>
  </div>
</template>

<script>
  import NavBar from "../frontViews/NavBar";
  import Header from "../frontViews/Header";
    export default {
        name: "IorderConfig",
      components: {Header, NavBar}
    }
</script>

<style scoped>

</style>
