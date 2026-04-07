<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <div class="box-card" v-if="hasChannel">
            <div>我的邀请码:</div>
            <div>{{ channelData.invitationCode }}</div>
          </div>
          <el-form
            :model="queryParams"
            size="small"
            :inline="true"
            label-width="68px"
          >
            <!-- <el-form-item label="" prop="cardNo">
              <el-input v-model="queryParams.cardNo" placeholder="请输入银行卡号"/>
            </el-form-item>
            <el-form-item label="" prop="requestOrderId">
              <el-input v-model="queryParams.requestOrderId" placeholder="请输入订单编号"/>
            </el-form-item>
            <el-form-item label="" prop="userEmail">
              <el-input v-model="queryParams.userEmail" placeholder="请输入用户邮箱"/>
            </el-form-item> -->

            <el-form-item>
              <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button> -->
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >刷新</el-button
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
          <!-- <el-table-column label="被邀请人" align="center" prop="email" /> -->
          <el-table-column
            label="被邀请人UID"
            align="center"
            prop="coverInviterUserUid"
          />

          <!-- <el-table-column
            label="邀请人 ID"
            align="center"
            prop="inviterUser"
          /> -->
          <el-table-column
            label="邀请人 UID"
            align="center"
            prop="inviterUserUid"
          />

          <el-table-column label="时间" align="center" prop="setTime" />
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
import { appUserIntiterFindAll, findInviteCode } from "@/api/channel/index";
import { mapState } from "vuex";
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
      channelData: {},
    };
  },
  watch: {},
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    hasChannel() {
      const { roles } = this.userInfo;
      return roles.includes("channel");
    },
  },
  created() {
    this.getList();
    this.getCode();
  },
  methods: {
    getCode() {
      if (!this.hasChannel) return;
      findInviteCode(this.userInfo.id).then((res) => {
        this.channelData = res.data;
      });
    },
    //交易列表
    getList() {
      const { roles } = this.userInfo;
      if (roles.includes("channel")) {
        this.queryParams = {
          ...this.queryParams,
          inviterUserUid: this.userInfo.id,
          intiterUserType: "2",
        };
      }
      this.loading = true;

      console.log("请求参数this.queryParams", this.queryParams);
      appUserIntiterFindAll(this.queryParams).then((res) => {
        console.log("获取到数据res.data.list", res.data.list);
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
      // this.queryParams = {};
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
.box-card {
  display: flex;
  align-items: center;
  gap: 10px;
  /* margin-bottom: 50px; */
}
</style>
