<template>
  <div  class="container">
    <transition name="el-zoom-in-center">
      <div v-show="showMain" style="height: 500px">
        <div style="width: 100%;text-align: center"><span style="line-height: 50px;font-family: 'Helvetica Neue';font-size: 30px;color: white;font-weight: bolder;">员工列表</span></div>
        <el-header style="height: 40px" class="static">
          <el-button type="danger" plain size="mini" @click="deleteAll">删除</el-button>
          <el-button type="primary" plain size="mini" @click="addImage">添加</el-button>
          <el-input style="width: 200px;float: right;" v-model="input" placeholder="请输入用户信息"></el-input>
          <el-button type="primary" @click="search" style="margin-right: 20px;float: right;height: 40px;width: 100px" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="reset" style="margin-right: 20px;float: right;height: 40px;width: 100px" icon="el-icon-refresh-right">重置</el-button>
        </el-header>
        <el-main style="width: 80%;margin: 0 auto;padding: 0;height: 100%;background-color: white">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;margin: 30px auto"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              align="center"
              width="55">
            </el-table-column>
            <el-table-column
              label="编号"
              align="center"
              width="120">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column
              label="头像"
              align="center"
              width="120">
              <template slot-scope="scope">
                <el-image class="image" :src="scope.row.img" :preview-src-list="[scope.row.img]"></el-image>
              </template>
            </el-table-column>
            <el-table-column
              label="姓名"
              align="center"
              width="120">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column
              label="用户名"
              align="center"
              width="120">
              <template slot-scope="scope">{{scope.row.username}}</template>
            </el-table-column>
            <el-table-column
              label="职位"
              align="center">
              <template slot-scope="scope">{{scope.row.rootName}}</template>
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


    <el-dialog title="编辑员工信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item  :label-width="formLabelWidth" class="avatar-uploader">
          <el-image v-if="form.src"  :src="form.src" style=" width: 178px; height: 178px;"></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture"
            :on-preview="handlePictureCardPreviewUpdate"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
          >
            <el-button type="primary" size="small" class="el-icon-upload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>

        </el-form-item>
        <el-form-item label="轮播图描述" :label-width="formLabelWidth">
          <el-input v-model="form.desc" autocomplete="on"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加员工" :visible.sync="addForm">
      <el-form :model="addform" ref="addform" :rules="rules">
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
        <el-form-item label="员工用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addform.username"  autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="员工职位" :label-width="formLabelWidth" prop="value">
          <el-select v-model="addform.value" filterable placeholder="请选择" >
            <el-option
              v-for="(item,key) in root"
              :key="key"
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
    name: "EmployeeList",
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
        let reg = /^[A-Za-z]+$/
        if (!value){
          return callback(new Error('请输入员工用户名'))
        }else if (!reg.test(value)){
          return callback(new Error('员工用户名只能是英文'))
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
        root:[],
        fileItem:{
          name:'',
          url:''
        },
        form: {
          id:0,
          src: '',
          desc: ''
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
            {required: true,validator: checkUsername,trigger:'blur'}
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
      update(){
        if (this.updateFile!=""&&this.updateFile!=null){
          let formData = new FormData();
          formData.append("updateFile",this.updateFile);
          formData.append("description",this.form.desc);
          formData.append("id",this.form.id);
          this.$axios.post("/iorder/Carousel/update",formData,{headers:{'Content-Type': 'multipart/form-data;charset=utf-8'}})
            .then(res=>{
              if (res.data == true){
                this.$message({
                  message:'修改轮播图成功！',
                  type:'success',
                  center:true
                })
                this.updateFile = "";
                this.dialogFormVisible = false;
                this.ajaxCall();
              }else {
                this.$message({
                  message:'修改轮播图失败！',
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
      },
      ajaxCall(){
        this.axiosParams = new Object();
        this.axiosParams.pageSize = this.pageSize;
        this.axiosParams.start = this.currentPage;
        this.axiosParams.input = this.input;
        this.$axios.post("/iorder/User/list",this.axiosParams)
          .then(res=>{
            this.tableData = res.data.page.list;
            this.total = res.data.page.total;
          })
          .catch(e=>{
            console.log(e)
          });
        this.$axios.post("/iorder/Root/list")
        .then(res=>{
          this.root = res.data.list;
        })
        .catch(e=>{
          console.log(e)
        })
      },
      show(){
        this.multipleSelection.forEach(data=>{
          if (data.isShow == 0){
            data.isShow = 1;
            this.axiosParams = new Object();
            this.axiosParams.id = data.id;
            this.$axios.post("/iorder/Carousel/show",this.axiosParams)
              .then(res=>{
              })
              .catch(e=>{
                console.log(e)
              })
          }
        })
      },
      hidden(){
        this.multipleSelection.forEach(data=>{
          if (data.isShow == 1){
            data.isShow = 0;
            this.axiosParams = new Object();
            this.axiosParams.id = data.id;
            this.$axios.post("/iorder/Carousel/hidden",this.axiosParams)
              .then(res=>{
              })
              .catch(e=>{
                console.log(e)
              })
          }
        })
      },
      deleteAll(){
        this.$confirm('此操作将永久删除已选择该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(()=>{
            this.multipleSelection.forEach(data=>{
              this.axiosParams = new Object();
              this.axiosParams.id = data.id;
              this.$axios.post("/iorder/Carousel/delete",this.axiosParams)
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
            })
          }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      switchChange(event,id){
        this.axiosParams = new Object();
        this.axiosParams.event = event;
        this.axiosParams.id = id;
        this.$axios.post("/iorder/Carousel/updateIsShow",this.axiosParams)
          .then(res=>{
          })
          .catch(e=>{
            console.log(e)
          })
      },
      addImage(){
        this.files = "";
        this.addform.src = "";
        this.addForm = true;

      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEdit(row) {
        this.updateFile = "";
        this.dialogFormVisible = true
        this.form.desc = row.description;
        this.form.id = row.id;
        this.form.src = "";
        let s =row.path.split("/");
        this.fileItem.name = s[s.length-1];
        this.fileItem.url = '.'+row.path;
        let item = {"name":this.fileItem.name};
        let raw = new File([item],this.fileItem.name);
        this.fileList=[{"raw":raw,"url":this.fileItem.url,"name":this.fileItem.name}];
      },
      handleDelete(row) {
        this.axiosParams = new Object();
        this.axiosParams.id = row.id;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post("/iorder/Carousel/delete",this.axiosParams)
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
    margin-left: 130px;
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
