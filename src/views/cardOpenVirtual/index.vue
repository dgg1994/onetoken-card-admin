<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="applyState">
              <el-select v-model="queryParams.applyState" filterable placeholder="请选择状态" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in applyStateList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="" prop="topupType">
              <el-select v-model="queryParams.topupType" filterable placeholder="请选择充值方式" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in payTypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="kycState">
              <el-select v-model="queryParams.kycState" filterable placeholder="请选择kyc认证状态" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in kycStateList" :key="item.id" :label="item.name" :value="item.id">
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
          <el-table-column label="银行卡" align="center" width="150">
            <template slot-scope="scope">
              <div style="width: 90%; height: 80px; overflow: hidden; cursor: pointer;">
                <img :src="scope.row.cardData.img" alt="图片" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="银行卡" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.cardData.title }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="卡类型" align="center" prop="cardType" />
          <el-table-column label="申请人" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.applyManData.userName + " " + scope.row.applyManData.userSurname }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="电话" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.applyManData.userTel }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.applyManData.userEmail }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="月费" align="center" prop="monthFee" />
          <el-table-column label="开卡费用" align="center" prop="openCardCost" />
          <el-table-column label="预存费用" align="center" prop="preSaveCost" />
          <el-table-column label="总费用" align="center" prop="openCardTotal" />
          <el-table-column label="充值方式" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.topupType === 1">
                钱包
              </span>
              <span v-else>
                银行卡
              </span>
            </template>
          </el-table-column>
          <el-table-column label="kyc认证状态" align="center" prop="kycStateName" />
          <el-table-column label="状态" align="center" prop="applyStateName" />
          <el-table-column label="提交时间" align="center" prop="setTime" />
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleInfo(scope.row)">详情</el-button>
              <el-button v-if="scope.row.kycState === 1 && scope.row.applyState === 1" size="mini" type="text"
                @click="kycApply(scope.row.id)">kyc认证</el-button>

              <el-button v-if="scope.row.applyState === 1 && scope.row.kycState === 3" size="mini" type="text"
                @click="activation(scope.row)">开卡激活</el-button>

              <el-button v-if="scope.row.applyState === 1" size="mini" type="text"
                @click="reject(scope.row, 1)">驳回申请</el-button>
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
              <el-input type="textarea" :rows="4" v-model="rejectData.rejectInfo" placeholder="请输入驳回原因" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rejectSub" v-debounce>确 定</el-button>
        <el-button @click="closeRejectDialogOpen">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogOpen" width="80%" :close-on-click-modal="false" @close="handleClose"
      append-to-body>
      <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
        <el-divider>持卡人信息</el-divider>
        <el-row>
          <el-col :span="6">
            <el-form-item label="英文名" prop="userName">
              <el-input v-model="applyManData.userName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="英文姓" prop="userSurname">
              <el-input v-model="applyManData.userSurname" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号编码" prop="userTelDialCode">
              <el-input v-model="applyManData.userTelDialCode" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号" prop="userTel">
              <el-input v-model="applyManData.userTel" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="地区编码" prop="userTelCode">
              <el-input v-model="applyManData.userTelCode" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="邮箱" prop="userEmail">
              <el-input v-model="applyManData.userEmail" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出生日期" prop="userBirthday">
              <el-input v-model="applyManData.userBirthday" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" prop="userSex">
              <el-input v-model="applyManData.userSex" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="住址" prop="userAddress">
              <el-input v-model="applyManData.userAddress" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider>申请银行卡信息</el-divider>
        <el-row>
          <el-col :span="6">
            <el-form-item label="银行卡名称" prop="title">
              <el-input v-model="cardData.title" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡片性质" prop="bankCardNature">
              <el-input v-model="cardData.bankCardNature" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="银行卡来源" prop="bankCardSource">
              <el-input v-model="cardData.bankCardSource" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡片类型" prop="bankCardType">
              <el-input v-model="cardData.bankCardType" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="卡币种" prop="ccy">
              <el-input v-model="cardData.ccy" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="充值手续费率" prop="rechargeFee">
              <el-input v-model="cardData.rechargeFee" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退款手续费" prop="refundFee">
              <el-input v-model="cardData.refundFee" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="首充最低金额" prop="activeMinLimit">
              <el-input v-model="cardData.activeMinLimit" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="充值最低金额" prop="rechargeMinLimit">
              <el-input v-model="cardData.rechargeMinLimit" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="充值最高金额" prop="rechargeMaxLimit">
              <el-input v-model="cardData.rechargeMaxLimit" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡号段" prop="cardBin">
              <el-input v-model="cardData.cardBin" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="激活状态" prop="applyStateName">
              <el-input v-model="formData.applyStateName" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="月费" prop="monthFee">
              <el-input v-model="cardData.monthFee" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开卡费用" prop="openCardCost">
              <el-input v-model="formData.openCardCost" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预存费用" prop="preSaveCost">
              <el-input v-model="formData.preSaveCost" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开卡总费用" prop="openCardTotal">
              <el-input v-model="formData.openCardTotal" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider v-if="applySendData">邮寄地址</el-divider>
        <el-row v-if="applySendData">
          <el-col :span="6">
            <el-form-item label="国家" prop="nation">
              <el-input v-model="applySendData.nation" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="省" prop="province">
              <el-input v-model="applySendData.province" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="市" prop="city">
              <el-input v-model="applySendData.city" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="邮编" prop="postCode">
              <el-input v-model="applySendData.postCode" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="applySendData">
          <el-col :span="12">
            <el-form-item label="收件人" prop="collectMan">
              <el-input v-model="applySendData.collectMan" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件人电话" prop="collectTel">
              <el-input v-model="applySendData.collectTel" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="applySendData">
          <el-col :span="24">
            <el-form-item label="详细地址" prop="addressInfo">
              <el-input type="textarea" :rows="3" v-model="applySendData.addressInfo" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider v-if="kycData">kyc认证信息</el-divider>
        <el-row v-if="kycData">
          <el-col :span="8">
            <el-form-item label="证件类型" prop="paperworkType">
              <el-input v-model="kycData.paperworkType" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码" prop="paperworkNum">
              <el-input v-model="kycData.paperworkNum" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="认证状态" prop="kycStateName">
              <el-input v-model="formData.kycStateName" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="kycData">
          <el-col :span="8">
            <div style="width: 100%; height: 180px; overflow: hidden; cursor: pointer;">
              <img :src="kycData.frontPhotoUrl" alt="图片" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
          </el-col>
          <el-col :span="8">
            <div style="width: 100%; height: 180px; overflow: hidden; cursor: pointer;">
              <img :src="kycData.backPhotoUrl" alt="图片" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
          </el-col>
          <el-col :span="8">
            <div style="width: 100%; height: 180px; overflow: hidden; cursor: pointer;">
              <img :src="kycData.handheldPhotoUrl" alt="图片" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">


        <el-button v-if="formData.kycState === 1 && formData.applyState === 1" @click="kycApply(formData.id)">kyc认证</el-button>

        <el-button v-if="formData.applyState === 1 && formData.kycState === 2" @click="activation(formData)">开卡激活</el-button>

        <el-button v-if="formData.cardType==='PHYSICAL' && userCardData.shippingState === 1" @click="openShipping(formData.id)"
          type="primary">发货
        </el-button>

        <el-button v-if="formData.applyState === 1"@click="reject(formData, 1)">驳回申请</el-button>

        <el-button @click="cancel">关闭</el-button>

      </div>
    </el-dialog>


  </div>
