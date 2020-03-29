<template>
  <div style="padding: 0;margin: 0">
    <el-container>
      <el-main style="padding: 0;margin: 0;height: 60px">
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
              <el-dropdown-item command="b">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  export default {
    inject:['reload'],
    name: "HeaderBehind",
    data(){
      return{
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
        if (command == 'b'){
          this.$confirm('您即将退出系统, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post("/iorder/Login/notLogin")
              .then(res=>{
                this.$router.push("/");
              })
              .catch(e=>{
                console.log(e);
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '操作已取消',
              center:true
            });
          });
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
