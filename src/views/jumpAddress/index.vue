<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">

            <el-form-item label="" prop="language">
              <el-select v-model="queryParams.language" filterable placeholder="请选择语言" 
                style="width: 100%;">
                <el-option v-for="item in languageList" :key="item.name" :label="item.value" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="configType">
              <el-select v-model="queryParams.configType" filterable placeholder="请选择协议类型" 
                style="width: 100%;">
                <el-option v-for="item in protocolTypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="status">
              <el-select v-model="queryParams.status" filterable placeholder="请选择状态" 
                style="width: 100%;">
                <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary"  @click="handleAdd">新增</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="序号" type="index" width="50" align="center" />
          
          <el-table-column label="语言" align="center" prop="languageName" />
          <el-table-column label="分类" align="center" prop="configTypeName" />
          <!-- <el-table-column label="配置名称" align="center" prop="configName" /> -->
          <el-table-column label="配置内容" align="center" prop="configContent" :show-overflow-tooltip="true"/>
          <el-table-column label="状态" align="center" >
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">
                正常
              </span>
              <span v-else>
                停用
              </span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="setTime" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope" v-if="scope.row.roleId !== 1">
              <el-button v-if="scope.row.status === 1" size="mini" type="text" @click="upSysState(scope.row,2)">停用</el-button>
              <el-button v-else size="mini" type="text" @click="upSysState(scope.row,1)">启用</el-button>
              <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />


         <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="title" :visible.sync="dialogOpen" width="60%" :close-on-click-modal="false" append-to-body>
          <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="语言" prop="language">
                  <el-select v-model="formData.language" filterable placeholder="请选择语言" :disabled="upState"  style="width: 100%;">
                    <el-option v-for="item in languageList" :key="item.name" :label="item.value" :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="配置类型" prop="configType">
                  <el-select v-model="formData.configType" filterable placeholder="请选择配置类型" :disabled="upState"  style="width: 100%;">
                    <el-option v-for="item in protocolTypeList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
             <el-row>
              <el-col :span="24">
                <el-form-item label="跳转地址" prop="configContent">
                   <el-input type="textarea" :rows="4" v-model="formData.configContent" placeholder="请输入跳转地址" />
                </el-form-item>
              </el-col>
             
            </el-row>
            <!-- <el-row>
              <editor v-model="formData.configContent":min-height="340"/>
            </el-row> -->
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
import { getLanguage,findJumpAddress} from "@/api/dic/dic";
import { sysConfigList,sysConfigAdd,sysConfigUpdate,sysConfigDelete,sysChangeStatus} from "@/api/sysConfig/sysConfig";
import uploadImg from '@/components/uploadImg/uploadImg.vue'
export default {
  name: "typesOfPoints",
  components: {
    uploadImg
  },
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
      protocolTypeList:[],
      statusList:[
        {
          "id":1,
          "name":"正常"
        },
         {
          "id":2,
          "name":"停用"
        }
      ],
      // 表单校验
      rules: {
        language: [
          { required: true, message: "请选中语言", trigger: "blur" },
        ],
        title: [
          { required: true, message: "请填写标题描述", trigger: "blur" },
        ],
      
      },
    };
  },
  watch: {
  },
  created() {
    this.getLanguageList()
    this.getJumpAddress()
    this.getList();
  },
  methods: {

    getLanguageList() {
      getLanguage().then(res => {
        this.languageList = res.data
      })
    },
    getJumpAddress(){
      findJumpAddress().then(res => {
        this.protocolTypeList = res.data
      })
    },
    

    getList() {
      this.loading = true;
      this.queryParams.configLable = 2
      sysConfigList(this.queryParams).then(res => {
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
      this.logoURL=[]
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

     /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.logoURL = row.imgUrl
      this.formData = row;
      this.upState = true;
      this.dialogOpen = true;
      this.title = "编辑";
    },
   
   
     /** 提交按钮 */
    submitForm: function () {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          if(this.formData.id){//编辑
             sysConfigUpdate(this.formData).then(res => {
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
            sysConfigAdd(this.formData).then(res => {
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
        return sysConfigDelete(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

     upSysState(row,state){
      this.$modal.confirm('是否确修改状态？').then(function () {
        return sysChangeStatus(row.id,state);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => { });
    }


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
