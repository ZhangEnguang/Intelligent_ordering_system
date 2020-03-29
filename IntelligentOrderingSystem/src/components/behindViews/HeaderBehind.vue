<template>
  <div style="padding: 0;margin: 0">
    <el-header style="padding: 0;margin: 0;height: 60px">
      <div style="background: #545c64;width: 100%;height: 100%;line-height: 60px;">
        <span style="color: white;font-weight: bolder;font-size: 40px">麻辣牛仔后台管理系统</span>
        <el-dropdown @command="handleCommand" style="float: right;margin-right: 30px">
          <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right" style="color: white"></i>
          </span>
          <el-dropdown-menu slot="dropdown" v-if="!isLogin">
            <el-dropdown-item command="a">登录</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu slot="dropdown" v-if="isLogin" >
            <el-dropdown-item command="b">切换账户</el-dropdown-item>
            <el-dropdown-item command="c">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </el-header>
    <el-container>
      <el-aside width="14%" >
        <UserMsg></UserMsg>
      </el-aside>
      <el-main style="padding:5px 0 5px 5px;">
        <div class="block">
          <el-carousel height="205px">
            <el-carousel-item v-for="(item,key) in images" :key="key">
              <el-image
                style="width: 100%; height: 100%;"
                :src="item.src"
                fit="fill "></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import UserMsg from "./UserMsg";
  export default {
    inject:['reload'],
    name: "Header",
    components: {UserMsg},
    data(){
      return{
        images:[
          {src:'../static/images/carousel/lunbo1.jpg'},
          {src:'../static/images/carousel/lunbo2.jpg'},
          {src:'../static/images/carousel/lunbo3.jpg'},
        ],
        isLogin:""
      }
    },
    methods:{
      ajaxCall(){
        this.$axios.post("/iorder/Login/isLogin")
          .then(res=>{
            this.isLogin = res.data;
          })
          .catch(e=>{
            console.log(e);
          })
      },
      handleCommand(command) {
        if (command == 'a') {
          this.$router.push("/");
        }
        if (command == 'b') {
          this.$axios.post("/iorder/Login/notLogin")
            .then(res=>{
              this.$router.push("/");
            })
            .catch(e=>{
              console.log(e);
            })
        }
        if (command == 'c'){
          this.$axios.post("/iorder/Login/notLogin")
            .then(res=>{
              this.reload();
            })
            .catch(e=>{
              console.log(e);
            })
        }
      }
    },
    mounted() {
      this.ajaxCall();
    }
  }
</script>

<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
</style>
