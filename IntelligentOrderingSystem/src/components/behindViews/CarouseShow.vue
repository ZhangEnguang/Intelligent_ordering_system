<template>
    <div class="container">
      <transition name="el-zoom-in-center">
        <div v-show="showMain" style="height: 500px">
          <div style="width: 100%;text-align: center"><span style="line-height: 50px;font-family: 'Helvetica Neue';font-size: 30px;color: white;font-weight: bolder;">轮播图预览</span></div>
          <el-main style="width: 80%;margin: 0 auto;padding: 0;height: 100%;background-color: white">
            <div class="block">
              <el-carousel height="500px">
                <el-carousel-item v-for="(item,key) in images" :key="key">
                  <el-image
                    style="width: 100%; height: 100%;"
                    :src="item"
                    fit="fill "></el-image>
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-main>
        </div>
      </transition>
    </div>
</template>

<script>
    export default {
        name: "CarouseShow",
      data(){
          return{
            showMain:false,
            images:[]
          }
      },
      mounted() {
        let val = this.$cookies.get('root')
        if(val == 2){
          this.showMain = true;
          this.ajaxCall();
        }else {
          this.$router.push('/FoodList');
        }
      },
      methods:{
          ajaxCall(){
            this.$axios.post("/iorder/Carousel/search")
              .then(res=>{
                if (res.data!=null&&res.data!=""){
                  this.images = res.data;
                }else {
                  this.images.push("/static/images/default/lunbo3.jpg");
                }

              })
              .catch(e=>{
                console.log(e)
              })
          }
      }
    }
</script>

<style scoped>
  .container{
    background-color: #545c64;
    height: 670px;
    border-top: 1px solid white;
  }
</style>
