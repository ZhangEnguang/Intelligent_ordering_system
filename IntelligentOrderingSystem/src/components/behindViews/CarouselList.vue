<template>
  <div  style="background-color: #545c64;height: 670px;border-top: 1px solid white">
      <transition name="el-zoom-in-center">
        <div v-show="showMain" style="height: 500px">
          <div style="width: 100%;text-align: center"><span style="line-height: 50px;font-family: 'Helvetica Neue';font-size: 30px;color: white;font-weight: bolder;">轮播图表</span></div>
          <el-main style="width: 80%;margin: 0 auto;padding: 0;height: 100%;background-color: white">
            <el-button type="success" plain size="mini" @click="show">显示</el-button>
            <el-button type="info" plain size="mini" @click="hidden">隐藏</el-button>
            <el-button type="danger" plain size="mini">删除</el-button>
            <el-button type="primary" plain size="mini">添加</el-button>
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
                label="序号"
                align="center"
                width="120">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column
                label="图片"
                align="center"
                width="120">
                <template slot-scope="scope">
                  <el-image class="image" :src="'.'+scope.row.path" :preview-src-list="['.'+scope.row.path]"></el-image>
                </template>
              </el-table-column>
              <el-table-column
                label="路径"
                align="center"
                show-overflow-tooltip>
                <template slot-scope="scope">F:/ideaFile/Intelligent_ordering_system/IntelligentOrderingSystem{{scope.row.path}}</template>
              </el-table-column>
              <el-table-column
                label="描述"
                align="center"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.description}}
                </template>
              </el-table-column>
              <el-table-column
                label="是否显示"
                align="center"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.isShow "
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    inactive-color="#ff4949" @change="switchChange($event,scope.row.id)" ></el-switch>
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
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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


      <el-dialog title="轮播图信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item  :label-width="formLabelWidth">
            <el-image :src="form.src" style="height: 200px;width: 300px"></el-image>
          </el-form-item>
          <el-form-item label="轮播图描述" :label-width="formLabelWidth">
            <el-input v-model="form.desc" autocomplete="on"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>

  </div>

</template>

<script>
    export default {
        name: "CarouselList",
      data() {
        return {
          showMain:false,
          tableData: [],
          multipleSelection: [],
          currentPage:1,
          pageSize:10,
          total:0,
          axiosParams: new Object(),
          dialogTableVisible: false,
          dialogFormVisible: false,
          form: {
            src: '',
            desc: ''
          },
          formLabelWidth: '120px'
        }
      },
      mounted() {
          this.showMain = true;
          this.ajaxCall();
      },
      methods: {
        ajaxCall(){
          this.axiosParams = new Object();
          this.axiosParams.pageSize = this.pageSize;
          this.axiosParams.start = this.currentPage;
          this.$axios.post("/iorder/Carousel/list",this.axiosParams)
          .then(res=>{
            this.tableData = res.data.list;
            this.total = res.data.count;
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
        switchChange(event,id){
          this.axiosParams = new Object();
          this.axiosParams.event = event;
          this.axiosParams.id = id;
          this.$axios.post("iorder/Carousel/updateIsShow",this.axiosParams)
          .then(res=>{
          })
          .catch(e=>{
            console.log(e)
          })
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        handleEdit(row) {
          this.dialogFormVisible = true
          this.form.src = '.'+row.path;
          this.form.desc = row.description;
        },
        handleDelete(index, row) {
          console.log(index, row);
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
</style>
