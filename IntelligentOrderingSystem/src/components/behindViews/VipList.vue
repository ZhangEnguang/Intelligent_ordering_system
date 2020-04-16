<template>
  <div  class="container">
    <transition name="el-zoom-in-center">
      <div v-show="showMain" style="height: 500px">
        <div style="width: 100%;text-align: center"><span style="line-height: 50px;font-family: 'Helvetica Neue';font-size: 30px;color: white;font-weight: bolder;">Vip列表</span></div>
        <el-header style="height: 40px" class="static">
          <el-input style="width: 200px;float: right;" v-model="input" placeholder="请输入Vip信息"></el-input>
          <el-button type="primary" @click="search" style="margin-right: 20px;float: right;height: 40px;width: 100px" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="reset" style="margin-right: 20px;float: right;height: 40px;width: 100px" icon="el-icon-refresh-right">重置</el-button>
        </el-header>
        <el-main style="width: 80%;margin: 0 auto;padding: 0;height: 100%;background-color: white">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;margin: 30px auto">
            <el-table-column
              label="编号"
              align="center"
              type="index">
            </el-table-column>
            <el-table-column
              label="姓名"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column
              label="联系方式"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.phone}}</template>
            </el-table-column>
            <el-table-column
              label="余额(元)"
              align="center">
              <template  slot-scope="scope">
                {{scope.row.money}}
              </template>
            </el-table-column>
            <el-table-column
              label="累计充值(元)"
              align="center">
              <template slot-scope="scope">{{scope.row.buyNum}}</template>
            </el-table-column>
            <el-table-column
              label="会员卡级别"
              align="center">
              <template slot-scope="scope">{{scope.row.levelName}}</template>
            </el-table-column>
            <el-table-column
              label="会员卡折扣(折)"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.discountNum == 0">暂无折扣</span>
                <span v-else>{{scope.row.discountNum}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="是否冻结"
              align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.state"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949" @change="switchChange($event,scope.row.id)" ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)" icon="el-icon-delete">注销</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer style="padding: 0;background: white;width: 80%;margin: 0 auto">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
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
    name: "VipList",
    data() {
      return {
        showMain:false,
        tableData: [],
        currentPage:1,
        pageSize:10,
        total:0,
        axiosParams: new Object(),
        input:"",
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
    methods: {
      switchChange(event,id){
        this.axiosParams = new Object();
        this.axiosParams.event = event;
        this.axiosParams.id = id;
        this.$axios.post("/iorder/Vip/updateState",this.axiosParams)
          .then(res=>{
          })
          .catch(e=>{
            console.log(e)
          })
      },

      search(){
        this.currentPage = 1;
        this.ajaxCall();
      },
      reset(){
        this.input = "";
        this.ajaxCall();
      },
      ajaxCall(){
        this.axiosParams = new Object();
        this.axiosParams.pageSize = this.pageSize;
        this.axiosParams.start = this.currentPage;
        this.axiosParams.input = this.input;
        this.$axios.post("/iorder/Vip/list",this.axiosParams)
          .then(res=>{
            this.tableData = res.data.page.list;
            this.total = res.data.page.total;
          })
          .catch(e=>{
            console.log(e)
          });
      },
      handleDelete(row) {
        this.axiosParams = new Object();
        this.axiosParams.id = row.id;
        this.$confirm('此操作将永久删除此会员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post("/iorder/Vip/delete",this.axiosParams)
            .then(res=>{
              if(res.data == true){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.currentPage = 1;
                this.ajaxCall();
              }else {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                });
              }

            })
            .catch(()=>{
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.ajaxCall();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.ajaxCall();
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader i  {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
  }
  .static{
    position:absolute;
    margin-left: 140px;
    z-index: 6;
    background-color: white;
    width: 1000px;
  }
  .container{
    background-color: #545c64;
    height: 670px;
    border-top: 1px solid white;
  }
</style>
