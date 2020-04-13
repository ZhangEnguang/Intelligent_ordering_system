<template>
  <div class="container">
    <transition name="el-zoom-in-center">
      <div v-show="showMain" style="height: 500px">
        <div style="width: 100%;text-align: center;margin-top: 20px;"><span class="font">办理会员</span></div>
        <el-card class="card">
          <el-form :model="vip" status-icon :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="姓名" prop="name">
              <el-input type="text" v-model="vip.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input type="text" v-model="vip.phone" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item style="margin-top:30px;text-align: center">
              <el-button type="primary" @click="addVip('ruleForm')" icon="el-icon-document-checked">提交</el-button>
              <el-button @click="resetForm('ruleForm')" icon="el-icon-refresh-left">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>
  </div>
</template>

<script>
    export default {
        name: "AddCard",
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
        }
          return{
            showMain:false,
            rules:{
              name:[
                {required: true,validator: checkName,trigger:'blur'}
              ],
              phone:[
                {required: true,validator: checkPhone,trigger:'blur'}
              ]
            },
            vip:{
              name:'',
              phone:''
            },
          axiosParams:new Object()
          }
      },
      methods:{
        resetForm(formName){
          this.$refs[formName].resetFields();
        },
        addVip(formName){
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
                this.$axios.post("/iorder/Vip/addVip",this.axiosParams)
                .then(res=>{
                    if (res.data==true){
                      this.$message({
                        message:'添加成功！',
                        type:'success',
                        center:true
                      })
                      this.vip.phone="";
                      this.vip.name="";
                    }else {
                      this.$message({
                        message:'手机号已存在，添加失败！',
                        type:'error',
                        center:true
                      })
                      this.vip.phone = "";
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
    height: 200px;
    width: 40%;
    margin: 100px auto;
    background-color: #cecece;
  }
</style>
