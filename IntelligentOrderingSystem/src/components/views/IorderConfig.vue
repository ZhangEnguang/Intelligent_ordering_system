<template>
  <div id="iorder">
    <Header></Header>
    <el-container>
        <el-aside width="14%">
          <NavBar/>
        </el-aside>
        <el-main >
          <router-view></router-view>
        </el-main>
    </el-container>
  </div>
</template>

<script>
  import NavBar from "../NavBar";
  import Header from "../Header";
    export default {
        name: "IorderConfig",
      components: {Header, NavBar}
    }
</script>

<style scoped>

</style>
