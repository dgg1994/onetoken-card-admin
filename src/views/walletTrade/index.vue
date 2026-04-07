<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="orderNo">
              <el-input v-model="queryParams.orderNo" placeholder="请输入订单编号"/>
            </el-form-item>
           
            <el-form-item label="" prop="userEmail">
              <el-input v-model="queryParams.userEmail" placeholder="请输入用户邮箱"/>
            </el-form-item>

            <!-- <el-form-item label="" prop="toAccount">
              <el-input v-model="queryParams.toAccount" placeholder="请输入银行卡号"/>
            </el-form-item> -->
            <el-form-item label="" prop="tradeType">
              <el-select v-model="queryParams.tradeType" filterable placeholder="请选择交易方向" le="width: 100%;">
                <el-option v-for="item in tradeTypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="" prop="status">
              <el-select v-model="queryParams.status" filterable placeholder="请选择交易状态" le="width: 100%;">
                <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
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
          <el-table-column label="用户邮箱" align="center" prop="userEmail" />
          <el-table-column label="订单编号" align="center" prop="orderNo" />
          <el-table-column label="交易类型" align="center" prop="title" />
          <!-- <el-table-column label="交易银行卡" align="center" prop="toAccount" /> -->
          <el-table-column label="交易方向" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.tradeType === 1">
                入账
              </span>
              <span v-else>
                出账
              </span>
            </template>
          </el-table-column>
          <el-table-column label="手续费" align="center" prop="serviceCharge" />
          <el-table-column label="交易金额" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.tradeType === 1">
                {{ "+"+scope.row.realMoney+" "+ scope.row.primevalMoneyUnit}}
              </span>
              <span v-else>
                {{ "-"+scope.row.realMoney+" "+ scope.row.primevalMoneyUnit}}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="当前余额" align="center" prop="currentMonery" /> -->
          <el-table-column label="交易状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status === '1'">
                交易处理中
              </span>
              <span v-if="scope.row.status === '2'">
                交易成功
              </span>
               <span v-if="scope.row.status === '3'">
                交易失败
              </span>
            </template>
          </el-table-column>
          <el-table-column label="交易时间" align="center" prop="setTime" />
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </div>
    </div>
  </div>
</template>

<script>
import { findWalletLogn} from "@/api/wallet/wallet";

export default {
  name: "typesOfPoints",

  data() {
    return {
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      loading: true,
      formData: {},
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      tradeTypeList:[
        {
          "id":1,
          "name":"入账"
        },
        {
          "id":2,
          "name":"出账"
        }
      ],
      statusList:[
        {
          "id":1,
          "name":"交易处理中"
        },
        {
          "id":2,
          "name":"交易成功"
        },
        {
          "id":3,
          "name":"交易失败"
        },
      ]
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
      findWalletLogn(this.queryParams).then(res => {
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
