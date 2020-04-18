<template>
  <div  class="container">
    <transition name="el-zoom-in-center">
      <div v-show="showMain" style="height: 500px">
        <div style="width: 100%;text-align: center"><span style="line-height: 50px;font-family: 'Helvetica Neue';font-size: 30px;color: white;font-weight: bolder;">订单列表</span></div>
        <el-header style="height: 40px" class="static">
          <el-row :gutter="5">
            <el-col :span="2">
              <el-select v-model="selectValue" placeholder="请选择" @change="dateTypeChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6" v-if="selectValue == 'month'">
              <el-date-picker v-model="monthValue" type="month" @change="dateChange" placeholder="选择月"></el-date-picker>
            </el-col>
            <el-col :span="6" v-if="selectValue == 'day'">
              <el-date-picker v-model="dayValue" type="date" @change="dateChange" placeholder="选择天"></el-date-picker>
            </el-col>
            <el-col :span="10">
              <el-button type="primary" @click="search" style="height: 40px;width: 100px" icon="el-icon-search">查询</el-button>
              <el-button type="primary" @click="reset" style="margin-right: 20px;height: 40px;width: 100px" icon="el-icon-refresh-right">重置</el-button>
            </el-col>
            <el-col :span="3">
              <el-button type="danger" plain size="mini" @click="deleteAll" icon="el-icon-delete" >删除</el-button>
            </el-col>
            <el-col :span="3">
              <el-button type="success"  size="mini" style="padding-left: 7px" @click.native="exportExcel(title)" @submit.native.prevent>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#ali-iconexcel"></use>
                </svg>&nbsp;&nbsp;导出</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main style="width: 80%;margin: 0 auto;padding: 0;height: 100%;background-color: white">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            style="width: 100%;margin: 30px auto">
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>
            <el-table-column
              label="序号"
              align="center"
              type="index">
            </el-table-column>
            <el-table-column
              label="编号"
              align="center"
            show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.oid}}
              </template>
            </el-table-column>
            <el-table-column
              label="点餐人"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column
              label="订单额度"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.subtotal}}</template>
            </el-table-column>
            <el-table-column
              label="生成时间"
              align="center">
              <template  slot-scope="scope">
                {{scope.row.ordertime}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.orderitems">
                    <el-table-column label="菜品名称" align="center">
                      <template slot-scope="scope">{{scope.row.food.foodName}}</template>
                    </el-table-column>
                    <el-table-column label="菜品现价(元)" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.food.isDiscount == 1">
                           {{scope.row.food.discountPrice}}
                        </span>
                       <span v-else>
                         {{scope.row.food.price}}
                       </span>
                      </template>
                    </el-table-column>
                    <el-table-column label="份数" align="center">
                      <template slot-scope="scope">{{scope.row.count}}</template>
                    </el-table-column>
                    <el-table-column label="折后小计(元)" align="center">
                      <template slot-scope="scope">{{scope.row.total}}</template>
                    </el-table-column>
                </el-table>
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
              layout="total,slot, sizes, prev, pager, next, jumper"
              :total="total">
              <span>，{{count}}单</span>
            </el-pagination>
          </div>
        </el-footer>
      </div>
    </transition>
  </div>

</template>

<script>
  import moment from 'moment';
  export default {
    name: "OrderMessage",
    data() {
      return {
        options: [{
          value: 'month',
          label: '月'
        }, {
          value: 'day',
          label: '天'
        }],
        selectValue: 'month',
        monthValue:moment().format('YYYY-MM'),
        dayValue:moment().format('YYYY-MM-DD'),
        start:moment().startOf('month').format('YYYY-MM-DD'),
        end: moment().endOf('month').format('YYYY-MM-DD'),
        showMain:false,
        tableData: [],
        multipleSelection: [],
        currentPage:1,
        pageSize:10,
        total:0,
        count:0,
        axiosParams: new Object(),
        title:'订单详情'
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
      search(){
        this.currentPage = 1;
        this.ajaxCall();
      },
      reset(){
        this.currentPage = 1;
        this.selectValue = 'month';
        this.monthValue = moment().format('YYYY-MM');
        this.start = moment().startOf('month').format('YYYY-MM-DD');
        this.end = moment().endOf('month').format('YYYY-MM-DD');
        this.ajaxCall();
      },
      dateTypeChange(){
        if (this.selectValue == "day"){
          this.start = moment(this.dayValue).startOf('day').format('YYYY-MM-DD');
          this.end = moment(this.dayValue).endOf('day').format('YYYY-MM-DD');
        }else {
          this.start = moment(this.monthValue).startOf('month').format('YYYY-MM-DD');
          this.end = moment(this.monthValue).endOf('month').format('YYYY-MM-DD');
        }
      },
      dateChange(val){
        if (this.selectValue == 'month'){
          let month =moment(val);
          let start = month.startOf('month').format('YYYY-MM-DD');
          let end  = month.endOf('month').format('YYYY-MM-DD');
          this.start = moment(start).format('YYYY-MM-DD');
          this.end = moment(end).format('YYYY-MM-DD')
        }else {
          let day =moment(val);
          let start = day.startOf('day').format('YYYY-MM-DD');
          let end  = day.endOf('day').format('YYYY-MM-DD');
          this.start = moment(start).format('YYYY-MM-DD');
          this.end = moment(end).format('YYYY-MM-DD')
        }

      },
      ajaxCall(){
        this.axiosParams = new Object();
        this.axiosParams.pageSize = this.pageSize;
        this.axiosParams.start = this.currentPage;
        this.axiosParams.startTime = this.start;
        this.axiosParams.endTime = this.end;
        this.$axios.post("/iorder/Order/list",this.axiosParams)
          .then(res=>{
            this.tableData = res.data.page.list;
            this.total = res.data.page.total;
            this.count = res.data.count;
          })
          .catch(e=>{
            console.log(e)
          });
      },
      handleDelete(row) {
        this.axiosParams = new Object();
        this.axiosParams.oid = row.oid;
        this.$confirm('此操作将永久删除此订单及订单项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post("/iorder/Order/delete",this.axiosParams)
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
      deleteAll(){
        this.$confirm('此操作将永久删除已选择的订单及订单项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(()=>{
            this.multipleSelection.forEach(data=>{
              this.axiosParams = new Object();
              this.axiosParams.oid = data.oid;
              this.$axios.post("/iorder/Order/delete",this.axiosParams)
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
            })
          }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      exportExcel(title){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.axiosParams = new Object();
        this.axiosParams.pageSize = this.total;
        this.axiosParams.start = 1;
        this.axiosParams.startTime = this.start;
        this.axiosParams.endTime = this.end;
        this.$axios({method: "post",url: "/iorder/Order/download", data: this.axiosParams, responseType: 'arraybuffer'})
          .then((res) => {
            let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
            let objectUrl = URL.createObjectURL(blob);
            let downloadElement = document.createElement('a');
            downloadElement.href = objectUrl;
            downloadElement.download = title+'.xlsx';
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
            window.URL.revokeObjectURL(objectUrl);
            loading.close();
          }).catch(()=>{});
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
