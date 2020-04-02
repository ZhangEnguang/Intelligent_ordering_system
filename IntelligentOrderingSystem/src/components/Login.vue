<template>
  <div>
    <!--flex弹性盒子模型，justify-content：主抽 -->
    <div class="contain">
      <el-card class="el-card">
        <table class="table">
          <tr class="tr">
            <td colspan="2" style="padding: 0">
              <span class="text">麻辣牛仔</span>
            </td>
          </tr>
          <tr class="tr">
            <!-- 占两行-->
            <td colspan="2" >
              <!-- 点击事件的两种不同的写法v-on:click和 @click-->
              <el-image
                class="el-image"
                src="/static/images/login/restaurant.png"
                fit="fill "></el-image>
            </td>
          </tr>
          <tr >
            <td><span class="span-text">用户名</span></td>
            <td>
              <el-input v-model="user.username" placeholder="请输入用户名"  @blur="isExit"></el-input>
            </td>
          </tr>
          <tr >
            <td><span class="span-text">密&nbsp;&nbsp;&nbsp;&nbsp;码</span></td>
            <td>
              <el-input type="password" v-model="user.password" placeholder="请输入密码" show-password @keydown.enter.native="doLogin"></el-input>
              <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
            </td>
          </tr>
          <tr >
            <!-- 占两行-->
            <td colspan="2">
              <!-- 点击事件的两种不同的写法v-on:click和 @click-->
              <el-button style="width: 300px;margin-top: 20px" type="primary" @click="doLogin">登录</el-button>
            </td>
          </tr>
          <tr class="tr">
            <!-- 占两行-->
            <td colspan="2">
              <!-- 点击事件的两种不同的写法v-on:click和 @click-->
              <el-link type="primary" :underline="false" @click="goOrder">暂不登录</el-link>
            </td>
          </tr>
        </table>
      </el-card>
    </div>
  </div>
</template>
<script>
  export default {
    //单页面中不支持前面的data:{}方式
    data() {
      //相当于以前的function data(){},这是es5之前的写法，新版本可以省略掉function
      return{
        user:{
          username:'',
          password:'',
          //为了登录方便，可以直接在这里写好用户名和密码的值
        },
        axiosParams:new Object()
      }
    },
    methods:{
      ajaxCall(){
        this.axiosParams.username = this.user.username;
        this.axiosParams.password = this.user.password;
      },
      doLogin(){//一点击登录按钮，这个方法就会执行
        this.ajaxCall();
        if (this.user.username!=""&&this.user.password!=""){
          this.$axios.post("/iorder/Login/login",this.axiosParams)
            .then(res=>{
              if (res.data.res == true){
                if (res.data.user.root == 1){
                  this.$message({
                    message: '欢迎职员'+res.data.user.name+'点餐',
                    type: 'success',
                    center: true
                  })
                  this.$router.push('/FoodList')
                }else {
                  this.$message({
                    message: '欢迎经理'+res.data.user.name+'登录系统',
                    type: 'success',
                    center: true
                  })
                  this.$router.push('/Home')
                }
              }else {
                this.$message({
                  message: '密码错误请再此输入',
                  type: 'warning',
                  center:true
                });
              }
            })
            .catch(e=>{
              console.log(e);
            })
        }else {
          this.$message({
            message: '用户名或密码不能为空',
            type: 'warning',
            center:true
          });
        }

      },
      isExit(){
        this.axiosParams.username = this.user.username;
        if (this.user.username!=null&&this.user.username!=""){
          this.$axios.post("/iorder/Login/isExit",this.axiosParams)
            .then(res=>{
              if (res.data.user==null){
                this.$message({
                  message: '用户不存在请重新输入',
                  type: 'warning',
                  center:true
                });
              }
            })
          .catch(e=>{
            console.log(e);
          })
        }
      },
      goOrder(){
        this.$axios.post("/iorder/Login/notLogin")
        .then(res=>{
          this.$router.push("/FoodList")
        })
        .catch(e=>{
          console.log(e);
        })
      }
    }
  }
</script>
<style>
  .contain{
    display: flex;
    justify-content: center;
    margin-top: 150px;
  }
  .el-card{
    width: 600px;
    height: 400px;
    background:#cecece;
    padding: 0;
  }
  .table{
    margin: auto;
  }
  .text{
    font-family: 'Helvetica Neue';
    font-size: 50px;
    color: white;
    font-weight: bolder;
  }
  .tr{
    text-align: center;
  }
  .el-image{
    width: 110px;
    height: 110px;
    padding: 0px;
  }
  .span-text{
    color: white;
    font-weight: bolder;
  }
</style>
