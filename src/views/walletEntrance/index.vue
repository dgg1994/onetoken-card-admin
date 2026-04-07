<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <!-- <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="cardNo">
              <el-input v-model="queryParams.cardNo" placeholder="请输入银行卡号"/>
            </el-form-item>
            <el-form-item label="" prop="requestOrderId">
              <el-input v-model="queryParams.requestOrderId" placeholder="请输入订单编号"/>
            </el-form-item>
            <el-form-item label="" prop="userEmail">
              <el-input v-model="queryParams.userEmail" placeholder="请输入用户邮箱"/>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

        </div> -->
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="钱包入口状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.walletState">
                开启中
              </span>
               <span v-else>
                关闭中
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作人" align="center" prop="operateUser" />
          <el-table-column label="操作时间" align="center" prop="setTime" />
           <el-table-column label="操作" align="center" >
          <template slot-scope="scope" v-if="scope.row.roleId !== 1">
              <el-button v-if="scope.row.walletState" size="mini" type="text" @click="operate(scope.row,false)">关闭入口</el-button>
              <el-button v-else size="mini" type="text" @click="operate(scope.row,true)">开启入口</el-button>
            </template>
          </el-table-column>
        </el-table>
        
      </div>
    </div>
  </div>
</template>

<script>
import { walletEntranceList,walletEntranceOperate} from "@/api/wallet/wallet";

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
      userInfo:null,
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
    this.userInfo = this.$store.state.user.userInfo;
    this.getList();
  },
  methods: {

    //交易列表
    getList() {
      this.loading = true;
      walletEntranceList().then(res => {
        this.dataList = res.data
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


    operate(row,type) {
      let username = this.userInfo.username
      this.$modal.confirm('是否确认操作？').then(function () {
        return walletEntranceOperate(type,username);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
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
