<template>
  <div>
    <!--flex弹性盒子模型，justify-content：主抽 -->
    <div class="contain">
      <el-card class="el-card">
        <table class="table">
          <tr class="tr">
            <td colspan="2" style="padding: 0">
              <span class="text">麻辣牛仔</span>
            </td>
          </tr>
          <tr class="tr">
            <!-- 占两行-->
            <td colspan="2" >
              <!-- 点击事件的两种不同的写法v-on:click和 @click-->
              <el-image
                class="el-image"
                src="/static/images/login/restaurant.png"
                fit="fill "></el-image>
            </td>
          </tr>
          <tr >
            <td><span class="span-text">用户名</span></td>
            <td>
              <el-input v-model="user.username" placeholder="请输入用户名"  @blur="isExit"></el-input>
            </td>
          </tr>
          <tr >
            <td><span class="span-text">密&nbsp;&nbsp;&nbsp;&nbsp;码</span></td>
            <td>
              <el-input type="password" v-model="user.password" placeholder="请输入密码" show-password @keydown.enter.native="doLogin"></el-input>
              <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
            </td>
          </tr>
          <tr >
            <!-- 占两行-->
            <td colspan="2">
              <!-- 点击事件的两种不同的写法v-on:click和 @click-->
              <el-button style="width: 300px;margin-top: 20px" type="primary" @click="doLogin">登录</el-button>
            </td>
          </tr>
          <tr class="tr">
            <!-- 占两行-->
            <td colspan="2">
              <!-- 点击事件的两种不同的写法v-on:click和 @click-->
              <el-link  type="primary" :underline="false" @click="goOrder">暂不登录</el-link>
              <el-link style="margin-left: 20px" type="primary" :underline="false" @click="forgetPass">忘记密码</el-link>
            </td>
          </tr>
        </table>
      </el-card>
      <el-dialog title="权限选择" :visible.sync="dialogTableVisible" style="margin: 0 auto;width: 800px;">
        <div style="text-align: center;height: 100px;margin-top: 50px">
          <el-select v-model="value" filterable placeholder="请选择" >
            <el-option
              v-for="(item,key) in root"
              :key="key"
              :label="item.rootName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogTableVisible = false">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="密码修改" :visible.sync="editPass" style="margin: 0 auto;width: 800px;">
        <div style="text-align: center;height: 300px;">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名">
              <el-input type="text" v-model="user.username" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input type="text" v-model="ruleForm.name" autocomplete="off" @blur="checkName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    //单页面中不支持前面的data:{}方式
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      //相当于以前的function data(){},这是es5之前的写法，新版本可以省略掉function
      return{
        user:{
          username:'',
          password:''
          //为了登录方便，可以直接在这里写好用户名和密码的值
        },
        ruleForm: {
          pass: '',
          checkPass: '',
          name:''
        },
        dialogTableVisible:false,
        editPass:false,
        root:[],
        value:'',
        rules: {
          pass: [
            {required:true, validator: validatePass, trigger: 'blur' },
            { min: 6, max: 11, message: '密码长度在 6 到 11 个字符', trigger: 'blur' }
          ],
          checkPass: [
            {required:true, validator: validatePass2, trigger: 'blur' }
          ],
          name:[
            {required:true,message:'请输入真实姓名',trigger:'blur'}
          ]
        },
        axiosParams:new Object()
      }
    },
    mounted() {
      this.$axios.post("/iorder/Root/listNoRoot")
        .then(res=>{
          this.root = res.data.list;
        })
        .catch(e=>{
          console.log(e)
        })
    },
    methods:{
      ajaxCall(){
        this.axiosParams.username = this.user.username;
        this.axiosParams.password = this.user.password;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitForm(formName){
        this.$refs[formName].validate((valid)=>{
          if (valid){
            this.axiosParams = new Object();
            this.axiosParams.username = this.user.username;
            this.axiosParams.name = this.ruleForm.name;
            this.axiosParams.password = this.ruleForm.pass;
            this.$axios.post("/iorder/User/updatePass",this.axiosParams)
            .then(res=>{
              if (res.data == true){
                this.$message({
                  message:'密码修改成功！',
                  type:'success',
                  center:true
                });
                this.editPass = false;
              }else {
                this.$message({
                  message:'密码修改失败！',
                  type:'error',
                  center:true
                });
                this.editPass = false;
              }
            })
            .catch(e=>{
              console.log(e);
            });
          }
        })
      },
      checkName(){
        if(this.ruleForm.name!=""&&this.ruleForm!=null){
          this.axiosParams = new Object();
          this.axiosParams.username = this.user.username;
          this.$axios.post("/iorder/User/checkName",this.axiosParams)
            .then(res=>{
              if (res.data.user.name!=this.ruleForm.name){
                this.$message({
                  message:'输入姓名错误，请重新输入！',
                  type:'error',
                  center:true
                });
                this.ruleForm.name = "";
              }
            })
          .catch(e=>{
            console.log(e)
          });
        }
      },
      forgetPass(){
        this.ruleForm.name = "";
        this.ruleForm.pass = "";
        this.ruleForm.checkPass = "";
        if (this.user.username == ""){
          this.$message({
            message:'请输入用户名',
            type:'warning',
            center:true
          })
        }else {
          this.axiosParams.username = this.user.username;
          if (this.user.username!=null&&this.user.username!=""){
            this.$axios.post("/iorder/Login/isExit",this.axiosParams)
              .then(res=>{
                if (res.data.user==null){
                  this.$message({
                    message: '用户不存在请重新输入',
                    type: 'warning',
                    center:true
                  });
                }else {
                  this.editPass = true
                }
              })
              .catch(e=>{
                console.log(e);
              })
          }
        }

      },
      doLogin(){//一点击登录按钮，这个方法就会执行
        this.ajaxCall();
        if (this.user.username!=""&&this.user.password!=""){
          this.$axios.post("/iorder/Login/login",this.axiosParams)
            .then(res=>{
              if (res.data.res == true){
                if (res.data.user.state == 0){
                  this.$message({
                    message: '您的账户已锁定！',
                    type: 'error',
                    center: true
                  });
                }else {
                  if (res.data.user.root==3){
                    this.dialogTableVisible = true;
                    res.data.user.root = this.value;
                    if (res.data.user.root != 2&&res.data.user.root!=""&&res.data.user.root!=null){
                      this.$message({
                        message: '欢迎'+res.data.user.rootName+res.data.user.name+'点餐',
                        type: 'success',
                        center: true
                      });
                      this.$cookies.set("root",res.data.user.root,"1d");
                      this.$router.push('/FoodList')
                    }
                    if (res.data.user.root == 2){
                      this.$message({
                        message: '欢迎'+res.data.user.rootName+res.data.user.name+'登录系统',
                        type: 'success',
                        center: true
                      });
                      this.$cookies.set("root",res.data.user.root,"1d");
                      this.$router.push('/Home')
                    }
                  }else {
                    if (res.data.user.root == 2){
                      this.$message({
                        message: '欢迎'+res.data.user.rootName+res.data.user.name+'点餐',
                        type: 'success',
                        center: true
                      });
                      this.$router.push('/Home')
                    }else{
                      this.$message({
                        message: '欢迎'+res.data.user.rootName+res.data.user.name+'登录系统',
                        type: 'success',
                        center: true
                      });
                      this.$router.push('/FoodList')
                    }
                  }
                }

              }else {
                this.$message({
                  message: '密码错误请再此输入',
                  type: 'warning',
                  center:true
                });
              }
            })
            .catch(e=>{
              console.log(e);
            })
        }else {
          this.$message({
            message: '用户名或密码不能为空',
            type: 'warning',
            center:true
          });
        }

      },
      isExit(){
        this.axiosParams.username = this.user.username;
        if (this.user.username!=null&&this.user.username!=""){
          this.$axios.post("/iorder/Login/isExit",this.axiosParams)
            .then(res=>{
              if (res.data.user==null){
                this.$message({
                  message: '用户不存在请重新输入',
                  type: 'warning',
                  center:true
                });
              }
            })
          .catch(e=>{
            console.log(e);
          })
        }
      },
      goOrder(){
        this.$axios.post("/iorder/Login/notLogin")
        .then(res=>{
          this.$router.push("/FoodList")
        })
        .catch(e=>{
          console.log(e);
        })
      }
    }
  }
</script>
<style>
  .contain{
    display: flex;
    justify-content: center;
    margin-top: 150px;
  }
  .el-card{
    width: 600px;
    height: 400px;
    background:#cecece;
    padding: 0;
  }
  .table{
    margin: auto;
  }
  .text{
    font-family: 'Helvetica Neue';
    font-size: 50px;
    color: white;
    font-weight: bolder;
  }
  .tr{
    text-align: center;
  }
  .el-image{
    width: 110px;
    height: 110px;
    padding: 0px;
  }
  .span-text{
    color: white;
    font-weight: bolder;
  }
</style>
