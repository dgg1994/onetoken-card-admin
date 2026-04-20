<template>
  <div class="mainBox">
    <div class="app-container">
      <div class="conetntBox">
        <div class="flex_sb">
          <div class="toolbar-left">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-check"
              :disabled="!multipleSelection.length"
              @click="handleBatchProcess"
            >
              批量处理
            </el-button>
            <span v-if="multipleSelection.length" class="selection-tip">
              已选 {{ multipleSelection.length }} 条
            </span>
          </div>
        </div>

        <el-table
          ref="dataTable"
          :data="dataList"
          max-height="600"
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="48" align="center" />
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="用户ID" align="center" prop="uid" width="90" />
          <el-table-column label="订单号" align="center" prop="orderNum" min-width="170" show-overflow-tooltip />
          <!-- <el-table-column label="管理订单号" align="center" prop="manageOrderNum" min-width="170" show-overflow-tooltip /> -->
          <el-table-column label="标题" align="center" prop="title" min-width="140" show-overflow-tooltip />
          <el-table-column label="失败原因" align="center" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.failReason != null && scope.row.failReason !== '' ? scope.row.failReason : '—' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="日收益" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ formatAmount(scope.row.dailyIncome) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="累计收益" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ formatAmount(scope.row.cumulativeIncome) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="90">
            <template slot-scope="scope">
              <span>{{ formatErrStatus(scope.row.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" width="80">
            <template slot-scope="scope">
              <span>{{ formatErrType(scope.row.type)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="收益日期" align="center" prop="earningDate" width="165">
            <template slot-scope="scope">
              <span>{{ scope.row.earningDate}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="setTime" width="165" >
            <template slot-scope="scope">
              <span>{{ scope.row.setTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" align="center" width="165">
            <template slot-scope="scope">
              <span>{{ scope.row.gmtModified || '—' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleProcessOne(scope.row)">处理</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total >= 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { findOrderDetailsErrList, editOrderDetailsErr } from '@/api/orderDetail/orderDetail'

export default {
  name: 'ProductException',
  data() {
    return {
      loading: false,
      dataList: [],
      total: 0,
      multipleSelection: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formatAmount(val) {
      if (val == null || val === '') return '—'
      const n = Number(val)
      return Number.isNaN(n) ? String(val) : n.toFixed(3)
    },
    formatErrStatus(status) {
      if (status === 1) return '待处理'
      if (status === 2) return '已处理'
      return status != null ? String(status) : '—'
    },
    formatErrType(type) {
      if (type === 1) return '周期计划'
      if (type === 2) return '灵活计划'
      return type != null ? String(type) : '—'
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows
    },
    buildListPayload() {
      return {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      }
    },
    getList() {
      this.loading = true
      findOrderDetailsErrList(this.buildListPayload())
        .then((res) => {
          const page = res.data || {}
          this.dataList = page.list || []
          this.total = page.total != null ? page.total : 0
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 确认后调用处理接口，ids 为字符串数组 */
    submitProcess(ids) {
      if (!ids.length) {
        this.$modal.msgWarning('请选择要处理的记录')
        return
      }
      const body = { ids: ids.map((id) => String(id)) }
      editOrderDetailsErr(body)
        .then(() => {
          this.$modal.msgSuccess('处理成功')
          if (this.$refs.dataTable) {
            this.$refs.dataTable.clearSelection()
          }
          this.multipleSelection = []
          this.getList()
        })
        .catch(() => {})
    },
    handleProcessOne(row) {
      if (!row || row.id == null) return
      this.$modal
        .confirm('是否确认处理该条异常记录？')
        .then(() => {
          this.submitProcess([row.id])
        })
        .catch(() => {})
    },
    handleBatchProcess() {
      const rows = this.multipleSelection
      if (!rows.length) {
        this.$modal.msgWarning('请先勾选要处理的记录')
        return
      }
      const ids = rows.map((r) => r.id).filter((id) => id != null)
      this.$modal
        .confirm(`是否确认批量处理已选 ${ids.length} 条记录？`)
        .then(() => {
          this.submitProcess(ids)
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.mainBox {
  height: calc(100vh - 84px);
  overflow-y: auto;
  background-color: #efefef;
}

.flex_sb {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selection-tip {
  font-size: 13px;
  color: #606266;
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
