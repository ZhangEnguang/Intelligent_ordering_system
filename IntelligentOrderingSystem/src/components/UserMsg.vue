<template>
  <div >
    <el-row>
      <el-col :span="24">
        <el-card :body-style="{ padding: '0px' }" v-if="isLogin" style="margin:5px 0 5px 0;width: auto;height: 205px">
          <img :src="src" class="image">
          <div style="padding: 14px; text-align: center">
            <span style="text-align: center;font-weight: bolder">点餐员{{name}}</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
            </div>
          </div>
        </el-card>
        <el-card :body-style="{ padding: '0px' }" v-if="!isLogin" style="margin:5px 0 5px 0;width: auto;height: 205px">
          <el-image
            style="margin-left: 53px;width: 50%;height: 90px"
            src="static/images/user/isNotLogin.png"
            fit="fill "></el-image>
        <div style="padding: 14px; text-align: center">
          <el-button type="primary" @click="goLogin">请登录</el-button>
          <div class="bottom clearfix">
            <time class="time">{{ currentDate }}</time>
          </div>
        </div>
      </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "UserMsg",
      data() {
        return {
          currentDate: new Date(),
          src:'',
          name:'',
          isLogin:false
        };
      },
      methods:{
          ajaxCall(){
            this.$axios.post("/iorder/User/findUser")
            .then(res=>{
              if (res.data.user!=null){
                this.isLogin = true;
                this.src = "."+res.data.user.img;
                this.name = res.data.user.name;
              }else {
                this.isLogin = false;
              }
            })
          },
        goLogin(){
            this.$router.push("/")
        }
      },
      mounted() {
          this.ajaxCall();
      }
    }
</script>

<style scoped>
  .time {
    font-size: 13px;
    color: white;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .image {
    width: 50%;
    margin: 0 auto;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
