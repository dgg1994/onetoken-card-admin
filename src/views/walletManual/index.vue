<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="sendUid">
              <el-input v-model="queryParams.sendUid" placeholder="请输入发送方uid" />
            </el-form-item>
            <el-form-item label="" prop="sendEmail">
              <el-input v-model="queryParams.sendEmail" placeholder="请输入发送方邮箱" />
            </el-form-item>
            <el-form-item label="" prop="recipientUid">
              <el-input v-model="queryParams.recipientUid" placeholder="请输入接收方uid" />
            </el-form-item>
            <el-form-item label="" prop="recipientEmail">
              <el-input v-model="queryParams.recipientEmail" placeholder="请输入接收方邮箱" />
            </el-form-item>

            <el-form-item label="" prop="orderNo">
              <el-input v-model="queryParams.orderNo" placeholder="请输入订单编号" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="订单号" align="center" prop="orderNo" />
          <el-table-column label="用户uid" align="center" prop="uid" />
          <el-table-column label="用户邮箱" align="center" prop="userEmail" />
          <el-table-column label="用户手机号" align="center" prop="userTel" />
          <el-table-column label="钱包类型" align="center" prop="walletType" />
          <el-table-column label="钱包地址" align="center" prop="walletAddress" />
          <el-table-column label="充值金额" align="center" prop="topupAmount" />
          <el-table-column label="充值前金额" align="center" prop="topupAmountForward" />
          <el-table-column label="充值后金额" align="center" prop="topupAmountBack" />
          <el-table-column label="操作人" align="center" prop="operateUserName" />
          <el-table-column label="操作ip" align="center" prop="operateUserIp" />
          <el-table-column label="操作时间" align="center" prop="setTime" />

        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </div>
    </div>

  </div>
</template>

<script>
import { walletManualLogList } from "@/api/walletManual/walletManual";
export default {
  name: "typesOfPoints",

  data() {
    return {
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      title: "",
      loading: true,
      userInfo: {},
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
      walletManualLogList(this.queryParams).then(res => {
        this.dataList = res.data.list
        this.total = res.data.total
        this.loading = false
      })

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
