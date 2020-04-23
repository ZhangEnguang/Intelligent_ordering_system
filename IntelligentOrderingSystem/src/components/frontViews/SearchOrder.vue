<template>
  <div class="container">
    <div style="width: 100%;text-align: center;margin: 40px auto;"><span class="font">订单查询</span></div>
    <el-header style="height: 40px" >
      <el-row :gutter="5" style="width: 80%;margin: 0 auto">
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
        <el-col :span="5">
          <el-select v-model="tid" filterable placeholder="请选择"   >
            <el-option
              v-for="(item,key) in table"
              :key="key"
              :label="item.tableName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input   v-model="input" clearable placeholder="请输入订单号" @change="search"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="search" style="height: 40px;width: 100px" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="reset" style="height: 40px;width: 100px" icon="el-icon-refresh-right">重置</el-button>
        </el-col>
      </el-row>
    </el-header>
    <transition name="el-zoom-in-bottom">
      <div v-show="showMain" style="height: 50%;display: block">
        <el-main style="width: 80%;margin: 40px auto 0 auto;padding: 0;height: 100%;background-color: white">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
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
              <template slot-scope="scope">
                <span v-if="scope.row.name == null">
                  员工已离职
                </span>
                <span v-else>
                  {{scope.row.name}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="订单额度"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.subtotal}}</template>
            </el-table-column>
            <el-table-column
              label="餐桌名称"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.tableName == null">
                  餐桌已移除
                </span>
                <span v-else>
                  {{scope.row.tableName}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="生成时间"
              align="center">
              <template  slot-scope="scope">
                {{scope.row.ordertime}}
              </template>
            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.orderitems">
                  <el-table-column label="菜品名称" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.food == null">
                          菜品已删除
                        </span>
                      <span v-else>
                          {{scope.row.food.foodName}}
                        </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="菜品现价(元)" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.food == null">
                          菜品已删除
                        </span>
                      <span v-else>
                          <span v-if="scope.row.food.isDiscount == 1">
                           {{scope.row.food.discountPrice}}
                        </span>
                       <span v-else>
                         {{scope.row.food.price}}
                       </span>
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
  import moment from "moment";
  export default {
    name: "SearchOrder",
    data(){
      return{
        showMain:false,
        axiosParams:new Object(),
        options: [{
          value: 'month',
          label: '月'
        }, {
          value: 'day',
          label: '天'
        }],
        tableData:[],
        input:'',
        tid:'',
        table:[],
        currentPage:1,
        pageSize:10,
        total:0,
        count:0,
        selectValue: 'month',
        monthValue:moment().format('YYYY-MM'),
        dayValue:moment().format('YYYY-MM-DD'),
        start:moment().startOf('month').format('YYYY-MM-DD'),
        end: moment().endOf('month').format('YYYY-MM-DD'),
      }
    },
    methods:{
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
        this.axiosParams.input = this.input;
        this.axiosParams.tid = this.tid;
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
      search(){
        let val = this.$cookies.get('root');
        if (val==null||val==""){
          this.$message({
            message:'请登录后操作',
            type:'warning',
            center:true
          })
        }else {
          this.currentPage = 1;
          this.ajaxCall();
          this.showMain = true;
        }
      },
      reset(){
        this.selectValue = 'month';
        this.input = '';
        this.tid = '';
        this.monthValue = moment().format('YYYY-MM');
        this.start = moment().startOf('month').format('YYYY-MM-DD');
        this.end = moment().endOf('month').format('YYYY-MM-DD');
        this.ajaxCall();
        this.showMain = false;
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.ajaxCall();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.ajaxCall();
      }
    },
    mounted() {
      this.$axios.post("/iorder/Table/list")
        .then(res=>{
          this.table = res.data.list;
        })
        .catch(e=>{
          console.log(e)
        })
    }
  }
</script>

<style scoped>
  .container{
    background-color: #545c64;
    height: 700px;
    border-top: 1px solid white;
  }
  .font{
    line-height: 50px;
    font-family: 'Helvetica Neue';
    font-size: 60px;
    color: white;
    font-weight: bolder;
  }
</style>
