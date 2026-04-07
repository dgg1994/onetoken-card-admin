<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <el-form :model="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item label="" prop="status">
              <el-select v-model="queryParams.status" filterable placeholder="请选择银行卡激活状态" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="cardType">
              <el-select v-model="queryParams.cardType" filterable placeholder="请选择银行卡类型" :disabled="upState"
                style="width: 100%;">
                <el-option v-for="item in cardTypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="cardNo">
              <el-input v-model="queryParams.cardNo" placeholder="请输入银行卡号" clearable style="width: 240px"
                @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item label="" prop="userEmail">
              <el-input v-model="queryParams.userEmail" placeholder="请输入用户邮箱" clearable style="width: 240px"
                @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item label="" prop="userTel">
              <el-input v-model="queryParams.userTel" placeholder="请输入用户手机号" clearable style="width: 240px"
                @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item label="" prop="userName">
              <el-input v-model="queryParams.userName" placeholder="请输入用户英文名" clearable style="width: 240px"
                @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
           
          </el-form>
           <!-- <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            </el-col>
          </el-row> -->
          
        </div>
        <el-table :data="dataList" max-height="600" v-loading="loading">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="持卡人" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.manData.userName+scope.row.manData.userSurname }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" align="center" prop="manData.userEmail" />
          <el-table-column label="手机号" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.manData.userTelDialCode+scope.row.manData.userTel }}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="性别" align="center" prop="manData.userSex" />
          <el-table-column label="生日" align="center" prop="manData.userBirthday" /> -->
          <el-table-column label="银行卡号" align="center" prop="cardNo" />
          <el-table-column label="银行卡类型" align="center" prop="cardType" />
          <el-table-column label="银行卡余额" align="center" prop="balance" />
          <el-table-column label="银行卡状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'ACTIVE'">
                已激活
              </span>
              <span v-else-if="scope.row.status == 'CLOSE_PROCESSING'">
                注销审核中
              </span>
              <span v-else-if="scope.row.status == 'CLOSE'">
                注销成功
              </span>
              <span v-else>
                未激活
              </span>
            </template>
          </el-table-column>
          <el-table-column label="实体发货状态" align="center" prop="shippingStateName" />
          <el-table-column label="物流单号" align="center" prop="logisticsNum" />

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope" v-if="scope.row.status == 'ACTIVE'">
              <el-button size="mini" type="text"  @click="topuUp(scope.row)">充值</el-button>
              <el-button size="mini" type="text"  @click="topupListOpen(scope.row)">充值记录</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize" @pagination="getList" />


        <el-dialog :title="title" :visible.sync="dialogOpen" width="30%" :close-on-click-modal="false" @close="handleClose" append-to-body>
          <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="充值卡号" prop="cardNumber">
                  <el-input type="number"  v-model="cardNumber" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="充值方式" prop="payType">
                  <el-select v-model="formData.payType" filterable placeholder="请选择充值方式" :disabled="upState"
                    style="width: 100%;">
                    <el-option v-for="item in payTypeList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="充值金额" prop="amount">
                  <el-input type="number" @input="handleAmountChange" v-model="formData.amount" placeholder="请输入充值金额" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="手续费" prop="handlingFees" >
                  <el-input type="number"  v-model="formData.handlingFees" disabled/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm" v-debounce>确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>


        <el-dialog title="充值记录" :visible.sync="topupDialogOpen" width="70%" :close-on-click-modal="false" append-to-body>
           <el-table :data="topupList" max-height="600" v-loading="loading">
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column label="充值用户" align="center" prop="userEmail" />
            <el-table-column label="订单编号" align="center" prop="requestOrderId" />
            <el-table-column label="充值银行卡" align="center">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.cardData.title}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="银行卡类型" align="center">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.cardData.bankCardNature}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="银行卡号" align="center" prop="cardNo" />
            <el-table-column label="充值手续费" align="center" prop="handlingFees" />
            <el-table-column label="充值金额" align="center">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.localCurrencyAmt+" "+ scope.row.localCurrency}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="充值时间" align="center" prop="setTime" />
            <el-table-column label="操作人" align="center" prop="setUserName" />
          </el-table>
          <pagination v-show="topupTotal > 0" :total="total" :page.sync="topupQueryParams.pageNumber"
            :limit.sync="topupQueryParams.pageSize" @pagination="getList" />
        </el-dialog>


      </div>
    </div>
  </div>
</template>

<script>
import { pcFindUserCardList,findTransaction} from "@/api/userCard/userCard";
import { cardTopUp} from "@/api/applyCard/applyCard";

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
      logoURL:[],
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
      },
      statusList: [
        {
          "id":"ACTIVE",
          "name":"已激活"
        },
        {
          "id":"TBA",
          "name":"未激活"
        },
        {
          "id":"CLOSE_PROCESSING",
          "name":"注销审核中"
        },
        {
          "id":"CLOSE",
          "name":"注销成功"
        }
      ],
       cardTypeList:[
        {
          "id":"PHYSICAL",
          "name":"实体卡"
        },
         {
          "id":"VIRTUAL",
          "name":"虚拟卡"
        }
      ],
      payTypeList:[
        {
          "id":1,
          "name":"钱包充值"
        },
         {
          "id":2,
          "name":"银行卡充值"
        }
      ],
      cardNumber:null,
      cardData:null,
      userCard:null,
      topupDialogOpen:false,
      topupList:[],
      topupTotal:0,
      topupQueryParams:{
        pageNumber: 1,
        pageSize: 10,
      },
      userInfo:null,
      // 表单校验
      rules: {
        payType: [
          { required: true, message: "请选择充值方式", trigger: "blur" },
        ],
        amount: [
          { required: true, message: "请输入充值金额", trigger: "blur" },
        ],
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
    getList() {
      this.loading = true;
      console.log(this.q)
      pcFindUserCardList(this.queryParams).then(res => {
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

    handleClose(){
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
    /** 充值按钮操作 */
    topuUp(row) {
      this.reset();
      this.cardNumber = row.cardNo
      this.cardData = row.cardData
      this.userCard = row
      this.dialogOpen = true;
      this.title = "充值";
    },

    handleAmountChange(value){
      this.formData.handlingFees = value * this.cardData.rechargeFee
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.formData.uid = this.userCard.uid
          this.formData.userBankcardId = this.userCard.userBankcardId
          this.formData.targetAmount = this.formData.amount
          this.formData.setUser = this.userInfo.id
          this.formData.setUserName = this.userInfo.username
          this.formData.type = false
          cardTopUp(this.formData).then(res => {
            if(res.code == 200){
              this.$modal.msgSuccess(res.msg);
              this.dialogOpen = false;
              this.getList()
            }else{
              this.$modal.msgError(res.msg);
              this.dialogOpen = false;
              this.getList()
            }
          })
        }
      });
    },
    topupListOpen(row){
      this.topupQueryParams.transType = "topup"
      this.topupQueryParams.cardNo = row.cardNo
      findTransaction(this.topupQueryParams).then(res => {
        this.topupList = res.data.list
        this.topupTotal = res.data.total
        this.topupDialogOpen = true
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
