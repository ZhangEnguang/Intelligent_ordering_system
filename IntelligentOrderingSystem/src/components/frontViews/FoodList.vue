<template>
<div style="background-color: #545c64;height: 500px;">
  <div>
    <div style="display: flex; margin-top: 20px; height: 100px;margin: 0">
      <transition name="el-zoom-in-center">
        <div v-show="show2" class="transition-box">.el-zoom-in-center</div>
      </transition>

      <transition name="el-zoom-in-top">
        <div v-show="show2" class="transition-box">.el-zoom-in-top</div>
      </transition>

      <transition name="el-zoom-in-bottom">
        <div v-show="show2" class="transition-box">.el-zoom-in-bottom</div>
      </transition>
    </div>
  </div>
</div>
</template>

<script>
    export default {
        inject:['reload'],
        name: "FoodList",
      data: () => ({
        show2: false
      }),
      methods:{
          show(){
            this.show2 = true;
          }
      },
      mounted() {
          this.show();
      }
    }
</script>

<style scoped>
  .transition-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px;
  }
</style>
