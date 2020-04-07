<template>
  <div class="container">
    <transition name="el-zoom-in-center">
      <div v-show="showMain" style="height: 400px">
        <el-main style="width: 98%;margin: 10px auto 0 auto;padding: 0;height: 100%;background-color: #409EFF">

        </el-main>
        <el-footer style="padding: 0;background: white;width: 98%;margin: 0 auto">
          <div class="block" style="text-align: center">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </el-footer>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "FoodList",
    data(){
      return{
        showMain:false,
        listTop:[],
        listBottom:[],
        currentPage:1,
        pageSize:8,
        total:0,
      }
    },
    mounted() {
        this.showMain = true;
        this.ajaxCall();

    },
    methods:{
      handleCurrentChange(val) {
        this.currentPage = val;
        this.ajaxCall();
      },
      ajaxCall(){
        this.$axios.post("/iorder/Food/search")
          .then(res=>{
            if (res.data!=null&&res.data!=""){
              this.images = res.data;
            }else {
              this.images.push("./static/images/default/lunbo3.jpg");
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
    height: 500px;
    border-top: 1px solid white;
  }
</style>
