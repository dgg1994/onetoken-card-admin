<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="orderNum">
              <el-input v-model="queryParams.orderNum" placeholder="请输入订单编号"/>
            </el-form-item>
            <el-form-item label="" prop="productName">
              <el-input v-model="queryParams.productName" placeholder="请输入产品名称"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="用户邮箱" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.appUser.userEmail}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="用户手机号" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.appUser.mobileNumber}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="钱包余额" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.appUser.walletBalance}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="冻结资产" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.appUser.freezeBalance}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="订单编号" align="center" prop="orderNum" />
          <!-- <el-table-column label="订单金额" align="center" prop="orderMonery" /> -->
          <el-table-column label="订单金额" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.orderMonery +' '+ 'USD' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" align="center" prop="productName" />
          <el-table-column label="产品类型" align="center" prop="productType" />
          <el-table-column label="资金类型" align="center" prop="fundsType" />
          <!-- <el-table-column label="理财时长" align="center" prop="productTime" />
            -->
          <el-table-column label="理财时长" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.productTime + '天' }}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="年利率" align="center" prop="interestRate" />
            -->
          <el-table-column label="年利率" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.interestRate * 100 + '%'}}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="是否活期" align="center" prop="whetherCurrent" />
            -->
          <el-table-column label="是否活期类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.whetherCurrent === 1">
                是
              </span>
              <span v-else>
                否
              </span>
            </template>
          </el-table-column>
          <el-table-column label="预计收益" align="center" prop="estimateIncome" />
          <el-table-column label="实际收益" align="center" prop="actualIncome" />
          <el-table-column label="订单状态" align="center" prop="orderState" />
          <el-table-column label="购买时间" align="center" prop="payTime" />
          <el-table-column label="到期时间" align="center" prop="expireTime" />
          <el-table-column label="完成时间" align="center" prop="finishTime" />
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </div>
    </div>
  </div>
</template>

<script>
import { productOrderList} from "@/api/product/product";

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
      productOrderList(this.queryParams).then(res => {
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
