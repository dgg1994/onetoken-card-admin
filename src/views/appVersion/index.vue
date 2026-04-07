<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">

            <el-form-item label="" prop="state">
              <el-select v-model="queryParams.state" filterable placeholder="请选择状态" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

             <el-form-item label="" prop="platform">
              <el-select v-model="queryParams.platform" filterable placeholder="请选择平台" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in platformList" :key="item.id" :label="item.name" :value="item.id">
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
              <el-button type="primary" @click="handleAdd">新增</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="平台" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.platform === 1">
                Android
              </span>
              <span v-else>
                IOS
              </span>
            </template>
          </el-table-column>
          <el-table-column label="版本号" align="center" prop="appVersion" />
          <el-table-column label="发布状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.state === 1" style="color: green;">
                待发布
              </span>
              <span v-if="scope.row.state === 2" style="color: blue;">
                已发布
              </span>
              <span v-if="scope.row.state === 3">
                已停用
              </span>
            </template>
          </el-table-column>
          <el-table-column label="强制更新" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.updateType === 1">
                是
              </span>
              <span v-else>
                否
              </span>
            </template>
          </el-table-column>
          <el-table-column label="下载地址" align="center" prop="apkUrl" />
          <el-table-column label="中文更新内容" align="center" prop="updateContentZh" :show-overflow-tooltip="true"/>
          <el-table-column label="英文更新内容" align="center" prop="updateContentEn" :show-overflow-tooltip="true"/>
          <el-table-column label="繁体更新内容" align="center" prop="updateContentTw" :show-overflow-tooltip="true"/>

          <el-table-column label="创建时间" align="center" prop="setTime" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button v-if="scope.row.state === 1"  size="mini" type="text" @click="release(scope.row)">发布</el-button>
              <el-button v-if="scope.row.state != 3" size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
              <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />


        <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="title" :visible.sync="dialogOpen" width="50%" :close-on-click-modal="false"
          @close="handleClose" append-to-body>
          <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="应用平台" prop="platform">
                  <el-select v-model="formData.platform" filterable placeholder="请选择应用平台" :disabled="upState"
                    style="width: 100%;" @change="handlePlatformChange">
                    <el-option v-for="item in platformList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="版本号" prop="appVersion">
                  <el-input v-model="formData.appVersion" placeholder="请输入版本号" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="强制更新" prop="updateType">
                  <el-select v-model="formData.updateType" filterable placeholder="请选择是否强制更新" 
                    style="width: 100%;">
                    <el-option v-for="item in updateTypeList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
           
            <el-row v-if="platformId === 2">
              <el-col :span="24">
                <el-form-item label="ios下载地址" prop="apkUrl">
                  <el-input v-model="formData.apkUrl" placeholder="请输入ios下载地址" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="platformId === 1">
              <el-col :span="24">
                <el-form-item label="APK文件" prop="fileList">
                  <el-upload class="upload-demo" action="#" :limit="1" :auto-upload="false" :show-file-list="true"
                    :on-change="handleChangeEcho" :on-preview="handlePictureCardPreviewEcho" :on-remove="handleRemoveEcho"
                    :file-list="fileList">
                    <el-button size="small" type="primary">点击上传APK</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="中文更新内容" prop="updateContentZh">
                  <el-input type="textarea" :rows="4" v-model="formData.updateContentZh" placeholder="请输入中文更新内容" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row >
              <el-col :span="24">
                <el-form-item label="英文更新内容" prop="updateContentEn">
                  <el-input type="textarea" :rows="4" v-model="formData.updateContentEn" placeholder="请输入英文更新内容" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row >
              <el-col :span="24">
                <el-form-item label="繁体更新内容" prop="updateContentTw">
                  <el-input type="textarea" :rows="4" v-model="formData.updateContentTw" placeholder="请输入繁体更新内容" />
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
import { appVersionFindList, appVersionAdd, appVersionUpdate, appVersionFindRelease } from "@/api/appVersion/appVersion";
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
      logoURL: [],
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      languageList: [],
      statusList: [
        {
          "id": 1,
          "name": "待发布"
        },
        {
          "id": 2,
          "name": "已发布"
        },
        {
          "id": 3,
          "name": "已停用"
        }
      ],
      platformList:[
        {
          "id": 1,
          "name": "Android"
        },
         {
          "id": 2,
          "name": "IOS"
        }
      ],
      updateTypeList:[
        {
          "id": 1,
          "name": "是"
        },
         {
          "id": 2,
          "name": "否"
        }
      ],
      platformId:null,
      fileList:[],
      userInfo:null,
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
    this.userInfo = this.$store.state.user.userInfo;
    this.getList();
  },
  methods: {

    getList() {
      this.loading = true;
      appVersionFindList(this.queryParams).then(res => {
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

    handleClose() {
      this.dialogOpen = false;
      this.upState = false
      this.reset();
    },
    // 表单重置
    reset() {
      this.filesList = []
      this.platformId = null
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
      // this.fileList = row.apkUrl
      this.platformId = row.platform
      this.formData = row;
      this.upState = true;
      this.dialogOpen = true;
      this.title = "编辑";
    },

    handlePlatformChange(val){
      this.platformId = val
    },

    submitForm: function () {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          window.loadingInstance = this.$loading({
            lock: true,
            text: '资源上传中，请稍后.....',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.formData.setUser = this.userInfo.id
          this.formData.setUserName = this.userInfo.username
          if (this.formData.id) {
            let fordata = new FormData()
            if (this.logoURL && this.logoURL.length > 0 && this.logoURL[0].raw) {
              this.logoURL.forEach((val, index) => {
                fordata.append("file", val.raw);
              });
            }
            fordata.append("dataStr", JSON.stringify(this.formData))
            appVersionUpdate(fordata).then(res => {
              this.$modal.msgSuccess("编辑成功");
              this.dialogOpen = false;
              this.getList();
              this.upState = false
              window.loadingInstance.close();
              window.loadingInstance = null;
            })
          } else {
            let fordata = new FormData()
            if (this.fileList && this.fileList.length > 0 && this.fileList[0].raw) {
              this.fileList.forEach((val, index) => {
                fordata.append("file", val.raw);
              });
            } else {
              if(this.platformId === 1){
                this.$modal.msgError("请上传安装包")
                window.loadingInstance.close();
                window.loadingInstance = null;
                return;
              }
            }
            fordata.append("dataStr", JSON.stringify(this.formData))
            appVersionAdd(fordata).then(res => {
              this.$modal.msgSuccess("新增成功");
              this.dialogOpen = false;
              this.getList();
              this.upState = false
              window.loadingInstance.close();
              window.loadingInstance = null;
            });
          }
        }
      });
    },

    /** 删除按钮操作 */
    // handleDelete(row) {
    //   this.$modal.confirm('是否确认删除？').then(function () {
    //     return BannerDelete(row.id);
    //   }).then(() => {
    //     this.getList();
    //     this.$modal.msgSuccess("删除成功");
    //   }).catch(() => { });
    // },

    release(row) {
      this.$modal.confirm('是否确发布此版本？').then(function () {
        return appVersionFindRelease(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => { });
    },

    handleRemoveEcho(file, filesList) {
      this.fileList = filesList;
    },
    handlePictureCardPreviewEcho(file) {

    },
    handleChangeEcho(file, filesList) {
      this.fileList = filesList;
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
