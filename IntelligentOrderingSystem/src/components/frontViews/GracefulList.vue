<template>
  <div class="container">
    <transition name="el-zoom-in-center">
      <div v-show="showMain" style="height: 450px">
        <el-header style="padding: 0;background: #545c64;width: 100%;margin: 0 auto" >
          <el-select v-model="typeid" filterable clearable placeholder="请选择菜品种类" style="float: right;margin-right: 20px" @change="search">
            <el-option
              v-for="(item,key) in foodType"
              :key="key"
              :label="item.typeName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input style="width: 200px;float: left;margin-left: 20px" v-model="input" clearable placeholder="请输入描述内容"></el-input>
          <el-button type="primary" style="margin-left: 20px" icon="el-icon-search" @click="search">搜索</el-button>
        </el-header>
        <el-main style="width: 98%;margin: 10px auto 0 auto;padding: 0;height: 100%" v-if="listTop!=''&&listTop!=null">
          <el-row :gutter="40" style="margin: 10px 30px 0 0">
            <el-col :span="6" v-for="(item,key) in listTop" :key="key" >
              <div class="grid-content bg-purple">
                <el-row>
                  <el-badge :value="item.discount+'折'" v-if="item.isDiscount == 1">
                    <el-image class="image" fit="fill" :src="'.'+item.img" :preview-src-list="['.'+item.img]"></el-image>
                  </el-badge>
                  <el-image v-else class="image" fit="fill" :src="'.'+item.img" :preview-src-list="['.'+item.img]"></el-image>
                </el-row>
                <el-row>
                  <el-col :span="14">
                    <el-popover
                      placement="bottom"
                      title="菜品详情"
                      width="200"
                      trigger="hover">
                      <p>{{item.description}}</p>
                      <div style="text-align: right; margin: 10px">
                        <el-button type="primary" size="mini" @click="addItem(item)" icon="el-icon-circle-plus-outline">添加订单</el-button>
                      </div>
                      <div slot="reference" class="description"><span  class="foodName">{{item.foodName}}</span></div>
                    </el-popover>
                  </el-col>
                  <el-col :span="10">
                    <el-row>原价：{{item.price}}￥</el-row>
                    <el-row v-if="item.isDiscount==1"><span style="color: red">现价：{{item.discountPrice}}￥</span></el-row>
                    <el-row v-else>现价：{{item.price}}￥</el-row>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="40" style="margin: 10px 30px auto auto">
            <el-col :span="6" v-for="(item,key) in listBottom" :key="key">
              <div class="grid-content bg-purple">
                <el-row>
                  <el-badge :value="item.discount+'折'" v-if="item.isDiscount == 1">
                    <el-image class="image" fit="fill" :src="'.'+item.img" :preview-src-list="['.'+item.img]"></el-image>
                  </el-badge>
                  <el-image v-else class="image" fit="fill" :src="'.'+item.img" :preview-src-list="['.'+item.img]"></el-image>
                </el-row>
                <el-row>
                  <el-col :span="14">
                    <el-popover
                      placement="bottom"
                      title="菜品详情"
                      width="200"
                      trigger="hover">
                      <p>{{item.description}}</p>
                      <div style="text-align: right; margin: 10px">
                        <el-button type="primary" size="mini" @click="addItem(item)" icon="el-icon-circle-plus-outline">添加订单</el-button>
                      </div>
                      <div slot="reference" class="description"><span  class="foodName">{{item.foodName}}</span></div>
                    </el-popover>
                  </el-col>
                  <el-col :span="10">
                    <el-row>原价：{{item.price}}￥</el-row>
                    <el-row v-if="item.isDiscount==1"><span style="color: red">现价：{{item.discountPrice}}￥</span></el-row>
                    <el-row v-else>现价：{{item.price}}￥</el-row>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-main>
        <el-main style="width: 98%;margin: 10px auto 0 auto;padding: 0;height: 100%" v-else>
          <div style="text-align: center;height: 100%;">
            <span style="color: white;font-weight: bolder;font-size: 100px;line-height: 300px">暂无上架菜品</span>
          </div>
        </el-main>
        <el-footer style="padding: 0;background-color: white;width: 98%;margin: 0 auto;border-radius: 40px">
          <div  style="text-align: center;">
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
    <el-dialog title="餐桌选择" :visible.sync="dialogTableVisible" style="margin: 0 auto;width: 800px;">
      <div style="text-align: center;height: 100px;margin-top: 50px">
        <el-select v-model="value" filterable placeholder="请选择"   >
          <el-option
            v-for="(item,key) in table"
            :key="key"
            :label="item.tableName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setTable">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "GracefulList",
    data(){
      return{
        showMain:false,
        axiosParams:new Object(),
        dialogTableVisible:false,
        table:[],
        value:'',
        listTop:[],
        listBottom:[],
        currentPage:1,
        pageSize:8,
        foodType:[],
        total:0,
        input:'',
        typeid:''
      }
    },
    mounted() {
      this.showMain = true;
      this.ajaxCall();
      this.value = this.$cookies.get('table');
      if (this.value!=''){
        eventBus.$emit('table',parseInt(this.value));
      }
    },
    methods:{
      handleCurrentChange(val) {
        this.currentPage = val;
        this.ajaxCall();
      },
      setTable(){
        if (this.value!=null&&this.value!=''){
          eventBus.$emit("table",this.value);
          this.$cookies.set("table",this.value,"1d");
        }
        this.dialogTableVisible = false;
      },
      addItem(item){
        let val = this.$cookies.get('root');
        if (val==null||val==""){
          this.$message({
            message:'请登录后操作',
            type:'warning',
            center:true
          })
        }else {
          if (this.$cookies.get('table') == null||this.$cookies.get('table') == ''){
            this.dialogTableVisible = true;
          }else {
            eventBus.$emit('food',item);
            this.$message({
              message:'添加成功',
              type:'success',
              center:true
            })
          }

        }
      },
      search(){
        this.currentPage = 1;
        this.ajaxCall();
      },
      ajaxCall(){
        this.axiosParams = new Object();
        this.axiosParams.input  = this.input;
        this.axiosParams.typeid  = this.typeid;
        this.axiosParams.pageSize = this.pageSize;
        this.axiosParams.start = this.currentPage;
        this.axiosParams.sid = 3;
        this.$axios.post("/iorder/Food/searchFood",this.axiosParams)
          .then(res=>{
            this.listTop = [];
            this.listBottom = [];
            res.data.page.list.forEach((value, index) => {
              if (index<=3){
                this.listTop.push(value);
              }else {
                this.listBottom.push(value);
              }
            });
            this.total = res.data.page.total;
          })
          .catch(e=>{
            console.log(e)
          });
        this.$axios.post("/iorder/FoodType/list")
          .then(res=>{
            this.foodType =res.data.list;
          })
          .catch(e=>{
            console.log(e)
          });
        this.$axios.post("/iorder/Table/list")
          .then(res=>{
            this.table = res.data.list;
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
    height: 600px;
    border-top: 1px solid white;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .grid-content {
    border-radius: 10px;
    min-height: 100px;
  }
  .image{
    height: 150px;
    width: 100%;
    border-radius: 10px 10px 0 0px;
  }
  .description{
    text-align: center;
    cursor: pointer;
  }
  .description:hover{
    color: #f60;
  }
  .foodName{
    font-weight: bolder;
    font-size: 30px;
  }
</style>
