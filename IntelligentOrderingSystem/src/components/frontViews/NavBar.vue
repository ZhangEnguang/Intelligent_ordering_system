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
      <el-footer v-if="isLogin&&this.tableData!=null&&this.tableData!=''">
        <div style="text-align: right;height:100%;line-height: 60px">
          <el-button type="primary" @click="payWay">结算</el-button>
        </div>
      </el-footer>
      <el-footer v-else>
        <div style="text-align: right;height:100%;line-height: 60px">
          <el-button type="primary" disabled>结算</el-button>
        </div>
      </el-footer>
    </el-container>
  </el-drawer>
  <el-dialog title="支付方式" :visible.sync="dialogFormVisible" width="500px">
    <el-form :model="form" ref="form" :rules="rules" status-icon>
      <el-form-item label="是否有会员卡" :label-width="formLabelWidth">
        <el-radio v-model="radio" label="1">是</el-radio>
        <el-radio v-model="radio" label="2" >否</el-radio>
      </el-form-item>
      <el-form-item v-if="radio == 1" label="会员卡号" :label-width="formLabelWidth" prop="phone">
        <el-input type="text" v-model="form.phone"  @blur="checkPhone"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="payMoney('form')">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="用户打分" :visible.sync="rateView" width="500px">
    <div style="height: 100%">
      <el-rate
        v-model="value"
        :colors="colors">
      </el-rate>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateRate">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
    export default {
        name: "NavBar",
      data(){
        var checkPhone=(rule,value,callback)=>{
          let reg = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/
          if (!value){
            return callback(new Error('请输入手机号'))
          }else if(!reg.test(value)){
            return callback(new Error('请输入合法的手机号'))
          }else {
            return callback()
          }
        };
          return{
            drawer:false,
            url:'',
            dialogFormVisible:false,
            rateView:false,
            value: 3,
            colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
            axiosParams:new Object(),
            form:{
              phone:''
            },
            tableData:[],
            rules: {
              phone:[
                {required: true,validator: checkPhone,trigger:'blur'}
              ]
            },
            subtotal:parseFloat("0").toFixed(2),
            isLogin:false,
            radio:'2',
            formLabelWidth: '120px'
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
        checkPhone(){
          if (this.form.phone!=null&&this.form.phone!=""){
            this.axiosParams = new Object();
            this.axiosParams.phone = this.form.phone;
            this.$axios.post("/iorder/Vip/checkPhone",this.axiosParams)
              .then(res=>{
                if (res.data.vip == null){
                  this.$message({
                    message:'vip账号不存在,请重新输入！',
                    type:'warning',
                    center:true
                  })
                  this.form.phone = "";
                }
              })
              .catch(e=>{
                console.log(e);
              });
          }
        },
        payWay(){
          this.drawer = false;
          this.dialogFormVisible = true;
          this.radio = '2';
          this.form.phone = '';
        },
        updateRate(){
          this.axiosParams = new Object();
          let uid = this.$cookies.get('userID');
          this.axiosParams.uid = uid;
          this.axiosParams.value = parseFloat(this.value).toFixed(2);
          this.axiosParams.phone = this.form.phone;
          this.$axios.post("/iorder/User/updateRate",this.axiosParams)
          .then(res=>{
            this.rateView = false;
            if (res.data.vip == null||res.data.vip == ""){
              this.$message({
                message:'本次消费'+this.subtotal+'元，欢迎下次光临！',
                type:'success',
                center:true
              })
            }else {
              this.rateView = false;
              this.$message({
                message:'您是本店'+res.data.vip.levelName+
                  '会员，享受折上'+res.data.vip.discountNum+
                  '折优惠，折后本次消费'+(this.subtotal*parseFloat(res.data.vip.discountNum)/10).toFixed(2)+
                  '元，卡余额为' +res.data.vip.money+
                  '欢迎下次光临！',
                type:'success',
                center:true
              })
            }
            this.tableData = [];
            this.subtotal = parseFloat("0").toFixed(2);
          })
        },
        payMoney(formName){
          if (this.radio == 2){
            this.axiosParams = new Object();
            let uid = this.$cookies.get('userID');
            this.axiosParams.uid = uid;
            this.axiosParams.orderitems = this.tableData;
            this.axiosParams.subtotal = this.subtotal;
            this.$axios.post("/iorder/Order/addOrder",this.axiosParams)
              .then(()=>{
                //用户打分
                this.dialogFormVisible = false;
                this.rateView = true;
              })
              .catch(()=>{
              });

          }else {
            this.$refs[formName].validate((valid)=>{
              if (valid){
                  this.axiosParams = new Object();
                  this.axiosParams.phone = this.form.phone;
                  this.$axios.post("/iorder/Vip/checkPhone",this.axiosParams)
                    .then(res=>{
                      if (res.data.vip == null){
                        this.$message({
                          message:'vip账号不存在,请重新输入！',
                          type:'warning',
                          center:true
                        })
                        this.form.phone = "";
                      }else if(res.data.vip.state == 0){
                        this.$message({
                          message:'您的会员卡已冻结！',
                          type:'error',
                          center:true
                        })
                        this.dialogFormVisible = false;
                      }else if (res.data.vip.money<this.subtotal){
                        this.$message({
                          message:'余额不足，请前往充值！',
                          type:'warning',
                          center:true
                        })
                        this.dialogFormVisible = false;
                      }else {
                        this.axiosParams = new Object();
                        let uid = this.$cookies.get('userID');
                        this.axiosParams.uid = uid;
                        this.axiosParams.orderitems = this.tableData;
                        this.axiosParams.subtotal = (this.subtotal*parseFloat(res.data.vip.discountNum)/10).toFixed(2);
                        this.$axios.post("/iorder/Order/addOrder?phone="+this.form.phone,this.axiosParams)
                          .then(()=>{
                            //用户打分
                            this.dialogFormVisible = false;
                            this.rateView = true;
                          })
                          .catch(()=>{
                          });

                      }
                    })
                    .catch(e=>{
                      console.log(e);
                    });
                }
            })
          }
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
