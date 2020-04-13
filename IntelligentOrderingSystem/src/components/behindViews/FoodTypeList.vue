<template>
  <div  class="container">
    <transition name="el-zoom-in-center">
      <div v-show="showMain" style="height: 500px">
        <div style="width: 100%;text-align: center"><span style="line-height: 50px;font-family: 'Helvetica Neue';font-size: 30px;color: white;font-weight: bolder;">职位列表</span></div>
        <el-header style="height: 40px" class="static">
          <el-button type="primary" plain size="mini" @click="addFoodType" icon="el-icon-circle-plus-outline">添加</el-button>
          <el-input style="width: 200px;float: right;" v-model="input" placeholder="请输入菜品类别名称"></el-input>
          <el-button type="primary" @click="search" style="margin-right: 20px;float: right;height: 40px;width: 100px" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="reset" style="margin-right: 20px;float: right;height: 40px;width: 100px" icon="el-icon-refresh-right">重置</el-button>
        </el-header>
        <el-main style="width: 80%;margin: 0 auto;padding: 0;height: 100%;background-color: white">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;margin: 30px auto">
            <el-table-column
              label="编号"
              type="index"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              label="菜品种类"
              align="center">
              <template slot-scope="scope">{{scope.row.typeName}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" >
              <template slot-scope="scope" >
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)" icon="el-icon-delete">删除</el-button>
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


    <el-dialog title="编辑菜品类别信息" :visible.sync="dialogFormVisible" style="margin: 0 auto;width: 800px;">
      <el-form :model="form" ref="form" :rules="rules" status-icon>
        <el-form-item label="菜品类别名称" :label-width="formLabelWidth"  prop="typeName">
          <el-input v-model="form.typeName"  autocomplete="on" ></el-input>
        </el-form-item>
        <el-form-item style="margin-left:  150px">
          <el-button @click="dialogFormVisible=false">取消</el-button>
          <el-button type="primary" @click="update('form')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="添加菜品类别" :visible.sync="addForm" style="margin: 0 auto;width: 800px;">
      <el-form :model="addform" ref="addform" :rules="rules" status-icon>
        <el-form-item label="菜品类别名称" :label-width="formLabelWidth"  prop="typeName">
          <el-input v-model="addform.typeName"  autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:  150px">
          <el-button @click="resetForm('addform')">重置</el-button>
          <el-button type="primary" @click="addType('addform')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>

</template>

<script>
  export default {
    name: "FoodTypeList",
    data() {
      return {
        showMain:false,
        tableData: [],
        currentPage:1,
        pageSize:10,
        total:0,
        axiosParams: new Object(),
        dialogFormVisible: false,
        addForm:false,
        input:"",
        form: {
          id:0,
          typeName:''
        },
        addform: {
          typeName:''
        },
        formLabelWidth: '120px',
        rules:{
          typeName:[
            { required: true, message: '请输入菜品类别名称', trigger: 'blur' },
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
        this.$refs[formName].resetFields();
      },
      addType(formName){
        this.$refs[formName].validate((valid)=>{
          if (valid){
            this.axiosParams = new Object();
            this.axiosParams.typeName = this.addform.typeName;
            this.$axios.post("/iorder/FoodType/addType",this.axiosParams)
              .then(res=>{
                if (res.data == true){
                  this.$message({
                    message:'添加菜品类别成功！',
                    type:'success',
                    center:true
                  })
                  this.addForm = false;
                  this.ajaxCall();
                }else {
                  this.$message({
                    message:'菜品类别已存在！',
                    type:'error',
                    center:true
                  })
                  this.addForm = false;
                }
              })
              .catch(e=>{
                console.log(e)
              })
          }
        });
      },
      update(formName){
        this.$refs[formName].validate((valid)=>{
          if (valid){
            this.axiosParams = new Object();
            this.axiosParams.id = this.form.id;
            this.axiosParams.typeName = this.form.typeName;
            this.$axios.post("/iorder/FoodType/update",this.axiosParams)
              .then(res=>{
                if (res.data == true){
                  this.$message({
                    message:'修改菜品类别名称成功！',
                    type:'success',
                    center:true
                  })
                  this.dialogFormVisible = false;
                  this.ajaxCall();
                }else {
                  this.$message({
                    message:'菜品类别名称已存在！',
                    type:'error',
                    center:true
                  })
                  this.dialogFormVisible = false;
                }
              })
              .catch(e=>{
                console.log(e)
              })
          }
        });
      },
      ajaxCall(){
        this.axiosParams = new Object();
        this.axiosParams.pageSize = this.pageSize;
        this.axiosParams.start = this.currentPage;
        this.axiosParams.input = this.input;
        this.$axios.post("/iorder/FoodType/getList",this.axiosParams)
          .then(res=>{
            this.tableData = res.data.page.list;
            this.total = res.data.page.total;
          })
          .catch(e=>{
            console.log(e)
          });
      },
      addFoodType(){
        this.addform.typeName = "";
        this.addForm = true;
      },
      handleEdit(row) {
        this.dialogFormVisible = true;
        this.form.typeName = row.typeName;
        this.form.id = row.id;
      },
      handleDelete(row) {
        this.axiosParams = new Object();
        this.axiosParams.id = row.id;
        this.$confirm('此操作将永久删除该菜品类别同时相关相关菜品将下架, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post("/iorder/FoodType/delete",this.axiosParams)
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
</style>
