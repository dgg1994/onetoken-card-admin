<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">

            <el-form-item label="" prop="appVersion">
              <el-input v-model="queryParams.appVersion" placeholder="请输入版本号" clearable />
            </el-form-item>
            <el-form-item label="" prop="language">
              <el-select v-model="queryParams.deviceType" filterable placeholder="请选设备类型" style="width: 100%;">
                <el-option v-for="item in deviceTypeList" :key="item.name" :label="item.value" :value="item.name">
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
              <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="设备类型" align="center" prop="deviceType" />
          <el-table-column label="版本号" align="center" prop="appVersion" />

          <el-table-column label="钱包入口" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.walletState">关闭</span>
              <span v-else>开启</span>
            </template>
          </el-table-column>

          <el-table-column label="市场入口" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.marketState">关闭</span>
              <span v-else>开启</span>
            </template>
          </el-table-column>

          <el-table-column label="交易入口" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.tradeState">关闭</span>
              <span v-else>开启</span>
            </template>
          </el-table-column>

          <el-table-column label="onepay入口" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.onepayState">关闭</span>
              <span v-else>开启</span>
            </template>
          </el-table-column>

          <el-table-column label="设置入口" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.siteState">关闭</span>
              <span v-else>开启</span>
            </template>
          </el-table-column>

          <el-table-column label="钱包入口" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.walletState">关闭</span>
              <span v-else>开启</span>
            </template>
          </el-table-column>

          <el-table-column label="钱包入口" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.walletState">关闭</span>
              <span v-else>开启</span>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" align="center" prop="setTime" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope" v-if="scope.row.roleId !== 1">
              <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />


        <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="title" :visible.sync="dialogOpen" width="40%" :close-on-click-modal="false"
          @close="handleClose" append-to-body>
          <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
            <el-row>

              <el-col :span="24">
                <el-form-item label="设备类型" prop="ipSite">
                  <el-select v-model="formData.deviceType" filterable placeholder="请选设备类型" style="width: 100%;">
                    <el-option v-for="item in deviceTypeList" :key="item.name" :label="item.value" :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="版本号" prop="appVersion">
                  <el-input v-model="formData.appVersion" placeholder="请输入版本号" />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="钱包入口" prop="walletState">
                  <el-select v-model="formData.walletState" filterable placeholder="钱包入口" style="width: 100%;">
                    <el-option v-for="item in stateList" :key="item.name" :label="item.value" :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="市场入口" prop="marketState">
                  <el-select v-model="formData.marketState" filterable placeholder="市场入口" style="width: 100%;">
                    <el-option v-for="item in stateList" :key="item.name" :label="item.value" :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="交易入口" prop="tradeState">
                  <el-select v-model="formData.tradeState" filterable placeholder="交易入口" style="width: 100%;">
                    <el-option v-for="item in stateList" :key="item.name" :label="item.value" :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="onepay入口" prop="onepayState">
                  <el-select v-model="formData.onepayState" filterable placeholder="onepay入口" style="width: 100%;">
                    <el-option v-for="item in stateList" :key="item.name" :label="item.value" :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="设置入口" prop="siteState">
                  <el-select v-model="formData.siteState" filterable placeholder="设置入口" style="width: 100%;">
                    <el-option v-for="item in stateList" :key="item.name" :label="item.value" :value="item.name">
                    </el-option>
                  </el-select>
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
import { sysNavigateConfigList, sysNavigateConfigAdd, sysNavigateConfigDelete, sysNavigateConfigUpdate } from "@/api/navigateConfig/navigateConfig";
import { findDeviceTypeList } from "@/api/dic/dic";

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
      logoURL: [],
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      deviceTypeList: [],
      userInfo: null,
      stateList: [
        { name: false, value: '开启' },
        { name: true, value: '关闭' }
      ],
      // 表单校验
      rules: {
        deviceType: [
          { required: true, message: "请选择设备类型", trigger: "blur" },
        ],
        appVersion: [
          { required: true, message: "请输入应用版本", trigger: "blur" },
        ],
        walletState: [
          { required: true, message: "请选择钱包状态", trigger: "blur" },
        ],
        marketState: [
          { required: true, message: "请选择市场状态", trigger: "blur" },
        ],
        tradeState: [
          { required: true, message: "请选择交易状态", trigger: "blur" },
        ],
        onepayState: [
          { required: true, message: "请选择onepay状态", trigger: "blur" },
        ],
        siteState: [
          { required: true, message: "请选择设置状态", trigger: "blur" },
        ]
      },
    };
  },
  watch: {
  },
  created() {
    this.userInfo = this.$store.state.user.userInfo;
    this.getDeviceTypeList();
    this.getList();
  },
  methods: {

    getDeviceTypeList() {
      findDeviceTypeList().then(res => {
        this.deviceTypeList = res.data
      })
    },


    getList() {
      this.loading = true;
      sysNavigateConfigList(this.queryParams).then(res => {
        this.dataList = res.data.list
        this.total = res.data.total
        this.loading = false
      })

    },
    // 取消按钮
    cancel() {
      this.dialogOpen = false;
      this.reset();
    },

    handleClose() {
      this.dialogOpen = false;
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
      this.dialogOpen = true;
      this.title = "添加";
    },

    handleUpdate(row) {
      this.reset();
      this.formData = row;
      this.dialogOpen = true;
      this.title = "编辑";
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.formData.setUser = this.userInfo.id
          this.formData.setUserName = this.userInfo.username
          if (this.formData.id) {
            sysNavigateConfigUpdate(this.formData).then(res => {
              if (res.code == 200) {
                this.$modal.msgSuccess("修改成功");
                this.dialogOpen = false;
                this.getList()
              } else {
                this.$modal.msgError("修改失败");
                this.dialogOpen = false;
                this.getList()
              }
            })
          } else {
            sysNavigateConfigAdd(this.formData).then(res => {
              if (res.code == 200) {
                this.$modal.msgSuccess("新增成功");
                this.dialogOpen = false;
                this.getList()
              } else {
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
        return sysNavigateConfigDelete(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
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

.flex_end {
  display: flex;
  justify-content: flex-end;
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
