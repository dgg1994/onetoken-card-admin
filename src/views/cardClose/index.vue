<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
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

        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="用户uid" align="center" prop="uid" />
          <el-table-column label="用户邮箱" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.appUserData.userEmail }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="订单编号" align="center" prop="requestOrderId" />
          <el-table-column label="银行卡号" align="center" prop="cardNo" />
          <el-table-column label="银行卡类型" align="center" prop="cardType" />
          <el-table-column label="银行卡余额" align="center" prop="balance" />
          <el-table-column label="退款金额" align="center" prop="refundAmt" />
          <el-table-column label="注销状态" align="center" prop="reviewStatusName" />
          <el-table-column label="提交时间" align="center" prop="setTime" />
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </div>
    </div>
  </div>
</template>

<script>
import { cardCloseList} from "@/api/cardClose/cardClose";

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
      cardCloseList(this.queryParams).then(res => {
        console.log(res)
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
