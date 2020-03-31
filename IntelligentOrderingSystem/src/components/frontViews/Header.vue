<template>
  <div style="padding: 0;margin: 0">
    <el-header style="padding: 0;margin: 0;height: 60px">
      <div style="background: #545c64;width: 100%;height: 100%;line-height: 60px;">
        <span style="color: white;font-weight: bolder;font-size: 40px">麻辣牛仔欢迎您!</span>
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
                :src="'..'+item"
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
              images:[],
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
            this.$axios.post("/iorder/Carousel/search")
            .then(res=>{
              if (res.data!=null&&res.data!=""){
                this.images = res.data;
              }else {
                this.images.push("/static/images/carousel/lunbo3.jpg");
                console.log(this.images)
              }

            })
            .catch(e=>{
              console.log(e)
            })
          },
        handleCommand(command) {
          if (command == 'a') {
            this.$router.push("/");
          }
          if (command == 'b') {
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
          if (command == 'c'){
            this.$confirm('您即将退出系统, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.post("/iorder/Login/notLogin")
                .then(res=>{
                  this.reload();
                  const h = this.$createElement;
                  this.$notify({
                    title: '注销提醒',
                    message: h('i', { style: 'color: teal'}, '您已成功退出登录，请浏览菜品，如需点餐请呼叫职员登录，很高兴为您服务，祝您用餐愉快！')
                  });
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
