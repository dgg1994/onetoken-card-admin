<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="language">
              <el-select v-model="queryParams.language" filterable placeholder="请选择语言" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in languageList" :key="item.name" :label="item.value" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="title">
              <el-input v-model="queryParams.title" placeholder="请输入标题" clearable style="width: 240px"
                @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="语言" align="center" prop="languageName" />
          <el-table-column label="标题" align="center" prop="title" />
          <el-table-column label="简介" align="center" prop="intro" />
          <el-table-column label="内容" align="center" prop="content" />
          <el-table-column label="通知类型" align="center" prop="typeName" />
          <!-- <el-table-column label="状态" align="center" prop="statusName" /> -->
          <el-table-column label="创建时间" align="center" prop="setTime" />
          <el-table-column label="操作" align="center" >
            <template slot-scope="scope" v-if="scope.row.roleId !== 1">
              <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
              <el-button size="mini" type="text" @click="send(scope.row)">发送消息</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />


        <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="title" :visible.sync="dialogOpen" width="30%" :close-on-click-modal="false" @close="handleClose" append-to-body>
          <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="语言" prop="language">
                  <el-select v-model="formData.language" filterable placeholder="请选择语言" :disabled="upState"
                    style="width: 100%;">
                    <el-option v-for="item in languageList" :key="item.name" :label="item.value" :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="标题" prop="title">
                  <el-input v-model="formData.title" placeholder="请输入标题" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="简介" prop="intro">
                  <el-input type="textarea" :rows="4" v-model="formData.intro" placeholder="请输入简介" />
                </el-form-item>
              </el-col>
               <el-col :span="24">
                <el-form-item label="内容" prop="content">
                  <el-input type="textarea" :rows="4" v-model="formData.content" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm" v-debounce>确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getLanguage} from "@/api/dic/dic";
import { noticeList, noticeAdd, noticeDelete,noticeUpdate,noticeSend} from "@/api/msgNotice/msgNotice";

export default {
  name: "typesOfPoints",
 
  data() {
    return {
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      dialogOpen: false,
      loading: true,
      formData: {},
      upState: false,
      logoURL:[],
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      languageList: [],
      // 表单校验
      rules: {
        language: [
          { required: true, message: "请选择语言", trigger: "blur" },
        ],
        title: [
          { required: true, message: "请输入简介内容", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
  },
  created() {
    this.getLanguageList()
    this.getList();
  },
  methods: {

    getLanguageList() {
      getLanguage().then(res => {
        this.languageList = res.data
      })
    },

    getList() {
      this.loading = true;
      this.queryParams.type = 2
      noticeList(this.queryParams).then(res => {
        this.dataList = res.data.list
        this.total = res.data.total
        this.loading = false
      })

    },
    // 取消按钮
    cancel() {
      this.dialogOpen = false;
      this.upState = false
      this.reset();
    },

    handleClose(){
      this.dialogOpen = false;
      this.upState = false
      this.reset();
    },
    // 表单重置
    reset() {
      this.formData = {};
      this.resetForm("form");
    },
    resetQuery() {
      this.queryParams = {}
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNumber = 1;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.upState = false,
      this.dialogOpen = true;
      this.title = "添加";
    },

      handleUpdate(row) {
      this.reset();
      this.formData = row;
      console.log(row)
      this.upState = true;
      this.dialogOpen = true;
      this.title = "编辑";
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.formData.type = 2
          if(this.formData.id){//编辑
             noticeUpdate(this.formData).then(res => {
              if(res.code == 200){
                this.$modal.msgSuccess("修改成功");
                this.dialogOpen = false;
                this.getList()
              }else{
                this.$modal.msgError("修改失败");
                this.dialogOpen = false;
                this.getList()
              }
            })
          }else{//新增
            noticeAdd(this.formData).then(res => {
              if(res.code == 200){
                this.$modal.msgSuccess("新增成功");
                this.dialogOpen = false;
                this.getList()
              }else{
                this.$modal.msgError("新增失败");
                this.dialogOpen = false;
                this.getList()
              }
            })
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除？').then(function () {
        return noticeDelete(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    send(row) {
      this.$modal.confirm('是否确认给所有用户推送此消息？').then(function () {
        return noticeSend(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("发送成功");
      }).catch(() => { });
    },



  }
};
</script>
<style>
.mainBox {
  height: calc(100vh - 84px);
  overflow-y: auto;
  background-color: #efefef;

}

.flex_sb {
  display: flex;
  justify-content: space-between;
}

.app-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.conetntBox {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
}
</style>
