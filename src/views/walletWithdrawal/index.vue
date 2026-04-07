<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="userEmail">
              <el-input v-model="queryParams.userEmail" placeholder="请输入用户邮箱" />
            </el-form-item>
            <el-form-item label="" prop="orderNo">
              <el-input v-model="queryParams.orderNo" placeholder="请输入订单编号" />
            </el-form-item>
            <el-form-item label="" prop="walletAddress">
              <el-input v-model="queryParams.walletAddress" placeholder="请输入钱包地址" />
            </el-form-item>


            <el-form-item label="" prop="networkType">
              <el-select v-model="queryParams.networkType" filterable placeholder="请选择网络类型" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in networkTypeList" :key="item.name" :label="item.name" :value="item.name">
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
          <el-table-column label="网络类型" align="center" prop="networkType" />
          <el-table-column label="代币名称" align="center" prop="tokenName"/>
          <el-table-column label="钱包地址" align="center" prop="walletAddress" />
          <el-table-column label="申请金额" align="center" prop="transferAmount" />
          <el-table-column label="服务费" align="center" prop="serverAmount" />
          <el-table-column label="手续费" align="center" prop="handlingFee" />
          <el-table-column label="实际到账" align="center" prop="realAmount" />
          <el-table-column label="提现状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.applyState === 1">
                完成
              </span>
              <span v-else-if="scope.row.applyState === 2">
                失败
              </span>
               <span v-else>
                处理中
              </span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" align="center" prop="setTime" />
           <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button v-if="scope.row.applyState === 0" size="mini" type="text"
                @click="topUpSub(scope.row)">审核通过</el-button>

              <el-button v-if="scope.row.applyState === 0" size="mini" type="text"
                @click="reject(scope.row)">审核拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </div>
    </div>

    <el-dialog title="驳回申请" :visible.sync="rejectDialogOpen" width="30%" :close-on-click-modal="false"
      @close="closeRejectDialogOpen" append-to-body>
      <el-form ref="rejectData" :model="rejectData" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="驳回原因" prop="rejectInfo">
              <el-input type="textarea" :rows="4" v-model="rejectData.reviewRemark" placeholder="请输入驳回原因" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rejectSub" v-debounce>确 定</el-button>
        <el-button @click="closeRejectDialogOpen">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { walletToWebLogList,walletToWebLogReject,walletToWebLogPass } from "@/api/walletToWeb/walletToWeb";
import { findNetwokList } from "@/api/dic/dic";
export default {
  name: "typesOfPoints",

  data() {
    return {
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      rejectDialogOpen: false,
      topUpDialogOpen: false,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      dialogOpen: false,
      loading: true,
      formData: {},
      rejectData: {},
      topUpData: {},
      userInfo: {},
      upState: false,
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      networkTypeList: [],
       // 表单校验
      rules: {
        rejectInfo: [
          { required: true, message: "请输入驳回原因", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
  },
  created() {
    this.userInfo = this.$store.state.user.userInfo;
    this.getNetworkTypeList();
    this.getList();
  },
  methods: {

    getNetworkTypeList() {
      findNetwokList().then(res => {
        this.networkTypeList = res.data
      })
    },  

    //交易列表
    getList() {
      this.loading = true;
      walletToWebLogList(this.queryParams).then(res => {
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
      //驳回申请
    reject(row) {
      this.rejectData.id = row.id
      this.rejectDialogOpen = true
    },

    closeRejectDialogOpen() {
      this.rejectData = {}
      this.rejectDialogOpen = false
    },

    rejectSub() {
       walletToWebLogReject(this.rejectData.id,this.rejectData.reviewRemark).then(res => {
          if (res.code == 200) {
            this.$modal.msgSuccess("驳回成功");
            this.rejectDialogOpen = false;
            this.getList()
          } else {
            this.$modal.msgError("驳回失败");
            this.rejectDialogOpen = false;
            this.getList()
          }
        })
    },

  
    topUpSub(row){
      this.$modal.confirm('是否确认审核通过？')
        .then(() => {
          return walletToWebLogPass(row.id);
        })
        .then(() => {
          // 提交成功后的处理
          this.getList();
          this.$modal.msgSuccess("提现申请审核通过成功");
        })
        .catch(() => {
        })
    }
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
