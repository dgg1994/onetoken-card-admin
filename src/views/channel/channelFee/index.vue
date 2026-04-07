<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form
            :model="queryParams"
            size="small"
            :inline="true"
            label-width="68px"
          >
            <el-form-item prop="dateRange">
              <el-date-picker
                :clearable="false"
                v-model="queryParams.timeData"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="date-picker"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="queryParams.userId"
                placeholder="请选择渠道商"
              >
                <el-option
                  v-for="item in channelList"
                  :key="item.userId"
                  :value="item.userId"
                  :label="item.channelName"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
          />
          <el-table-column label="渠道商" align="center" prop="channelName" />
          <el-table-column label="总额" align="center">
            <el-table-column
              label="商户可用余额"
              align="center"
              prop="merchantAvailableAmount" />
            <el-table-column
              label="银行卡总额"
              align="center"
              prop="cardTotal" />

            <el-table-column
              label="用户钱包总额"
              align="center"
              prop="walletTotal" />
            <el-table-column
              label="用户返利总金额"
              align="center"
              prop="borkerageFee"
          /></el-table-column>

          <el-table-column
            label="银行卡充值总额"
            align="center"
            prop="cardTopupTotal"
          />
          <el-table-column
            label="银行卡充值手续费总额"
            align="center"
            prop="cardTopupFee"
          />
          <el-table-column
            label="银行卡消费总额"
            align="center"
            prop="cardConsumeTotal"
          />
          <!-- <el-table-column
              label="消费手续费总额"
              align="center"
              prop="cardConsumeFee"
            /> -->
          <el-table-column
            label="开卡总费用"
            align="center"
            prop="openCardFee"
          />

          <el-table-column
            label="注册用户量"
            align="center"
            prop="registerUserNum"
          />
          <el-table-column
            label="钱包充值人数"
            align="center"
            prop="topupUserNum"
          />
          <el-table-column
            label="开卡人数"
            align="center"
            prop="openCardUserNum"
          />
          <el-table-column
            label="实体卡申请数量"
            align="center"
            prop="openCardPhNum"
          />
          <el-table-column
            label="虚拟卡申请数量"
            align="center"
            prop="openCardViNum"
          />
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { channelTotal, getChannelList } from "@/api/channel/index";

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
      channelList: {},
      // 是否显示弹出层
      dialogOpen: false,
      loading: true,
      formData: {},
      upState: false,
      // 查询参数
      queryParams: {
        userId: null,
        pageNumber: 1,
        pageSize: 10,
        timeData: [],
      },
    };
  },

  created() {
    this.queryParams.timeData = [
      this.formatUTCYYYYMMDD(),
      this.formatUTCYYYYMMDD(),
    ];
    this.getList();
    getChannelList().then((res) => {
      this.channelList = res.data;
    });
  },
  methods: {
    formatUTCYYYYMMDD(ts = Date.now()) {
      const d = new Date(ts);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    },
    //交易列表
    getList() {
      this.loading = true;
      const params = JSON.parse(JSON.stringify(this.queryParams));
      params.begTime = this.queryParams.timeData[0];
      params.endTime = this.queryParams.timeData[1];
      delete params.timeData;
      channelTotal(params).then((res) => {
        this.dataList = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.dialogOpen = false;
      this.upState = false;
      this.reset();
    },

    handleClose() {
      this.dialogOpen = false;
      this.upState = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.formData = {};
      this.resetForm("form");
    },
    resetQuery() {
      this.queryParams = {
        userId: null,
        timeData: [this.formatUTCYYYYMMDD(), this.formatUTCYYYYMMDD()],
        pageNumber: 1,
      };
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNumber = 1;
      this.getList();
    },
  },
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
