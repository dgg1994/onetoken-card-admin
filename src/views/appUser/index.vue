<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="userEmail">
              <el-input v-model="queryParams.userEmail" placeholder="请输入用户邮箱" />
            </el-form-item>
            <el-form-item label="" prop="mobileNumber">
              <el-input v-model="queryParams.mobileNumber" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="" prop="kycState">
              <el-select v-model="queryParams.kycState" filterable placeholder="请选择kyc认证状态" :disabled="upState"
                style="width: 100%">
                <el-option v-for="item in kycStateList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="userState">
              <el-select v-model="queryParams.userState" filterable placeholder="请选择用户状态" :disabled="upState"
                style="width: 100%">
                <el-option v-for="item in userStateList" :key="item.id" :label="item.name" :value="item.id">
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
          <el-table-column label="区号" align="center" prop="mobilePrefix" />
          <el-table-column label="手机号" align="center" prop="mobileNumber" />
          <el-table-column label="邀请码" align="center" prop="invitationCode" />
          <el-table-column label="钱包余额" align="center" prop="walletBalance" />
          <el-table-column label="冻结资产" align="center" prop="freezeBalance" />
          <el-table-column label="kyc认证状态" align="center" prop="kycStateName" />
          <el-table-column label="用户状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.userState === 1"> 正常 </span>
              <span v-else> 注销 </span>
            </template>
          </el-table-column>
          <el-table-column label="注册时间" align="center" prop="setTime" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope" v-if="scope.row.roleId !== 1">
              <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
                <el-button size="mini" type="text">操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="walletTopUp">钱包充值</el-dropdown-item>
                  <el-dropdown-item command="kycInfo">kyc认证信息</el-dropdown-item>
                  <el-dropdown-item command="cardList">持有银行卡</el-dropdown-item>
                  <el-dropdown-item command="applyList">开卡申请记录</el-dropdown-item>
                  <el-dropdown-item command="topupList">银行卡充值记录</el-dropdown-item>
                  <el-dropdown-item command="consumeList">银行卡消费记录</el-dropdown-item>
                  <el-dropdown-item command="walletList">钱包交易记录</el-dropdown-item>
                  <el-dropdown-item command="holderList">持卡人信息</el-dropdown-item>
                  <!-- <el-dropdown-item command="bindChannel">绑定渠道商</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </div>
    </div>

    <el-dialog title="kyc认证信息" :visible.sync="kycDialogOpen" width="50%" :close-on-click-modal="false"
      @close="closeKycInfo" append-to-body>
      <el-form ref="kycData" label-width="100px">
        <el-row>
          <el-col :span="8" v-for="(value, index) in kycData" :key="value.id || index">
            <div style="
                width: 100%;
                height: 180px;
                overflow: hidden;
                cursor: pointer;
              ">
              <img :src="value.documentFileUrl" alt="图片" style="width: 100%; height: 100%; object-fit: contain" />
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog title="持有银行卡" :visible.sync="cardDialogOpen" width="70%" :close-on-click-modal="false"
      @close="closeCardList" append-to-body>
      <el-table :data="cardList" max-height="600" v-loading="loading">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="银行卡" align="center" width="150">
          <template slot-scope="scope">
            <div style="
                width: 90%;
                height: 80px;
                overflow: hidden;
                cursor: pointer;
              ">
              <img :src="scope.row.cardData.img" alt="图片" style="width: 100%; height: 100%; object-fit: contain" />
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
        <el-table-column label="银行卡号" align="center" prop="cardNo" />
        <el-table-column label="银行卡状态" align="center" prop="statusName" />
        <el-table-column label="银行卡余额" align="center" prop="balance" />
        <el-table-column label="申请时间" align="center" prop="setTime" />
      </el-table>
      <pagination v-show="cardTotal > 0" :total="cardTotal" :page.sync="cardQueryParams.pageNumber"
        :limit.sync="cardQueryParams.pageSize" @pagination="getCardList" />
    </el-dialog>

    <el-dialog title="开卡申请记录" :visible.sync="applyListDialogOpen" width="80%" :close-on-click-modal="false"
      @close="closeApplyList" append-to-body>
      <el-table :data="applyList" max-height="600" v-loading="loading">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="银行卡" align="center" width="150">
          <template slot-scope="scope">
            <div style="
                width: 90%;
                height: 80px;
                overflow: hidden;
                cursor: pointer;
              ">
              <img :src="scope.row.cardData.img" alt="图片" style="width: 100%; height: 100%; object-fit: contain" />
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
              {{
                scope.row.applyManData.userName +
                " " +
                scope.row.applyManData.userSurname
              }}
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
        <el-table-column label="证件号" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.applyManData.userNumber }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="开卡费用" align="center" prop="openCardCost" />
        <el-table-column label="预存费用" align="center" prop="preSaveCost" />
        <el-table-column label="总费用" align="center" prop="openCardTotal" />
        <el-table-column label="充值方式" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.topupType === 1"> 钱包 </span>
            <span v-else> 银行卡 </span>
          </template>
        </el-table-column>
        <el-table-column label="kyc申请状态" align="center" prop="kycStateName" />
        <el-table-column label="发货状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.userCardData">
              {{ scope.row.userCardData.shippingStateName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="applyStateName" />
        <el-table-column label="申请时间" align="center" prop="setTime" />
      </el-table>
      <pagination v-show="applyTotal > 0" :total="applyTotal" :page.sync="applyQueryParams.pageNumber"
        :limit.sync="applyQueryParams.pageSize" @pagination="getApplyList" />
    </el-dialog>

    <el-dialog title="银行卡充值记录" :visible.sync="topupDialogOpen" width="70%" :close-on-click-modal="false" append-to-body>
      <el-table :data="topupList" max-height="600" v-loading="loading">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="充值用户" align="center" prop="userEmail" />
        <el-table-column label="订单编号" align="center" prop="requestOrderId" />
        <el-table-column label="充值银行卡" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.cardData.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="银行卡类型" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.cardData.bankCardNature }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="银行卡号" align="center" prop="cardNo" />
        <el-table-column label="充值手续费" align="center" prop="handlingFees" />
        <el-table-column label="充值金额" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.localCurrencyAmt + " " + scope.row.localCurrency }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="充值时间" align="center" prop="setTime" />
      </el-table>
      <pagination v-show="topupTotal > 0" :total="topupTotal" :page.sync="topupQueryParams.pageNumber"
        :limit.sync="topupQueryParams.pageSize" @pagination="getConsumeList" />
    </el-dialog>

    <el-dialog title="银行卡消费记录" :visible.sync="consumeDialogOpen" width="70%" :close-on-click-modal="false"
      @close="closeConsumeList" append-to-body>
      <el-table :data="consumeList" max-height="600" v-loading="loading">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="消费用户" align="center" prop="userEmail" />
        <el-table-column label="订单编号" align="center" prop="requestOrderId" />
        <el-table-column label="消费银行卡" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.cardData.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="银行卡类型" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.cardData.bankCardNature }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="银行卡号" align="center" prop="cardNo" />
        <el-table-column label="消费手续费" align="center" prop="handlingFees" />
        <el-table-column label="消费金额" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.localCurrencyAmt + " " + scope.row.localCurrency }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="消费时间" align="center" prop="setTime" />
      </el-table>
      <pagination v-show="consumeTotal > 0" :total="consumeTotal" :page.sync="consumeQueryParams.pageNumber"
        :limit.sync="consumeQueryParams.pageSize" @pagination="getConsumeList" />
    </el-dialog>

    <el-dialog title="钱包交易记录" :visible.sync="walletDialogOpen" width="70%" :close-on-click-modal="false"
      @close="closeWalletList" append-to-body>
      <el-table :data="walletList" max-height="600" v-loading="loading">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="交易用户" align="center" prop="userEmail" />
        <el-table-column label="订单编号" align="center" prop="orderNo" />
        <el-table-column label="交易内容" align="center" prop="title" />
        <el-table-column label="交易银行卡" align="center" prop="toAccount" />
        <el-table-column label="交易方向" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.tradeType === 1"> 充值 </span>
            <span v-else> 消费 </span>
          </template>
        </el-table-column>
        <el-table-column label="手续费" align="center" prop="serviceCharge" />
        <el-table-column label="交易金额" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.tradeType === 1">
              {{
                "+" + scope.row.realMoney + " " + scope.row.primevalMoneyUnit
              }}
            </span>
            <span v-else>
              {{
                "-" + scope.row.realMoney + " " + scope.row.primevalMoneyUnit
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '1'"> 交易处理中 </span>
            <span v-if="scope.row.status === '2'"> 交易成功 </span>
            <span v-if="scope.row.status === '3'"> 交易失败 </span>
          </template>
        </el-table-column>
        <el-table-column label="交易时间" align="center" prop="setTime" />
      </el-table>
      <pagination v-show="walletTotal > 0" :total="walletTotal" :page.sync="walletQueryParams.pageNumber"
        :limit.sync="walletQueryParams.pageSize" @pagination="getwalletList" />
    </el-dialog>

    <el-dialog title="持卡人信息" :visible.sync="holderDialogOpen" width="70%" :close-on-click-modal="false"
      @close="closeHoldertList" append-to-body>
      <el-table :data="holderList" max-height="600" v-loading="loading">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="英文名" align="center" prop="userName" />
        <el-table-column label="英文姓" align="center" prop="userSurname" />
        <el-table-column label="国家代码" align="center" prop="userTelCode" />
        <el-table-column label="手机号代码" align="center" prop="userTelDialCode" />
        <el-table-column label="手机号" align="center" prop="userTel" />
        <el-table-column label="邮箱" align="center" prop="userEmail" />
        <el-table-column label="证件号" align="center" prop="userNumber" />
        <el-table-column label="性别" align="center" prop="userSex" />
        <el-table-column label="生日" align="center" prop="userBirthday" />
        <el-table-column label="地址" align="center" prop="userAddress" />
        <el-table-column label="创建时间" align="center" prop="setTime" />
      </el-table>
      <!-- <pagination v-show="holderTotal > 0" :total="holderTotal" :page.sync="holderQueryParams.pageNumber"
          :limit.sync="holderQueryParams.pageSize" @pagination="getHolderList" /> -->
    </el-dialog>

    <el-dialog title="钱包充值" :visible.sync="walletTopUpdialogOpen" width="30%" :close-on-click-modal="false"
      @close="walletTopUpdialogClose" append-to-body>
      <el-form ref="walletTopUpformData" :model="walletTopUpformData" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="充值金额" prop="topupAmount">
              <el-input type="number" v-model="walletTopUpformData.topupAmount" placeholder="请输入充值金额" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="walletTopUpSubmit" v-debounce>确 定</el-button>
        <el-button @click="walletTopUpdialogClose">取 消</el-button>
      </div>
    </el-dialog>

   
  </div>
</template>

<script>
import { findKycState, findUserState } from "@/api/dic/dic";
import {
  appUserList,
  upWalletState,
  findKycFile,
  findHolderByUid,
} from "@/api/appUser/appUser";
import { findUserCardList, findTransaction } from "@/api/userCard/userCard";
import { openCardApplyList } from "@/api/applyCard/applyCard";
import { findWalletLogn, walletTopUp } from "@/api/wallet/wallet";
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
      kycDialogOpen: false,
      cardDialogOpen: false,
      applyListDialogOpen: false,
      topupDialogOpen: false,
      consumeDialogOpen: false,
      walletDialogOpen: false,
      holderDialogOpen: false,
      loading: true,
      formData: {},
      upState: false,
      kycStateList: [],
      userStateList: [],
      kycData: [],
      cardList: [],
      cardTotal: 0,
      uid: null,
      bindRef: null,
      channelList: {},
      cardQueryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      applyList: [],
      applyTotal: 0,
      applyQueryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      topupList: [],
      topupTotal: 0,
      topupQueryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      consumeList: [],
      consumeTotal: 0,
      consumeQueryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      walletList: [],
      walletTotal: 0,
      walletQueryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      holderList: [],
      holderTotal: 0,
      holderQueryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      walletTopUpdialogOpen: false,
      walletTopUpformData: {},
      userInfo: {},
      walletStateList: [
        {
          id: true,
          name: "开启",
        },
        {
          id: false,
          name: "关闭",
        },
      ],
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      rules: {
        topupAmount: [
          { required: true, message: "请输入充值金额", trigger: "blur" },
        ],
        inviterUser: [
          { required: true, message: "请选择渠道商", trigger: "change" },
        ],
      },
    };
  },
  watch: {},
  created() {
    this.userInfo = this.$store.state.user.userInfo;
    this.getUserStateList();
    this.getKycStateList();
    this.getList();

  },
  methods: {
    //kyc认证状态
    getKycStateList() {
      findKycState().then((res) => {
        this.kycStateList = res.data;
      });
    },

    //用户状态
    getUserStateList() {
      findUserState().then((res) => {
        this.userStateList = res.data;
      });
    },

    getList() {
      this.loading = true;
      appUserList(this.queryParams).then((res) => {
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
      this.queryParams = {};
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNumber = 1;
      this.getList();
    },

    //钱包入口开启关闭
    walletEntrance(id, state) {
      // 弹出确认框
      this.$modal
        .confirm("是否确认修改钱包入口状态？")
        .then(() => {
          return upWalletState(id, state);
        })
        .then(() => {
          // 提交成功后的处理
          this.getList();
          this.$modal.msgSuccess("操作成功过");
        })
        .catch(() => { });
    },

    //kyc认证信息
    openKycInfo(id) {
      this.kycData = [];
      findKycFile(id).then((res) => {
        this.kycData = res.data;
      });
      this.kycDialogOpen = true;
    },
    closeKycInfo() {
      this.kycData = [];
      this.kycDialogOpen = false;
    },

    //持有银行卡
    openCardList(uid) {
      this.uid = uid;
      this.getCardList();
      this.cardDialogOpen = true;
    },
    getCardList() {
      this.cardQueryParams.uid = this.uid;
      findUserCardList(this.cardQueryParams).then((res) => {
        this.cardList = res.data.list;
        this.cardTotal = res.data.total;
      });
    },
    closeCardList() {
      this.cardList = [];
      this.cardDialogOpen = false;
    },
    openApplyList(uid) {
      this.uid = uid;
      this.getApplyList();
      this.applyListDialogOpen = true;
    },
    getApplyList() {
      this.applyQueryParams.uid = this.uid;
      openCardApplyList(this.applyQueryParams).then((res) => {
        this.applyList = res.data.list;
        this.applyTotal = res.data.total;
      });
    },
    closeApplyList() {
      this.applyList = [];
      this.applyListDialogOpen = false;
    },
    //卡充值记录
    openTopupList(uid) {
      this.uid = uid;
      this.getTopupList();
      this.topupDialogOpen = true;
    },
    getTopupList() {
      this.topupQueryParams.transType = "topup";
      this.topupQueryParams.uid = this.uid;
      findTransaction(this.topupQueryParams).then((res) => {
        this.topupList = res.data.list;
        this.topupTotal = res.data.total;
      });
    },
    closeTopupList() {
      this.topupList = [];
      this.topupDialogOpen = false;
    },
    //卡消费记录
    openConsumeList(uid) {
      this.uid = uid;
      this.getConsumeList();
      this.consumeDialogOpen = true;
    },
    getConsumeList() {
      this.topupQueryParams.transType = "AUTH";
      this.topupQueryParams.uid = this.uid;
      findTransaction(this.topupQueryParams).then((res) => {
        this.consumeList = res.data.list;
        this.consumeTotal = res.data.total;
      });
    },
    closeConsumeList() {
      this.consumeList = [];
      this.consumeDialogOpen = false;
    },
    //钱包交易记录
    openWalletList(uid) {
      this.uid = uid;
      this.getwalletList();
      this.walletDialogOpen = true;
    },
    getwalletList() {
      this.walletQueryParams.uid = this.uid;
      findWalletLogn(this.walletQueryParams).then((res) => {
        this.walletList = res.data.list;
        this.walletTotal = res.data.total;
      });
    },
    closeWalletList() {
      this.walletList = [];
      this.walletDialogOpen = false;
    },
    //用户持卡人信息
    openHolderList(uid) {
      this.uid = uid;
      this.getHolderList();
      this.holderDialogOpen = true;
    },
    getHolderList() {
      findHolderByUid(this.uid).then((res) => {
        this.holderList = res.data;
      });
    },
    closeHoldertList() {
      this.holderList = [];
      this.holderDialogOpen = false;
    },

    openWalletTopUp(uid) {
      this.walletTopUpformData = {};
      this.walletTopUpformData.uid = uid;
      this.walletTopUpdialogOpen = true;
    },

    walletTopUpdialogClose() {
      this.walletTopUpformData = {};
      this.walletTopUpdialogOpen = false;
    },

    walletTopUpSubmit() {
      this.$refs["walletTopUpformData"].validate((valid) => {
        if (valid) {
          this.walletTopUpformData.operateUserId = this.userInfo.id;
          this.walletTopUpformData.operateUserName = this.userInfo.username;
          console.log(this.walletTopUpformData);
          walletTopUp(this.walletTopUpformData).then((res) => {
            if (res.code == 200) {
              this.$modal.msgSuccess("充值成功");
              this.walletTopUpdialogOpen = false;
              this.getList();
            } else {
              this.$modal.msgError("充值失败");
              this.dialogOpen = false;
              this.getList();
            }
          });
        }
      });
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "closeWallet":
          this.walletEntrance(row.id, false); //关闭钱包入口
          break;
        case "openWallet":
          this.walletEntrance(row.id, true); //开启钱包入口
          break;
        case "kycInfo":
          this.openKycInfo(row.uid); //kyc认证信息
          break;
        case "cardList":
          this.openCardList(row.uid); //持有银行卡
          break;
        case "applyList":
          this.openApplyList(row.uid); //开卡申请记录
          break;
        case "topupList":
          this.openTopupList(row.uid); //卡充值记录
          break;
        case "consumeList":
          this.openConsumeList(row.uid); //卡消费记录
          break;
        case "walletList":
          this.openWalletList(row.uid); //卡消费记录
          break;
        case "holderList":
          this.openHolderList(row.uid); //钱包交易记录
          break;
        case "walletTopUp":
          this.openWalletTopUp(row.uid); //钱包充值
          break;
        case "bindChannel":
          this.openBind(row);
          break;
        default:
          break;
      }
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
