<template>
  <div class="home">
    <div class="flex_sb">
      <el-form :model="queryParams" size="small" :inline="true" label-width="0">
        <el-form-item prop="dateRange">
          <el-date-picker
            :clearable="false"
            v-model="timeData"
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
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >刷新</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="data-container" v-loading="loading">
      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-wallet" style="color: #409eff"></i>
        </div>
        <div class="card-title">
          {{ statTotal.merchantAvailableAmount || 0 }}
        </div>
        <div class="card-subtitle">商户可用余额</div>
      </el-card>

      <el-card class="center-card" shadow="hover" v-if="!hasChannel">
        <div class="card-icon">
          <i class="el-icon-lock" style="color: #67c23a"></i>
        </div>
        <div class="card-title">{{ statTotal.merchantFrozenAmount || 0 }}</div>
        <div class="card-subtitle">商户冻结余额</div>
      </el-card>

      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-coin" style="color: #e6a23c"></i>
        </div>
        <div class="card-title">{{ statTotal.walletTotal || 0 }}</div>
        <div class="card-subtitle">钱包总额</div>
      </el-card>

      <el-card class="center-card" shadow="hover" v-if="!hasChannel">
        <div class="card-icon">
          <i class="el-icon-ice-cream-round" style="color: #f56c6c"></i>
        </div>
        <div class="card-title">{{ statTotal.walletFreezeTotal || 0 }}</div>
        <div class="card-subtitle">钱包冻结总额</div>
      </el-card>

      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-files" style="color: #804389"></i>
        </div>
        <div class="card-title">{{ statTotal.cardTotal || 0 }}</div>
        <div class="card-subtitle">银行卡总额</div>
      </el-card>

      <!-- 第二行卡片 - 展示adminStat数据 -->

      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-user" style="color: #409eff"></i>
        </div>
        <div class="card-title">{{ adminStat.registerUserNum || 0 }}</div>
        <div class="card-subtitle">注册用户量</div>
      </el-card>

      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-plus" style="color: #67c23a"></i>
        </div>
        <div class="card-title">{{ adminStat.topupUserNum || 0 }}</div>
        <div class="card-subtitle">钱包充值人数</div>
      </el-card>

      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-user-solid" style="color: #e6a23c"></i>
        </div>
        <div class="card-title">{{ adminStat.openCardUserNum || 0 }}</div>
        <div class="card-subtitle">开卡人数</div>
      </el-card>

      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-money" style="color: #f56c6c"></i>
        </div>
        <div class="card-title">{{ adminStat.openCardFee || 0 }}</div>
        <div class="card-subtitle">开卡总费用</div>
      </el-card>

      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-position" style="color: #804389"></i>
        </div>
        <div class="card-title">{{ adminStat.cardTopupTotal || 0 }}</div>
        <div class="card-subtitle">银行卡充值总额</div>
      </el-card>

      <!-- 第三行卡片 - 继续展示adminStat数据 -->

      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-tickets" style="color: #409eff"></i>
        </div>
        <div class="card-title">{{ adminStat.cardTopupFee || 0 }}</div>
        <div class="card-subtitle">银行卡充值手续费总额</div>
      </el-card>

      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-magic-stick" style="color: #67c23a"></i>
        </div>
        <div class="card-title">{{ adminStat.cardConsumeTotal || 0 }}</div>
        <div class="card-subtitle">银行卡消费总额</div>
      </el-card>

      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-goods" style="color: #e6a23c"></i>
        </div>
        <div class="card-title">{{ adminStat.cardConsumeFee || 0 }}</div>
        <div class="card-subtitle">银行卡消费手续费总额</div>
      </el-card>

      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-c-scale-to-original" style="color: #f56c6c"></i>
        </div>
        <div class="card-title">{{ adminStat.openCardViNum || 0 }}</div>
        <div class="card-subtitle">虚拟卡申请数量</div>
      </el-card>

      <el-card class="center-card" shadow="hover">
        <div class="card-icon">
          <i class="el-icon-bank-card" style="color: #804389"></i>
        </div>
        <div class="card-title">{{ adminStat.openCardPhNum || 0 }}</div>
        <div class="card-subtitle">实体卡申请数量</div>
      </el-card>

      <!-- 第四行卡片 - 继续展示adminStat数据 -->

      <el-card class="center-card" shadow="hover" v-if="hasChannel">
        <div class="card-icon">
          <i class="el-icon-guide" style="color: #409eff"></i>
        </div>
        <div class="card-title">{{ adminStat.borkerageFee || 0 }}</div>
        <div class="card-subtitle">用户返利总金额</div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { statTotal, adminStat } from "@/api/stat/stat";
import { mapState } from "vuex";

export default {
  name: "Index",
  components: {},
  data() {
    return {
      loading: true,
      queryParams: {},
      timeData: [],
      statTotal: {},
      adminStat: {},
    };
  },

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
    this.timeData = [this.formatUTCYYYYMMDD(), this.formatUTCYYYYMMDD()];
    this.getStatTotal();
    this.handleQuery();
  },
  methods: {
    formatUTCYYYYMMDD(ts = Date.now()) {
      const d = new Date(ts);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    },
    getStatTotal() {
      statTotal().then((res) => {
        console.log(res);
        this.statTotal = res.data;
      });
    },
    handleQuery() {
      this.loading = true;
      let params = {
        begTime: this.timeData[0],
        endTime: this.timeData[1],
      };
      adminStat(params).then((res) => {
        this.adminStat = res.data;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },

    resetQuery() {
      this.timeData = [this.formatUTCYYYYMMDD(), this.formatUTCYYYYMMDD()];
      this.getStatTotal();
      this.handleQuery();
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  height: 100%;
}

.flex_sb {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.el-form {
  width: 100%;
}

.el-form-item {
  margin-right: 20px;
}

.el-date-editor {
  width: 300px;
}

.data-container {
  padding: 0 20px 20px 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.center-card {
  position: relative;
  transition: all 0.3s ease;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.center-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
  border-color: #409eff;
}

.center-card .el-card__body {
  padding: 20px 15px;
  text-align: center;
  position: relative;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-icon {
  font-size: 32px;
  margin-bottom: 10px;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.card-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.card-subtitle {
  font-size: 14px;
  color: #909399;
  line-height: 1.2;
  font-weight: 400;
}

/* 为不同类型的卡片添加不同的顶部装饰条 */
.center-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
}
// .center-card:nth-child(odd)::before {
//   content: "";
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   height: 3px;
//   background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
// }

// .center-card:nth-child(even)::before {
//   content: "";
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   height: 3px;
//   background: linear-gradient(90deg, #e6a23c 0%, #f56c6c 100%);
// }

/* 元素入场动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-icon,
.card-title,
.card-subtitle {
  animation: fadeInUp 0.6s ease-out;
}

.card-icon {
  animation-delay: 0.1s;
}

.card-title {
  animation-delay: 0.2s;
}

.card-subtitle {
  animation-delay: 0.3s;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .el-col {
    flex: 1 0 48%;
  }

  .el-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .el-date-editor {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .flex_sb {
    flex-direction: column;
    align-items: stretch;
    padding: 15px;
  }

  .el-form-item {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .el-form-item:last-child {
    margin-bottom: 0;
    display: flex;
    justify-content: space-between;
  }

  .el-date-editor {
    width: 100%;
  }

  .el-col {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .card-title {
    font-size: 20px;
  }
}

/* 加载状态样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
</style>
