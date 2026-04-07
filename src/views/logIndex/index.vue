<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="userName">
              <el-input v-model="queryParams.userName" placeholder="请输入操作人"/>
            </el-form-item>
            <el-form-item label="" prop="moduleName">
              <el-input v-model="queryParams.moduleName" placeholder="请输入操作模块"/>
            </el-form-item>
            <el-form-item label="" prop="reqUrl">
              <el-input v-model="queryParams.reqUrl" placeholder="请输入请求接口地址"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="序号" type="index" width="50" align="center" />
        
          <el-table-column label="操作人" align="center" prop="userName" />
          <el-table-column label="操作模块" align="center" prop="moduleName" />
          <el-table-column label="操作内容" align="center" prop="moduleInfo" />
          <el-table-column label="请求方式" align="center" prop="reqType" />
         
          <el-table-column label="请求接口" align="center" prop="reqUrl" />
          <el-table-column label="请求ip" align="center" prop="ipUrl" />
          <el-table-column label="参数" align="center" prop="reqParamet" :show-overflow-tooltip="true"/>
          <el-table-column label="响应" align="center" prop="resData" :show-overflow-tooltip="true"/>
          <el-table-column label="开始时间" align="center" prop="begTime" />
          <el-table-column label="结束时间" align="center" prop="endTime" />
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </div>
    </div>
  </div>
</template>

<script>
import { logList} from "@/api/system/log";

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
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
    };
  },
  watch: {
  },
  created() {
    this.getList();
  },
  methods: {

    //交易列表
    getList() {
      this.loading = true;
      logList(this.queryParams).then(res => {
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
