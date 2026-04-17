<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="orderNum">
              <el-input v-model="queryParams.orderNum" placeholder="请输入订单编号" clearable style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="productType">
              <el-select v-model="queryParams.productType" filterable placeholder="请选择产品类型" clearable style="width: 150px;">
                <el-option label="定期" value="1"></el-option>
                <el-option label="活期" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="orderState">
              <el-select v-model="queryParams.orderState" filterable placeholder="请选择订单状态" clearable style="width: 150px;">
                <el-option label="持有中" value="active"></el-option>
                <el-option label="已赎回" value="redeemed"></el-option>
                <el-option label="已到期" value="expired"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="setTimeRange">
              <el-date-picker
                v-model="setTimeRange"
                type="datetimerange"
                style="width: 340px"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="购买时间起"
                end-placeholder="购买时间止"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="订单编号" align="center" prop="orderNum" />
          <el-table-column label="订单金额" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.orderMoney +' '+ 'USD' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" align="center" prop="productName" />
          <el-table-column label="产品类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.productType === 1">
                定期
              </span>
              <span v-else>
                活期
              </span>
            </template>
          </el-table-column>
          <el-table-column label="理财时长" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.productType === 1">
                {{ scope.row.productTime + '天' }}
              </span>
              <span v-else>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="年利率" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.interestRate * 100 + '%'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="预计收益" align="center" prop="estimateIncome" />
          <el-table-column label="实际收益" align="center" prop="actualIncome" />
          <el-table-column label="总收益" align="center" prop="totalIncome" />
          <el-table-column label="订单状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.orderState === 'active'">
                持有中
              </span>
              <span v-else-if="scope.row.orderState === 'redeemed'">
                已赎回
              </span>
              <span v-else-if="scope.row.orderState === 'expired'">
                已到期
              </span>
              <span v-else>
                {{ scope.row.orderState }}
              </span>
            </template>
          </el-table-column>
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
import { getLanguage } from "@/api/dic/dic";
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
      setTimeRange: [],
      languageList: [],
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
        language: '',
        orderNum: '',
        orderState: '',
        productType: '',
        startTime: '',
        endTime: ''
      },
    };
  },
  watch: {
  },
  created() {
    this.getLanguageList();
    this.getList();
  },
  methods: {
    getLanguageList() {
      getLanguage().then(res => {
        this.languageList = res.data || [];
      })
    },

    buildProductListPayload() {
      const p = { ...this.queryParams };
      if (p.language === "" || p.language == null) delete p.language;
      if (p.orderNum === "" || p.orderNum == null) delete p.orderNum;
      if (p.orderState === "" || p.orderState == null) delete p.orderState;
      if (p.productType === "" || p.productType == null) delete p.productType;
      if (Array.isArray(this.setTimeRange) && this.setTimeRange.length === 2) {
        p.startTime = this.setTimeRange[0];
        p.endTime = this.setTimeRange[1];
      } else {
        delete p.startTime;
        delete p.endTime;
      }
      return p;
    },

    //交易列表
    getList() {
      this.loading = true;
      productOrderList(this.buildProductListPayload()).then(res => {
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
      this.setTimeRange = [];
      this.queryParams = {
        pageNumber: 1,
        pageSize: 10,
        language: '',
        orderNum: '',
        orderState: '',
        productType: '',
        startTime: '',
        endTime: ''
      }
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
