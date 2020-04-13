<template>
<div >
  <el-row  style="height: 600px;background-color: #545c64">
    <el-col :span="24">
      <el-menu default-active='1-2' class="el-menu-vertical-demo"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b"
               router>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>点餐</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1" route="/DiscountList" @click="setUrl('/DiscountList')">放肆点餐</el-menu-item>
            <el-menu-item index="1-2" route="/FoodList" @click="setUrl('/FoodList')">麻辣狂欢</el-menu-item>
            <el-menu-item index="1-3" route="/GracefulList" @click="setUrl('/GracefulList')">优雅清淡</el-menu-item>
            <el-menu-item index="1-4" route="/DrinkList" @click="setUrl('/DrinkList')">痛快畅饮</el-menu-item>
            <el-menu-item index="1-5" route="/SweetList" @click="setUrl('/SweetList')">餐后甜品</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>会员</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1" route="/AddCard" @click="setUrl('/AddCard')">办理会员</el-menu-item>
            <el-menu-item index="2-2" route="/VipRecharge" @click="setUrl('/VipRecharge')">会员充值</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="3" @click="drawer = true" :route="url">
          <template slot="title">
            <i class="el-icon-s-order"></i>
            <span style="font-weight: bolder;font-size: 20px">订单详情</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>

  <el-drawer
    title="我是标题"
    :visible.sync="drawer"
    :with-header="false"
    size="50%">
    <el-container>
      <el-header>
        <div style="text-align: center">
          <span style="font-size: 30px;line-height: 60px">订单详情</span>
        </div>
      </el-header>
      <el-main v-if="isLogin" style="height: 600px;background-color: #8c939d;padding: 10px;">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          max-height="500"
          style="width: 100%;margin: 30px auto;height: 80%">
          <el-table-column
            label="编号"
            type="index"
            align="center"
            width="80px">
          </el-table-column>
          <el-table-column
            label="菜品名称"
            align="center">
            <template slot-scope="scope">
              {{scope.row.food.foodName}}
            </template>
          </el-table-column>
          <el-table-column
            label="菜品现价(元)"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.food.isDiscount == 1"> {{scope.row.food.discountPrice}}</span>
              <span v-else> {{scope.row.food.price}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="份数"
            width="200px"
            align="center">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.count" @change="handleChange" size="mini" :min="1" :max="10"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            label="小计(元)"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.food.isDiscount == 1">
                {{(parseFloat(scope.row.food.discountPrice)*parseFloat(scope.row.count)).toFixed(2)}}
              </span>
              <span v-else>
                {{(parseFloat(scope.row.food.price)*parseFloat(scope.row.count)).toFixed(2)}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" >
            <template slot-scope="scope" >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right">
          <span class="font">合计:{{subtotal}}元</span>
        </div>
      </el-main>
      <el-main v-else style="height: 600px;background-color: #8c939d;padding: 10px;">
        <div style="height: 100%;text-align: center;line-height: 400px">
          <span class="font">请登录</span>
        </div>
      </el-main>
      <el-footer v-if="isLogin">
        <div style="text-align: right;height:100%;line-height: 60px">
          <el-button type="primary">结算</el-button>
        </div>
      </el-footer>
      <el-footer v-else>
        <div style="text-align: right;height:100%;line-height: 60px">
          <el-button type="primary" disabled>结算</el-button>
        </div>
      </el-footer>
    </el-container>
  </el-drawer>
</div>
</template>

<script>
    export default {
        name: "NavBar",
      data(){
          return{
            drawer:false,
            url:'',
            tableData:[],
            subtotal:parseFloat("0").toFixed(2),
            isLogin:false
          }
      },
      methods:{
        setUrl(urlName){
          this.url = urlName;
        },
        handleChange(){
          this.sumPrice();
        },
        handleDelete(row){
          this.tableData.splice(this.tableData.indexOf(row),1);
          this.sumPrice();
        },
        sumPrice(){
          let num = 0;
          this.tableData.forEach(data=>{
            if (data.food.isDiscount == 1){
              num=num+ parseFloat(data.food.discountPrice)*parseFloat(data.count);
            }else {
              num =num+ parseFloat(data.food.price)*parseFloat(data.count);
            }
          })
          this.subtotal = parseFloat(num).toFixed(2);
        }
      },
      mounted() {
        let val = this.$cookies.get('root');
        if (val!=null&&val!=""){
          this.isLogin = true;
          eventBus.$on('food',res=>{
            let b = false;
            this.tableData.forEach(data=>{
              if(res.foodName == data.food.foodName){
                b = true;
              }
            })
            if (!b){
              this.tableData.push({food:res,count:1})
            }else {
              this.tableData.forEach(data=>{
                if(res.foodName == data.food.foodName){
                  data.count++;
                }
              })
            }
        this.sumPrice();
          })
        }
      },
      beforeDestroy() {
        eventBus.$off('food');
      }
    }
</script>

<style scoped>
  .font{
    line-height: 50px;
    font-family: 'Helvetica Neue';
    font-size: 30px;
    color: white;
    font-weight: bolder;
  }
</style>
