<template>
  <div class="container">
    <transition name="el-zoom-in-center">
      <div v-show="showMain" style="height: 500px">
        <div style="width: 100%;text-align: center;margin-top: 20px;"><span class="font">会员充值</span></div>
        <el-card class="card">
          <el-form :model="vip" status-icon :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="手机号" prop="phone">
              <el-input type="text" v-model="vip.phone" autocomplete="off" @blur="checkPhone"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input type="text" v-model="vip.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="充值额度" prop="money">
              <el-input type="text" v-model="vip.money" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:30px;text-align: center">
              <el-button type="primary" @click="recharge('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "VipRecharge",
    data(){
      var checkName=(rule,value,callback)=>{
        let reg = /^[\u4e00-\u9fa5]+$/
        if (!value){
          return callback(new Error('请输入员工姓名'))
        }else if (!reg.test(value)){
          return callback(new Error('员工姓名只能是中文'))
        }else {
          callback()
        }
      };
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
      var checkMoney=(rule,value,callback)=>{
        let reg = /^[1-9]d*.d*|0.d*[1-9]d*|0?.0+|0$/
        if (!value){
          return callback(new Error('请输入充值额度'))
        }else if (!reg.test(value)){
          return callback(new Error('请输入正确的金额'))
        }else {
          callback()
        }
      };
      return{
        showMain:false,
        rules:{
          name:[
            {required: true,validator: checkName,trigger:'blur'}
          ],
          phone:[
            {required: true,validator: checkPhone,trigger:'blur'}
          ],
          money: [
            {required: true,validator: checkMoney,trigger:'blur'}
          ]
        },
        vip:{
          name:'',
          phone:'',
          money:''
        },
        axiosParams:new Object()
      }
    },
    methods:{
      resetForm(formName){
        this.$refs[formName].resetFields();
      },
      checkPhone(){
        if (this.vip.phone!=null&&this.vip.phone!=""){
          this.axiosParams = new Object();
          this.axiosParams.phone = this.vip.phone;
          this.$axios.post("/iorder/Vip/checkPhone",this.axiosParams)
            .then(res=>{
              if (res.data.vip == null){
                this.$message({
                  message:'vip账号不存在,请重新输入！',
                  type:'warning',
                  center:true
                })
                this.vip.phone = "";
              }
            })
            .catch(e=>{
              console.log(e);
            });
        }
      },
      recharge(formName){
        let val = this.$cookies.get('root');
        if (val==null||val==""){
          this.$message({
            message:'请登录账户后操作！',
            type:'error',
            center:true
          })
        }else {
          this.$refs[formName].validate((valid)=>{
            if (valid){
              this.axiosParams = new Object();
              this.axiosParams.name = this.vip.name;
              this.axiosParams.phone = this.vip.phone;
              this.axiosParams.money = parseFloat(this.vip.money).toFixed(2);
              this.$axios.post("/iorder/Vip/recharge",this.axiosParams)
                .then(res=>{
                  if (res.data==true){
                    this.$message({
                      message:'充值成功！',
                      type:'success',
                      center:true
                    })
                    this.vip.phone="";
                    this.vip.name="";
                    this.vip.money="";
                  }else {
                    this.$message({
                      message:'信息错误充值失败！',
                      type:'error',
                      center:true
                    })
                    this.vip.name="";
                    this.vip.money="";
                  }
                })
                .catch(e=>{
                  console.log(e);
                });
            }
          })
        }
      }
    },
    mounted() {
      this.showMain = true;
    }
  }
</script>

<style scoped>
  .container{
    background-color: #545c64;
    height: 600px;
    border-top: 1px solid white;
  }
  .font{
    line-height: 50px;
    font-family: 'Helvetica Neue';
    font-size: 60px;
    color: white;
    font-weight: bolder;
  }
  .card{
    height: 300px;
    width: 40%;
    margin: 100px auto;
    background-color: #cecece;
  }
</style>