</template>

<script>
import { findCardState, findPayType, findKycState } from "@/api/dic/dic";
import { openCardApplyList, openCard, cardApplyReject, cardApplyOpenCardV2, kycApply } from "@/api/applyCard/applyCard";

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
      rejectDialogOpen: false,
      loading: true,
      formData: {},
      applyManData: {},
      cardData: {},
      applySendData: {},
      kycData: {},
      userCardData: {},
      rejectData: {},
      upState: false,
      kycStateList: [],
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      applyStateList: [],
      payTypeList: [],
      userInfo: null,
      cardTypeList: [
        { id: "VIRTUAL", name: "虚拟卡" },
        { id: "PHYSICAL", name: "实体卡" }
      ],
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
    this.getApplyStateList();
    this.getKycStateList()
    this.getFindPayType()
    this.getList();
  },
  methods: {

    //银行卡状态
    getApplyStateList() {
      findCardState().then(res => {
        this.applyStateList = res.data
      })
    },

    //支付方式
    getFindPayType() {
      findPayType().then(res => {
        this.payTypeList = res.data
      })
    },

      //kyc认证状态
    getKycStateList() {
      findKycState().then(res => {
        this.kycStateList = res.data
      })
    },
    //申请记录列表
    getList() {
      this.loading = true;
      this.queryParams.cardType = "VIRTUAL"
      openCardApplyList(this.queryParams).then(res => {
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

    /** 开卡激活 */
    activation(row) {
      // 显示 loading 提示
      window.loadingInstance = this.$loading({
        lock: true,
        text: '开卡申请中，请稍后.....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      // 弹出确认框
      this.$modal.confirm('是否确认开卡激活？')
        .then(() => {
          // 调用开卡激活 API
          return openCard(row.id);
        })
        .then(() => {
          // 开卡激活成功后的处理
          this.getList();
          this.$modal.msgSuccess("开卡申请已提交，银行卡激活中，请稍后刷新查看");
        })
        .catch(() => {
          // 开卡激活失败或取消操作时的处理
          this.$modal.msgError("操作已取消或失败");
        })
        .finally(() => {
          // 无论成功还是失败，都关闭 loading 提示
          if (window.loadingInstance) {
            window.loadingInstance.close();
            window.loadingInstance = null;
          }
        });
    },

    //驳回申请
    reject(row, type) {
      this.rejectData.id = row.id
      this.rejectData.type = type
      this.rejectDialogOpen = true
    },

    closeRejectDialogOpen() {
      this.rejectData = {}
      this.rejectDialogOpen = false
    },

    rejectSub() {
      this.rejectData.rejectUser = this.userInfo.id
      this.rejectData.rejectUserName = this.userInfo.username
       cardApplyReject(this.rejectData).then(res => {
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

    handleInfo(row) {
      this.reset();
      this.formData = row;
      this.applyManData = row.applyManData
      this.cardData = row.cardData
      this.applySendData = row.applySendData
      this.kycData = row.kycData
      this.userCardData = row.userCardData
      this.upState = true;
      this.dialogOpen = true;
      this.title = "详情";
    },

    //kyc认证提交
    kycApply(id) {
      console.log("kyc认证申请的id:", id);  
      // 打开 loading
      window.loadingInstance = this.$loading({
        lock: true,
        text: 'kyc认证申请中，请稍后.....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      // 弹出确认框
      this.$modal.confirm('是否确认提交kyc认证申请？')
        .then(() => {
          // 提交 kyc 认证申请
          return kycApply(id);
        })
        .then(() => {
          // 提交成功后的处理
          this.getList();
          this.$modal.msgSuccess("kyc认证申请已提交，认证处理中，请稍后刷新查看");
        })
        .catch(() => {
        })
        .finally(() => {
          // 关闭 loading，不管成功与否都执行
          if (window.loadingInstance) {
            window.loadingInstance.close();
            window.loadingInstance = null;
          }
        });
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
