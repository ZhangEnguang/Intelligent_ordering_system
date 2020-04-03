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
      components: {HeaderBehind, NavBarBehind},
      mounted() {
        let val = this.$cookies.get('root')
        if(val == 2){
          this.$router.push('/Home');
        }else {
          this.$router.push('/FoodList');
        }
      }
    }
</script>

<style scoped>

</style>
