<template>
  <div  class="container">
    <transition name="el-zoom-in-center">
      <div v-show="showMain" style="height: 500px">
        <div style="width: 100%;text-align: center"><span style="line-height: 50px;font-family: 'Helvetica Neue';font-size: 30px;color: white;font-weight: bolder;">菜品列表</span></div>
        <el-header style="height: 40px" class="static">
          <el-button type="success" plain size="mini" @click="show">上架</el-button>
          <el-button type="info" plain size="mini" @click="unShow">下架</el-button>
          <el-button type="danger" plain size="mini" @click="deleteAll">删除</el-button>
          <el-button type="primary" plain size="mini" @click="addEmp">添加</el-button>
          <el-input style="width: 200px;float: right;" v-model="input" placeholder="请输入菜品信息"></el-input>
          <el-button type="primary" @click="search" style="margin-right: 20px;float: right;height: 40px;width: 100px" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="reset" style="margin-right: 20px;float: right;height: 40px;width: 100px" icon="el-icon-refresh-right">重置</el-button>
        </el-header>
        <el-main style="width: 98%;margin: 0 auto;padding: 0;height: 100%;background-color: white">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;margin: 30px auto"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50px">
            </el-table-column>
            <el-table-column
              label="编号"
              align="center"
              type="index"
              width="100px">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column
              label="图片"
              align="center"
              width="100px">
              <template slot-scope="scope">
                <el-image class="image" :src="'.'+scope.row.img" :preview-src-list="['.'+scope.row.img]"></el-image>
              </template>
            </el-table-column>
            <el-table-column
              label="菜品名称"
              align="center"
              width="100px"
              show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.foodName}}</template>
            </el-table-column>
            <el-table-column
              label="所属种类"
              align="center"
              width="100px"
              show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.typeName}}</template>
            </el-table-column>
            <el-table-column
              label="单价(元)"
              align="center"
              width="100px">
              <template  slot-scope="scope">
                {{scope.row.price}}
              </template>
            </el-table-column>
            <el-table-column
              label="菜品描述"
              align="center"
              show-overflow-tooltip
              width="100px">
              <template slot-scope="scope">{{scope.row.description}}</template>
            </el-table-column>
            <el-table-column
              label="是否打折"
              align="center"
              width="160px">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isDiscount"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949" @change="switchChangeDiscount($event,scope.row.id)" ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="折扣(折)"
              align="center">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.isDiscount == 1" v-model="scope.row.discount" controls-position="right" @change="handleChange(scope.row)" size="mini" :precision="1" :step="0.1" :min="0.1" :max="10"></el-input-number>
                <el-input-number v-else  v-model="scope.row.discount" controls-position="right" size="mini" disabled></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              label="是否上架"
              align="center"
              width="100px">
              <template slot-scope="scope">
                <el-switch
                  v-if="scope.row.typeid == 5"
                  v-model="scope.row.state"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949" disabled ></el-switch>
                <el-switch
                  v-else
                  v-model="scope.row.state"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949" @change="switchChangeState($event,scope.row.id)" ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer style="padding: 0;background: white;width: 98%;margin: 0 auto">
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


    <el-dialog title="编辑员工信息" :visible.sync="dialogFormVisible" >
      <el-form :model="form" ref="form" :rules="rules" status-icon>
        <el-form-item  :label-width="formLabelWidth" class="avatar-uploader" prop="src">
          <el-image v-if="form.src"  :src="form.src" style=" width: 178px; height: 178px;"></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture"
            :on-preview="handlePictureCardPreviewUpdate"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList">
            <el-button type="primary" size="small" class="el-icon-upload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="员工姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name"  autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="员工用户名" :label-width="formLabelWidth"  prop="username">
          <el-input v-model="form.username"  autocomplete="on" @blur="checkUpdate"></el-input>
        </el-form-item>
        <el-form-item label="员工职位" :label-width="formLabelWidth" prop="value">
          <el-select v-model="form.value" filterable placeholder="请选择" >
            <el-option
              v-for="(item,key) in foodType"
              :disabled="item.disabled"
              :key="key"
              :label="item.rootName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:  500px">
          <el-button @click="resetForm('form')">重置</el-button>
          <el-button type="primary" @click="update('form')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="添加员工" :visible.sync="addForm" >
      <el-form :model="addform" ref="addform" :rules="rules" status-icon>
        <el-form-item  :label-width="formLabelWidth" class="avatar-uploader" prop="src">
          <el-image  v-if="addform.src" :src="addform.src" style=" width: 178px; height: 178px;"></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeAvatarUpload">
            <el-button type="primary" size="small" class="el-icon-upload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="员工姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addform.name"  autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="员工用户名" :label-width="formLabelWidth"  prop="username">
          <el-input v-model="addform.username"  autocomplete="on" @blur="checkExit"></el-input>
        </el-form-item>
        <el-form-item label="员工职位" :label-width="formLabelWidth" prop="value">
          <el-select v-model="addform.value" filterable placeholder="请选择" >
            <el-option
              v-for="(item,key) in foodType"
              :key="key"
              :disabled="item.disabled"
              :label="item.rootName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:  500px">
          <el-button @click="resetForm('addform')">重置</el-button>
          <el-button type="primary" @click="upload('addform')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>

</template>

<script>
  export default {
    name: "FoodBehindList",
    data() {
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
      var checkUsername=(rule,value,callback)=>{
        let reg = /^[A-Za-z0-9]+$/
        if (!value){
          return callback(new Error('请输入员工用户名'))
        }else if (!reg.test(value)){
          return callback(new Error('员工用户名不能是中文'))
        }else {
          callback()
        }
      };
      return {
        showMain:false,
        tableData: [],
        multipleSelection: [],
        currentPage:1,
        pageSize:10,
        total:0,
        axiosParams: new Object(),
        dialogFormVisible: false,
        addForm:false,
        input:"",
        files:"",
        updateFile:"",
        fileList:[],
        foodType:[],
        fileItem:{
          name:'',
          url:''
        },
        form: {
          id:0,
          src: '',
          name:'',
          username:'',
          value:''
        },
        addform: {
          src: '',
          name: '',
          username:'',
          value:''
        },
        formLabelWidth: '120px',
        rules:{
          name:[
            {required: true,validator: checkName,trigger:'blur'}
          ],
          username:[
            {required: true,validator: checkUsername,trigger:'blur'},
            { min: 3, max: 11, message: '长度在 3 到 11个字符', trigger: 'blur' }
          ],
          value:[
            {required: true, message: '请选择员工职位', trigger: 'change' }
          ]
        }
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
      handleChange(row) {
        this.axiosParams = new Object();
        this.axiosParams.discount = row.discount;
        this.axiosParams.id = row.id;
        this.$axios.post("/iorder/Food/updateDiscount",this.axiosParams)
        .then(()=>{
        })
        .catch(e=>{
          console.log(e);
        });
      },
      switchChangeDiscount(event,id){
        this.axiosParams = new Object();
        this.axiosParams.event = event;
        this.axiosParams.id = id;
        this.$axios.post("/iorder/Food/updateIsDiscount",this.axiosParams)
          .then(res=>{
          })
          .catch(e=>{
            console.log(e)
          })
      },
      switchChangeState(event,id){
        this.axiosParams = new Object();
        this.axiosParams.event = event;
        this.axiosParams.id = id;
        this.$axios.post("/iorder/Food/updateIsState",this.axiosParams)
          .then(res=>{
          })
          .catch(e=>{
            console.log(e)
          })
      },
      unShow(){
        this.multipleSelection.forEach(data=>{
          if (data.state == 1){
            data.state = 0;
            this.axiosParams = new Object();
            this.axiosParams.id = data.id;
            this.$axios.post("/iorder/Food/unShow",this.axiosParams)
              .then(res=>{
              })
              .catch(e=>{
                console.log(e)
              })
          }
        })
      },
      show(){
        this.multipleSelection.forEach(data=>{
          if (data.root!=5){
            if (data.state == 0){
              data.state = 1;
              this.axiosParams = new Object();
              this.axiosParams.id = data.id;
              this.$axios.post("/iorder/Food/show",this.axiosParams)
                .then(res=>{
                })
                .catch(e=>{
                  console.log(e)
                })
            }
          }else {
            this.$message({
              message:'请为员工选择职位！',
              type:'warning',
              center:true
            })
          }

        })
      },
      checkUpdate(){
        this.axiosParams = new Object();
        this.axiosParams.username = this.form.username;
        this.axiosParams.id = this.form.id;
        this.$axios.post("/iorder/User/isExit",this.axiosParams)
          .then(res=>{
            if ((res.data == false)){
              this.$message({
                message: '用户名已存在！',
                type: 'warning',
                center:true
              });
              this.form.username = null;
            }
          })
          .catch(e=>{
            console.log(e)
          })
      },
      checkExit(){
        this.axiosParams = new Object();
        this.axiosParams.username = this.addform.username;
        this.$axios.post("/iorder/Login/isExit",this.axiosParams)
          .then(res=>{
            if (res.data.user!=null){
              this.$message({
                message: '用户名已存在！',
                type: 'warning',
                center:true
              });
              this.addform.username = null;
            }
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
      resetForm(formName){
        this.files = "";
        this.updateFile = "";
        this.$refs[formName].resetFields();
      },
      handlePictureCardPreviewUpdate(res){
        this.form.src = res.url;
        this.updateFile=res.raw;
      },
      handlePictureCardPreview(res){
        this.addform.src = res.url;
        this.files=res.raw;
      },
      beforeAvatarUpload(file) {
        const isJPGPNG = file.type === 'image/jpeg'||file.type==='image/png'
        const isLt500K = file.size / 1024 / 1024 < 0.5;

        if (!isJPGPNG) {
          this.$message({
            message:'上传图片只能是 JPG或PNG 格式!',
            type:'error',
            center:true
          });
        }
        if (!isLt500K) {
          this.$message({
            message: '上传图片大小不能超过 500kb!',
            type: 'error',
            center: true
          });
        }
        return isJPGPNG && isLt500K;
      },
      upload(formName){
        this.$refs[formName].validate((valid)=>{
          if (valid){
            if (this.files!=""&&this.files!=null){
              let formData = new FormData();
              formData.append("file",this.files);
              formData.append("name",this.addform.name);
              formData.append("username",this.addform.username);
              formData.append("root",this.addform.value);
              this.$axios.post("/iorder/User/upload",formData,{headers:{'Content-Type': 'multipart/form-data;charset=utf-8'}})
                .then(res=>{
                  if (res.data == true){
                    this.$message({
                      message:'添加员工成功！',
                      type:'success',
                      center:true
                    })
                    this.files = "";
                    this.addForm = false;
                    this.ajaxCall();
                  }else {
                    this.$message({
                      message:'添加员工失败！',
                      type:'error',
                      center:true
                    })
                    this.addForm = false;
                  }
                })
                .catch(e=>{
                  console.log(e)
                })
            }else {
              this.$message({
                message:'请选择要上传的图片！',
                type:'warning',
                center:true
              })
            }
          }
        });
      },
      update(formName){
        this.$refs[formName].validate((valid)=>{
          if (valid){
            if (this.updateFile!=""&&this.updateFile!=null){
              let formData = new FormData();
              formData.append("updateFile",this.updateFile);
              formData.append("username",this.form.username);
              formData.append("name",this.form.name);
              formData.append("root",this.form.value);
              formData.append("id",this.form.id);
              this.$axios.post("/iorder/User/update",formData,{headers:{'Content-Type': 'multipart/form-data;charset=utf-8'}})
                .then(res=>{
                  if (res.data == true){
                    this.$message({
                      message:'修改员工信息成功！',
                      type:'success',
                      center:true
                    })
                    this.updateFile = "";
                    this.dialogFormVisible = false;
                    this.ajaxCall();
                  }else {
                    this.$message({
                      message:'修改员工信息失败！',
                      type:'error',
                      center:true
                    })
                    this.dialogFormVisible = false;
                  }
                })
                .catch(e=>{
                  console.log(e)
                })
            }else {
              this.$message({
                message:'请选择要上传的图片！',
                type:'warning',
                center:true
              })
            }
          }
        });

      },
      ajaxCall(){
        this.axiosParams = new Object();
        this.axiosParams.pageSize = this.pageSize;
        this.axiosParams.start = this.currentPage;
        this.axiosParams.input = this.input;
        this.$axios.post("/iorder/Food/list",this.axiosParams)
          .then(res=>{
            this.tableData = res.data.page.list;
            this.total = res.data.page.total;
          })
          .catch(e=>{
            console.log(e)
          });
        this.$axios.post("/iorder/FoodType/list")
          .then(res=>{
            res.data.list.push({id:5,rootName:'无',disabled:true});
            this.foodType =res.data.list;
          })
          .catch(e=>{
            console.log(e)
          })
      },
      deleteAll(){
        this.$confirm('此操作将永久删除已选择的职员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(()=>{
            this.multipleSelection.forEach(data=>{
              this.axiosParams = new Object();
              this.axiosParams.id = data.id;
              this.$axios.post("/iorder/User/delete",this.axiosParams)
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
      addEmp(){
        this.files = "";
        this.addform.src = "";
        this.addform.username = "";
        this.addform.name = "";
        this.addform.value = "";
        this.addForm = true;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEdit(row) {
        this.updateFile = "";
        this.dialogFormVisible = true;
        this.form.name = row.name;
        this.form.username = row.username;
        this.form.value = row.root;
        this.form.id = row.id;
        this.form.src = "";
        let s =row.img.split("/");
        this.fileItem.name = s[s.length-1];
        this.fileItem.url = '.'+row.img;
        let item = {"name":this.fileItem.name};
        let raw = new File([item],this.fileItem.name);
        this.fileList=[{"raw":raw,"url":this.fileItem.url,"name":this.fileItem.name}];
      },
      handleDelete(row) {
        this.axiosParams = new Object();
        this.axiosParams.id = row.id;
        this.$confirm('此操作将永久删除该职员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post("/iorder/User/delete",this.axiosParams)
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
            .catch(e=>{
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
  .image{
    width: 80px;
    height: 40px;
  }
  .avatar-uploader i  {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
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
